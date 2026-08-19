import { expect, getTableStats, test } from '@/fixtures'

/** URL страницы с простой таблицей без дерева */
const TABLE_URL = '/vu-components/vu-virt-table/simple'

/** Колонка "isExpandable" — ширина 100px, заголовок не помещается и обрезается */
const NARROW_COLUMN_INDEX = 11
/** Колонка "Name" — с автошириной, заголовок помещается целиком */
const WIDE_COLUMN_INDEX = 1

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

/** Ждём загрузки первой страницы и исчезновения оверлея загрузки */
async function waitTableReady(page: Parameters<typeof getTableStats>[0]) {
  await waitForCount(page, 100)
  await expect(page.locator('.el-loading-mask')).toHaveCount(0)
}

// ============================================================
// Tests
// ============================================================

test.describe('VuVirtTable — подсказка при переполнении', () => {
  test('обрезанный заголовок колонки показывает подсказку с полным текстом', async ({
    authedPage: page
  }) => {
    await page.goto(TABLE_URL)
    await waitTableReady(page)

    const headerText = page.locator('.header .cell').nth(NARROW_COLUMN_INDEX).locator('.text')

    // Заголовок действительно обрезан
    const isTruncated = await headerText.evaluate((el) => el.clientWidth < el.scrollWidth)
    expect(isTruncated).toBe(true)

    await headerText.hover()

    // Подсказка появляется с задержкой tooltipShowDelay и содержит полный текст
    await expect(page.getByRole('tooltip')).toHaveText('isExpandable')
  })

  test('заголовок, который помещается целиком, подсказку не показывает', async ({
    authedPage: page
  }) => {
    await page.goto(TABLE_URL)
    await waitTableReady(page)

    const headerText = page.locator('.header .cell').nth(WIDE_COLUMN_INDEX).locator('.text')
    await headerText.hover()

    // Ждём дольше задержки показа подсказки
    await page.waitForTimeout(1000)
    await expect(page.getByRole('tooltip')).toHaveCount(0)
  })

  test('подсказка скрывается при уходе курсора с заголовка', async ({ authedPage: page }) => {
    await page.goto(TABLE_URL)
    await waitTableReady(page)

    const headerText = page.locator('.header .cell').nth(NARROW_COLUMN_INDEX).locator('.text')
    await headerText.hover()
    await expect(page.getByRole('tooltip')).toBeVisible()

    await page.locator('.header .cell').nth(WIDE_COLUMN_INDEX).locator('.text').hover()
    await expect(page.getByRole('tooltip')).toBeHidden()
  })
})
