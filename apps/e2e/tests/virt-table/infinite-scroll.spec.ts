import { expect, getTableStats, test } from '@/fixtures'

/** URL страницы с простой таблицей без дерева */
const TABLE_URL = '/vu-components/vu-virt-table/simple'

/**
 * Ожидаем, что счётчик Count достигнет заданного значения.
 * Используем polling через expect, чтобы дождаться обновления реактивных данных Vue.
 */
async function waitForCount(
  page: Parameters<typeof getTableStats>[0],
  expectedCount: number,
  timeout = 15_000
) {
  await expect
    .poll(() => getTableStats(page).then((s) => s?.count ?? 0), { timeout })
    .toBe(expectedCount)
}

// ============================================================
// Tests
// ============================================================

test.describe('VuVirtTable — infinite scroll', () => {
  test('отображает первую страницу данных после загрузки', async ({ authedPage: page }) => {
    await page.goto(TABLE_URL)

    // Ждём завершения первоначальной загрузки (auth 1.5 s + data 1 s)
    await waitForCount(page, 100)

    const stats = await getTableStats(page)
    expect(stats.page).toBe(1)
    expect(stats.size).toBe(100)
    expect(stats.count).toBe(100)
    expect(stats.isAllDataLoaded).toBe(false)
  })

  test('прокрутка до низа таблицы загружает следующую страницу', async ({ authedPage: page }) => {
    await page.goto(TABLE_URL)

    // Ждём первую страницу
    await waitForCount(page, 100)

    // Прокручиваем контейнер таблицы до самого низа
    const tableBody = page.getByTestId('virt-table-body')
    await tableBody.evaluate((el) => {
      el.scrollTop = el.scrollHeight
    })

    // Бесконечная прокрутка должна запросить вторую страницу
    await waitForCount(page, 200)

    const stats = await getTableStats(page)
    expect(stats.page).toBe(2)
    expect(stats.count).toBe(200)
  })

  test('каждая следующая прокрутка добавляет ещё одну страницу', async ({ authedPage: page }) => {
    await page.goto(TABLE_URL)
    await waitForCount(page, 100)

    const tableBody = page.getByTestId('virt-table-body')

    // Прокрутка 1 → страница 2
    await tableBody.evaluate((el) => {
      el.scrollTop = el.scrollHeight
    })
    await waitForCount(page, 200)

    // Прокрутка 2 → страница 3
    await tableBody.evaluate((el) => {
      el.scrollTop = el.scrollHeight
    })
    await waitForCount(page, 300)

    const stats = await getTableStats(page)
    expect(stats.page).toBe(3)
  })

  test('кнопка Reload сбрасывает данные и загружает первую страницу заново', async ({
    authedPage: page
  }) => {
    await page.goto(TABLE_URL)
    await waitForCount(page, 100)

    // Загружаем вторую страницу через прокрутку
    const tableBody = page.getByTestId('virt-table-body')
    await tableBody.evaluate((el) => {
      el.scrollTop = el.scrollHeight
    })
    await waitForCount(page, 200)

    // Нажимаем Reload
    await page.getByRole('button', { name: 'Reload' }).click()

    // После перезагрузки должна загрузиться первая страница
    await waitForCount(page, 100)

    const stats = await getTableStats(page)
    expect(stats.page).toBe(1)
    expect(stats.count).toBe(100)
  })

  test('isAllDataLoaded становится true когда сервер вернул меньше sizePage записей', async ({
    authedPage: page
  }) => {
    await page.goto(TABLE_URL)
    await waitForCount(page, 100)

    const tableBody = page.getByTestId('virt-table-body')

    // Прокрутка 1 → страница 2
    await tableBody.evaluate((el) => {
      el.scrollTop = el.scrollHeight
    })
    await waitForCount(page, 200)

    // Прокрутка 2 → страница 3
    await tableBody.evaluate((el) => {
      el.scrollTop = el.scrollHeight
    })
    await waitForCount(page, 300)

    // Прокрутка 3 → страница 4
    await tableBody.evaluate((el) => {
      el.scrollTop = el.scrollHeight
    })
    await waitForCount(page, 400)

    // Прокрутка 4 → страница 5
    await tableBody.evaluate((el) => {
      el.scrollTop = el.scrollHeight
    })
    await waitForCount(page, 500)

    // Прокрутка 5 → страница 6 (сервер вернул меньше sizePage=100 записей → isAllDataLoaded=true)
    await tableBody.evaluate((el) => {
      el.scrollTop = el.scrollHeight
    })
    await waitForCount(page, 510)

    const statsAfterScroll = await getTableStats(page)
    expect(statsAfterScroll.count).toBe(510)
    expect(statsAfterScroll.page).toBe(6)
    expect(statsAfterScroll.isAllDataLoaded).toBe(true)
  })
})
