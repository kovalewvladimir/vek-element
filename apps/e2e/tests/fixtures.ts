import { type Page, test as base } from '@playwright/test'

/**
 * Читает отладочную панель таблицы через page.evaluate — без ожидания элемента,
 * чтобы не блокировать цикл expect.poll.
 *
 * Пример содержимого: "Page: 1 | Size: 100 | isAllDataLoaded: false | Count: 100 | Count virtual: 12"
 */
export async function getTableStats(page: Page): Promise<{
  page: number
  size: number
  isAllDataLoaded: boolean
  count: number
}> {
  return page.evaluate(() => {
    const el = document.querySelector('[data-testid="virt-table-stats"]')
    const text = el?.textContent ?? ''
    const pageMatch = text.match(/Page:\s*(\d+)/)
    const sizeMatch = text.match(/Size:\s*(\d+)/)
    const allLoadedMatch = text.match(/isAllDataLoaded:\s*(true|false)/)
    const countMatch = text.match(/Count:\s*(\d+)/)
    return {
      page: pageMatch ? Number.parseInt(pageMatch[1]) : 0,
      size: sizeMatch ? Number.parseInt(sizeMatch[1]) : 0,
      isAllDataLoaded: allLoadedMatch ? allLoadedMatch[1] === 'true' : false,
      count: countMatch ? Number.parseInt(countMatch[1]) : 0
    }
  })
}

/**
 * Fixture: страница с уже установленным признаком авторизации в localStorage.
 * Auth в примере проверяет `localStorage.getItem('isLogin') === 'true'`.
 *
 * Сначала открываем origin (чтобы localStorage был привязан к нужному хосту),
 * устанавливаем флаг через evaluate, а затем addInitScript гарантирует
 * его наличие на каждой последующей навигации.
 */
export const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ page }, use) => {
    // Регистрируем init-script ДО первой навигации
    await page.addInitScript(() => {
      localStorage.setItem('isLogin', 'true')
    })
    // Открываем origin, чтобы evaluate ниже выполнился в правильном контексте
    await page.goto('/')
    // Дублируем через evaluate: перестрахуемся на случай гонки SPA-редиректа
    await page.evaluate(() => localStorage.setItem('isLogin', 'true'))
    await use(page)
  }
})

export { expect } from '@playwright/test'
