import { expect, getTableStats, test } from '@/fixtures'

/** URL страницы с древовидной таблицей */
const TABLE_TREE_URL = '/vu-components/vu-virt-table/tree'

/**
 * Тело таблицы отрисовывается через v-memo, а часть чтений данных идёт по сырым
 * (не реактивным) строкам. Эти тесты закрывают сценарии, где такая оптимизация
 * может «залипнуть»: каждый из них падает, если убрать соответствующую зависимость.
 */
async function waitForCount(page: Parameters<typeof getTableStats>[0], count: number) {
  await expect
    .poll(() => getTableStats(page).then((s) => s?.count ?? 0), { timeout: 20_000 })
    .toBe(count)
}

test.describe('VuVirtTable — оптимизация рендера', () => {
  test('раскрытие и схлопывание узла дерева', async ({ authedPage: page }) => {
    await page.goto(TABLE_TREE_URL)
    await waitForCount(page, 10)

    const arrow = page.locator('.row .expend-icon').first()
    await arrow.click()

    await expect.poll(() => getTableStats(page).then((s) => s.count), { timeout: 20_000 }).toBe(20)

    // дочерние строки получили отступ уровня
    const indents = await page
      .locator('.row .wrap-icon')
      .evaluateAll((els) =>
        els.map((el) => (el.previousElementSibling as HTMLElement)?.style.flex ?? '')
      )
    expect(indents.some((v) => v.includes('20px'))).toBe(true)

    await arrow.click()
    await waitForCount(page, 10)
  })

  test('Tree Disable убирает стрелки, Enable возвращает', async ({ authedPage: page }) => {
    await page.goto(TABLE_TREE_URL)
    await waitForCount(page, 10)

    // .expend-icon рисуется только у раскрываемых строк, .wrap-icon — у всех
    await expect.poll(() => page.locator('.row .expend-icon').count()).toBeGreaterThan(0)

    await page.getByRole('button', { name: /^Tree Disable$/ }).click()
    await expect(page.locator('.row .expend-icon')).toHaveCount(0)

    await page.getByRole('button', { name: /^Tree Enable$/ }).click()
    await expect.poll(() => page.locator('.row .expend-icon').count()).toBeGreaterThan(0)
  })

  test('кнопка Изменить перерисовывает первую строку', async ({ authedPage: page }) => {
    await page.goto(TABLE_TREE_URL)
    await waitForCount(page, 10)

    const firstRow = page.locator('.row').first()
    const before = await firstRow.textContent()

    await page.getByRole('button', { name: 'Изменить' }).click()
    await expect.poll(() => firstRow.textContent(), { timeout: 10_000 }).not.toBe(before)
  })

  test('клик по строке переносит подсветку', async ({ authedPage: page }) => {
    await page.goto(TABLE_TREE_URL)
    await waitForCount(page, 10)

    const rows = page.locator('.row')
    await rows.nth(1).click()
    await expect(rows.nth(1)).toHaveClass(/active/)

    await rows.nth(3).click()
    await expect(rows.nth(3)).toHaveClass(/active/)
    await expect(rows.nth(1)).not.toHaveClass(/active/)
    await expect(page.locator('.row.active')).toHaveCount(1)
  })

  test('клик по заголовку сортирует колонку', async ({ authedPage: page }) => {
    await page.goto(TABLE_TREE_URL)
    await waitForCount(page, 10)

    // Обработчики @click/@contextmenu рендерятся только в ветке isHeader компонента
    // virt-table-row — в теле и футере они были мёртвым грузом. Клик по заголовку
    // выставляет column.sort, а header-cell красит подпись в c-blue и рисует иконку.
    const headerCell = page.locator('.header .cell').nth(1)
    const headerText = headerCell.locator('.text')

    await expect(headerText).not.toHaveClass(/c-blue/)

    await headerCell.click()
    await expect(headerText).toHaveClass(/c-blue/)
  })

  test('скрытие колонки через меню применяется к строкам', async ({ authedPage: page }) => {
    await page.goto(TABLE_TREE_URL)
    await waitForCount(page, 10)

    const cellsBefore = await page.locator('.row').first().locator('.cell').count()

    await page.locator('.header .cell').nth(2).click({ button: 'right' })
    await page.getByText('Настройки', { exact: true }).hover()
    await page.getByText('Столбцы', { exact: true }).hover()
    await page.getByText('Скрыть', { exact: true }).click()

    await expect(page.locator('.row').first().locator('.cell')).toHaveCount(cellsBefore - 1)
  })
})
