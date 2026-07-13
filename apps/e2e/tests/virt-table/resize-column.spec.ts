import { expect, getTableStats, test } from '@/fixtures'

/** URL страницы с простой таблицей без дерева */
const TABLE_URL = '/vu-components/vu-virt-table/simple'

/**
 * Ожидаем готовности таблицы к взаимодействию:
 *  1) счётчик Count достиг значения (данные загрузились);
 *  2) оверлей v-loading полностью исчез (иначе маска перехватывает mousedown
 *     во время fade-out анимации).
 */
async function waitTableReady(
  page: Parameters<typeof getTableStats>[0],
  expectedCount: number,
  timeout = 15_000
) {
  await expect
    .poll(() => getTableStats(page).then((s) => s?.count ?? 0), { timeout })
    .toBe(expectedCount)
  await expect(page.locator('.el-loading-mask')).toHaveCount(0)
}

/** Ширина заголовочной ячейки колонки по индексу */
async function headerCellWidth(
  page: Parameters<typeof getTableStats>[0],
  index: number
): Promise<number> {
  const box = await page.locator('.header .cell').nth(index).boundingBox()
  return box?.width ?? 0
}

test.describe('VuVirtTable — изменение ширины колонки', () => {
  test('перетаскивание границы увеличивает ширину колонки', async ({ authedPage: page }) => {
    await page.goto(TABLE_URL)
    await waitTableReady(page, 100)

    // Колонка "Name" (индекс 1) — с автошириной
    const COLUMN_INDEX = 1
    const widthBefore = await headerCellWidth(page, COLUMN_INDEX)

    const handle = page
      .locator('.header .cell')
      .nth(COLUMN_INDEX)
      .getByTestId('virt-table-resize-handle')

    const box = await handle.boundingBox()
    expect(box).not.toBeNull()

    const startX = box!.x + box!.width / 2
    const y = box!.y + box!.height / 2
    const DELTA = 80

    await page.mouse.move(startX, y)
    await page.mouse.down()
    await page.mouse.move(startX + DELTA, y, { steps: 5 })
    // До отпускания мыши ширина ещё не применяется — показывается только линия-указатель
    await expect(page.locator('.resize-indicator')).toBeVisible()
    await page.mouse.up()

    const widthAfter = await headerCellWidth(page, COLUMN_INDEX)

    // Ширина выросла примерно на DELTA (допуск на округления/границы)
    expect(widthAfter).toBeGreaterThan(widthBefore + DELTA - 10)
    expect(widthAfter).toBeLessThan(widthBefore + DELTA + 10)

    // Линия-указатель скрыта после отпускания
    await expect(page.locator('.resize-indicator')).toBeHidden()
  })

  test('ширина заголовка и ячеек данных синхронизирована после ресайза', async ({
    authedPage: page
  }) => {
    await page.goto(TABLE_URL)
    await waitTableReady(page, 100)

    const COLUMN_INDEX = 2 // "Name1"
    const widthBefore = await headerCellWidth(page, COLUMN_INDEX)

    const handle = page
      .locator('.header .cell')
      .nth(COLUMN_INDEX)
      .getByTestId('virt-table-resize-handle')

    const box = await handle.boundingBox()
    const startX = box!.x + box!.width / 2
    const y = box!.y + box!.height / 2

    await page.mouse.move(startX, y)
    await page.mouse.down()
    await page.mouse.move(startX + 60, y, { steps: 5 })
    await page.mouse.up()

    const headerWidth = await headerCellWidth(page, COLUMN_INDEX)

    // Ширина реально изменилась (ресайз применился)
    expect(headerWidth).toBeGreaterThan(widthBefore + 40)

    // Ширина соответствующей ячейки в первой строке данных
    const firstRowCellWidth = await page
      .locator('.row')
      .first()
      .locator('.cell')
      .nth(COLUMN_INDEX)
      .boundingBox()
      .then((b) => b?.width ?? 0)

    expect(Math.abs(headerWidth - firstRowCellWidth)).toBeLessThan(2)
  })

  test('уменьшение колонки в пределах заголовка не запускает сортировку', async ({
    authedPage: page
  }) => {
    await page.goto(TABLE_URL)
    await waitTableReady(page, 100)

    const COLUMN_INDEX = 1 // "Name"
    const headerCell = page.locator('.header .cell').nth(COLUMN_INDEX)

    // Изначально сортировки нет
    await expect(headerCell.locator('.text.c-blue')).toHaveCount(0)

    const widthBefore = await headerCellWidth(page, COLUMN_INDEX)

    const handle = headerCell.getByTestId('virt-table-resize-handle')
    const box = await handle.boundingBox()
    const startX = box!.x + box!.width / 2
    const y = box!.y + box!.height / 2

    // Тянем влево (уменьшаем), оставаясь по вертикали в границах заголовка,
    // mouseup приходится на тело ячейки — раньше это ложно срабатывало как сортировка
    await page.mouse.move(startX, y)
    await page.mouse.down()
    await page.mouse.move(startX - 60, y, { steps: 5 })
    await page.mouse.up()

    // Ширина уменьшилась
    const widthAfter = await headerCellWidth(page, COLUMN_INDEX)
    expect(widthAfter).toBeLessThan(widthBefore - 40)

    // Сортировка НЕ применилась
    await expect(headerCell.locator('.text.c-blue')).toHaveCount(0)
  })

  test('нельзя сузить колонку ниже минимальной ширины', async ({ authedPage: page }) => {
    await page.goto(TABLE_URL)
    await waitTableReady(page, 100)

    const COLUMN_INDEX = 1
    const handle = page
      .locator('.header .cell')
      .nth(COLUMN_INDEX)
      .getByTestId('virt-table-resize-handle')

    const box = await handle.boundingBox()
    const startX = box!.x + box!.width / 2
    const y = box!.y + box!.height / 2

    await page.mouse.move(startX, y)
    await page.mouse.down()
    // Тащим далеко влево — за пределы колонки
    await page.mouse.move(startX - 1000, y, { steps: 10 })
    await page.mouse.up()

    const widthAfter = await headerCellWidth(page, COLUMN_INDEX)
    // COLUMN_MIN_WIDTH = 25
    expect(widthAfter).toBeGreaterThanOrEqual(25)
    expect(widthAfter).toBeLessThan(35)
  })
})
