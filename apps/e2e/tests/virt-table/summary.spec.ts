import { expect, getTableStats, test } from '@/fixtures'

/** URL страницы с простой таблицей без дерева */
const TABLE_URL = '/vu-components/vu-virt-table/simple'

/** URL страницы с древовидной таблицей */
const TABLE_TREE_URL = '/vu-components/vu-virt-table/tree'

/** Итог колонки "Сумма", который отдаёт заглушка сервера в примере */
const SERVER_AMOUNT = '123456.78 ₽'

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

/** Включает строку ИТОГО, если в примере она выключена */
async function ensureSummaryEnabled(page: Parameters<typeof getTableStats>[0]) {
  const enableButton = page.getByRole('button', { name: 'ИТОГО Enable', exact: true })
  if (await enableButton.isVisible()) await enableButton.click()

  await expect(page.getByTestId('virt-table-footer')).toBeVisible()
}

/** Приводит режим учёта дочерних строк в древовидной таблице к нужному состоянию */
async function setIncludeTreeChildren(page: Parameters<typeof getTableStats>[0], on: boolean) {
  const button = page.getByRole('button', {
    name: `includeTreeChildren ${on ? 'Enable' : 'Disable'}`,
    exact: true
  })
  if (await button.isVisible()) await button.click()
}

/** Прокрутка таблицы до низа — триггер подгрузки следующей страницы */
async function scrollToBottom(page: Parameters<typeof getTableStats>[0]) {
  await page.getByTestId('virt-table-body').evaluate((el) => {
    el.scrollTop = el.scrollHeight
  })
}

// ============================================================
// Tests
// ============================================================

test.describe('VuVirtTable — строка ИТОГО', () => {
  test('подпись ИТОГО в первой колонке и клиентский итог по загруженным строкам', async ({
    authedPage: page
  }) => {
    await page.goto(TABLE_URL)
    await waitForCount(page, 100)
    await ensureSummaryEnabled(page)

    const cells = page.getByTestId('virt-table-footer').locator('.cell')

    // У колонки "ID" нет своей функции summary — в ней выводится подпись
    await expect(cells.nth(0)).toHaveText('ИТОГО')
    // Колонка "Name" считает количество загруженных строк на клиенте
    await expect(cells.nth(1)).toHaveText('Строк: 100')
  })

  test('клиентский итог пересчитывается после подгрузки следующей страницы', async ({
    authedPage: page
  }) => {
    await page.goto(TABLE_URL)
    await waitForCount(page, 100)
    await ensureSummaryEnabled(page)

    const cells = page.getByTestId('virt-table-footer').locator('.cell')
    await expect(cells.nth(1)).toHaveText('Строк: 100')

    await scrollToBottom(page)
    await waitForCount(page, 200)

    await expect(cells.nth(1)).toHaveText('Строк: 200')
  })

  test('колонка без своей функции показывает итог, пришедший с сервера', async ({
    authedPage: page
  }) => {
    await page.goto(TABLE_URL)
    await waitForCount(page, 100)
    await ensureSummaryEnabled(page)

    // Колонка "Сумма" показывает серверный итог, пока загружены не все страницы
    const amountCell = page.getByTestId('virt-table-footer').locator('.cell').last()
    await expect(amountCell).toHaveText(SERVER_AMOUNT)
  })

  test('после полной загрузки данных итог считается на клиенте', async ({ authedPage: page }) => {
    await page.goto(TABLE_URL)
    await waitForCount(page, 100)
    await ensureSummaryEnabled(page)

    const amountCell = page.getByTestId('virt-table-footer').locator('.cell').last()
    await expect(amountCell).toHaveText(SERVER_AMOUNT)

    // Догружаем все страницы: 5 полных по 100 строк + последняя на 10 строк
    for (const count of [200, 300, 400, 500, 510]) {
      await scrollToBottom(page)
      await waitForCount(page, count)
    }

    const stats = await getTableStats(page)
    expect(stats.isAllDataLoaded).toBe(true)

    // Данные загружены полностью → колонка переключилась на собственный расчёт
    await expect(amountCell).not.toHaveText(SERVER_AMOUNT)
    await expect(amountCell).toHaveText(/^\d+\.\d{2} ₽$/)
    await expect(page.getByTestId('virt-table-footer').locator('.cell').nth(1)).toHaveText(
      'Строк: 510'
    )
  })

  test('кнопка включает и отключает строку ИТОГО', async ({ authedPage: page }) => {
    await page.goto(TABLE_URL)
    await waitForCount(page, 100)
    await ensureSummaryEnabled(page)

    const footer = page.getByTestId('virt-table-footer')

    // Отключаем строку ИТОГО
    await page.getByRole('button', { name: 'ИТОГО Disable', exact: true }).click()
    await expect(footer).toHaveCount(0)

    // Включаем обратно — итоги пересчитываются, серверные загружаются заново
    await page.getByRole('button', { name: 'ИТОГО Enable', exact: true }).click()
    await expect(footer.locator('.cell').nth(1)).toHaveText('Строк: 100')
    await expect(footer.locator('.cell').last()).toHaveText(SERVER_AMOUNT)
  })

  test('showLabel скрывает подпись ИТОГО, не трогая остальные значения', async ({
    authedPage: page
  }) => {
    await page.goto(TABLE_URL)
    await waitForCount(page, 100)
    await ensureSummaryEnabled(page)

    const cells = page.getByTestId('virt-table-footer').locator('.cell')
    await expect(cells.nth(0)).toHaveText('ИТОГО')

    // showLabel: false — колонка "ID" остаётся пустой
    await page.getByRole('button', { name: 'Подпись ИТОГО Disable' }).click()
    await expect(cells.nth(0)).toHaveText('')
    // Остальные итоги на месте
    await expect(cells.nth(1)).toHaveText('Строк: 100')

    await page.getByRole('button', { name: 'Подпись ИТОГО Enable' }).click()
    await expect(cells.nth(0)).toHaveText('ИТОГО')
  })

  test('футер прижат к низу таблицы и не уезжает при прокрутке', async ({ authedPage: page }) => {
    await page.goto(TABLE_URL)
    await waitForCount(page, 100)
    await ensureSummaryEnabled(page)

    const tableBody = page.getByTestId('virt-table-body')
    const footer = page.getByTestId('virt-table-footer')

    // Прокручиваем в середину списка, чтобы футер оказался в позиции sticky
    await tableBody.evaluate((el) => {
      el.scrollTop = 500
    })

    const bodyBox = (await tableBody.boundingBox())!
    const footerBox = (await footer.boundingBox())!

    await expect(footer).toBeVisible()
    // Нижняя граница футера совпадает с нижней границей таблицы (допуск на рамку)
    expect(Math.abs(bodyBox.y + bodyBox.height - (footerBox.y + footerBox.height))).toBeLessThan(3)
  })

  test('ширина ячеек футера синхронизирована с заголовком', async ({ authedPage: page }) => {
    await page.goto(TABLE_URL)
    await waitForCount(page, 100)
    await ensureSummaryEnabled(page)

    const COLUMN_INDEX = 1 // "Name"

    const headerWidth = await page
      .locator('.header .cell')
      .nth(COLUMN_INDEX)
      .boundingBox()
      .then((b) => b?.width ?? 0)

    const footerWidth = await page
      .getByTestId('virt-table-footer')
      .locator('.cell')
      .nth(COLUMN_INDEX)
      .boundingBox()
      .then((b) => b?.width ?? 0)

    expect(headerWidth).toBeGreaterThan(0)
    expect(Math.abs(headerWidth - footerWidth)).toBeLessThan(2)
  })
})

test.describe('VuVirtTable — строка ИТОГО в древовидной таблице', () => {
  test('includeTreeChildren определяет, попадают ли дочерние строки в итог', async ({
    authedPage: page
  }) => {
    await page.goto(TABLE_TREE_URL)
    await waitForCount(page, 10)
    await setIncludeTreeChildren(page, false)

    const cells = page.getByTestId('virt-table-footer').locator('.cell')
    await expect(cells.nth(1)).toHaveText('Строк: 10')

    // Добавляем дочерние строки в первую строку таблицы — она раскрывается
    await page.locator('.row').first().getByRole('button', { name: 'add children' }).click()

    // Дочерние строки попали в данные таблицы
    await expect
      .poll(() => getTableStats(page).then((s) => s?.count ?? 0), { timeout: 15_000 })
      .toBeGreaterThan(10)

    // По умолчанию итог считается только по строкам верхнего уровня
    await expect(cells.nth(1)).toHaveText('Строк: 10')

    // С includeTreeChildren в итог попадают все загруженные строки
    const { count } = await getTableStats(page)
    await setIncludeTreeChildren(page, true)
    await expect(cells.nth(1)).toHaveText(`Строк: ${count}`)
  })
})
