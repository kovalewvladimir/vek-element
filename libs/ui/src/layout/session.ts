import { useNavigationStore, useUserStore } from './stores'

interface LogoutOptions {
  /**
   * Дать форме входа адрес возврата: /login?redirect=<текущий fullPath>
   *
   * default - false: пользователь вышел сам, возвращать его некуда
   */
  redirect?: boolean
}

/**
 * Выход из системы: сбрасывает пользователя, меню, вкладки и ролевые роуты
 * и уводит на форму входа
 *
 * Звать можно откуда угодно, не только из компонента: сторы и роутер кит
 * достаёт сам. Приложение отвечает за транспорт (куки, refresh) и за решение
 * «сессия закончилась».
 *
 * Уведомление кит не показывает — текст и уместность знает приложение. Выход
 * по протухшей сессии на открытой странице стоит прокомментировать тостом,
 * а холодный старт с мёртвой сессией — нет: пользователь просто открыл
 * приложение, жаловаться ему не на что. Отличить одно от другого помогает
 * возвращаемое значение.
 *
 * @returns true — увёл на логин;
 *          false — приложение ещё не завершило первый переход, на логин
 *          уведёт permissionBeforeEach
 */
const logout = async (options: LogoutOptions = {}): Promise<boolean> => {
  // TODO: сбросить keep-alive в root-layout или layout

  // Сессию гасим всегда: даже когда навигацию трогать нельзя, пользователь
  // после этого вызова уже не авторизован
  await useUserStore().resetUser()

  return await useNavigationStore().resetToLogin(options.redirect)
}

export { logout }
export type { LogoutOptions }
