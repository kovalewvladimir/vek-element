import { expect, test } from '@/fixtures'

/** URL страницы с демо кнопки */
const BUTTON_ICON_URL = '/vu-components/vu-button-icon'

/**
 * Без подсказки VuButtonIcon рендерит единственный корневой элемент (el-button),
 * поэтому его можно передавать в #reference у el-popconfirm.
 * С обёрткой в el-tooltip (фрагмент) поппер молча не открывался.
 */
test.describe('VuButtonIcon — в #reference у el-popconfirm', () => {
  for (const testId of ['popconfirm-icon', 'popconfirm-text']) {
    test(`подтверждение открывается по клику: ${testId}`, async ({ authedPage: page }) => {
      await page.goto(BUTTON_ICON_URL)

      const button = page.locator(`[data-testid="${testId}"]`)
      await expect(button).toBeVisible()

      // Кнопка — это сам el-button, а не обёртка вокруг него
      await expect(button).toHaveJSProperty('tagName', 'BUTTON')

      await button.click()

      const popper = page.locator('.el-popconfirm').filter({ hasText: 'Удалить запись?' })
      await expect(popper).toBeVisible()

      await popper.getByRole('button', { name: 'Отмена' }).click()
      await expect(popper).toBeHidden()
    })
  }

  test('подсказка по-прежнему работает, когда tooltip задан', async ({ authedPage: page }) => {
    await page.goto(BUTTON_ICON_URL)

    const button = page.locator('.el-button').first()
    await button.hover()

    await expect(page.locator('.el-popper.is-dark').first()).toBeVisible({ timeout: 5000 })
  })
})
