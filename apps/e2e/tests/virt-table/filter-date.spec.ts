import { expect, getTableStats, test } from '@/fixtures'

/** URL страницы с простой таблицей без дерева */
const TABLE_URL = '/vu-components/vu-virt-table/simple'

/** Колонка "date.create" — единственная колонка типа date */
const DATE_COLUMN_INDEX = 10

/** Ждём загрузки первой страницы и исчезновения оверлея загрузки */
async function waitTableReady(page: Parameters<typeof getTableStats>[0]) {
  await expect
    .poll(() => getTableStats(page).then((s) => s?.count ?? 0), { timeout: 15_000 })
    .toBe(100)
  await expect(page.locator('.el-loading-mask')).toHaveCount(0)
}

/** Название текущего месяца с большой буквы — как в списке быстрых фильтров */
function currentMonthLabel(now: Date) {
  const month = new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(now)
  return month.charAt(0).toUpperCase() + month.slice(1)
}

const pad = (value: number) => String(value).padStart(2, '0')

/** Границы текущего месяца в формате YYYY-MM-DD */
function currentMonthRange(now: Date) {
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  return {
    start: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`,
    end: `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`
  }
}

// ============================================================
// Tests
// ============================================================

test.describe('VuVirtTable — фильтр по дате', () => {
  test('выбор месяца применяет фильтр за весь месяц', async ({ authedPage: page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))

    await page.goto(TABLE_URL)
    await waitTableReady(page)

    const headerCell = page.locator('.header .cell').nth(DATE_COLUMN_INDEX)
    await headerCell.click({ button: 'right' })

    const select = page.locator('.el-select').first()
    await expect(select).toBeVisible()
    await select.click()

    const now = new Date()
    const label = currentMonthLabel(now)
    await page
      .locator('.el-select-dropdown__item', { hasText: new RegExp(`^${label}$`) })
      .first()
      .click()

    // Фильтр применяется сразу — меню закрывается
    await expect(page.locator('.el-select')).toHaveCount(0)

    // В меню появился фильтр "Между" с границами месяца
    const { start, end } = currentMonthRange(now)
    await headerCell.click({ button: 'right' })
    await expect(page.getByText(`Между: ${start},${end}`)).toBeVisible()

    expect(errors).toEqual([])
  })
})
