import { nextTick } from 'vue'

/** Функция, которая меняет DOM внутри перехода (может быть async) */
type ViewTransitionUpdate = () => unknown

interface IQueuedUpdate {
  update: ViewTransitionUpdate
  resolve: () => void
  reject: (error: unknown) => void
}

/** Обновления, ожидающие своего перехода */
let pending: IQueuedUpdate[] = []

/** Играет ли переход прямо сейчас */
let isRunning = false

/**
 * Сколько ждём обновление, прежде чем отказаться от анимации (мс)
 *
 * Страховка: пока браузер ждёт `update`, он не рисует вообще ничего, и
 * зависший `update` заморозил бы интерфейс (сам браузер обрывает такой
 * переход только через ~4 секунды).
 *
 * Порог с запасом: навигацию кит анимирует гвардом на `beforeResolve`, так что
 * сеть внутрь перехода не попадает — там остаётся только перерисовка страницы.
 */
const UPDATE_TIMEOUT = 500

/**
 * Поддерживает ли браузер View Transitions API
 *
 * @returns true, если доступен `document.startViewTransition`
 */
export const isViewTransitionSupported = () =>
  typeof document !== 'undefined' && typeof document.startViewTransition === 'function'

/** Применяет накопленные обновления одним переходом */
const flush = () => {
  isRunning = true

  const transition = document.startViewTransition(async () => {
    // Всё, что накопилось, применяем разом: браузер снимет только состояние
    // «до» первого обновления и «после» последнего — пользователь увидит
    // один переход вместо череды промежуточных
    const batch = pending
    pending = []

    for (const item of batch) {
      try {
        await item.update()
        item.resolve()
      } catch (error) {
        item.reject(error)
      }
    }

    // Ждём, пока vue перерисует DOM
    await nextTick()
  })

  // Если обновление затянулось — отказываемся от анимации, чтобы вернуть
  // интерфейс к жизни. DOM обновится без неё, как будто перехода и не было
  // (иначе браузер всё равно оборвёт переход, но только через ~4 секунды)
  const timeout = setTimeout(() => transition.skipTransition(), UPDATE_TIMEOUT)
  void transition.updateCallbackDone.catch(() => {}).then(() => clearTimeout(timeout))

  // Переход может быть пропущен (скрытая вкладка, `skipTransition()`) —
  // это не ошибка, но promise отклоняется
  transition.ready.catch(() => {})

  void transition.finished
    .catch(() => {})
    .then(() => {
      isRunning = false
      if (pending.length > 0) flush()
    })
}

/**
 * Выполняет обновление DOM внутри View Transitions API
 *
 * Браузер делает снимок «до», ждёт `update` + `nextTick` (чтобы vue успел
 * перерисовать DOM), делает снимок «после» и анимирует переход между ними.
 *
 * Снимается страница целиком, поэтому контент и layout (меню, теги, хлебные
 * крошки) меняются одновременно — см. `styles/view-transition.css`.
 *
 * Переходы не накладываются друг на друга: браузер обрывает анимацию, если
 * начать новый переход поверх играющего, и при быстром листании страниц это
 * видно как рывок. Пока переход играет, `update` копятся, а затем применяются
 * одним следующим переходом — ни одно обновление не теряется, но и череды
 * промежуточных анимаций не будет.
 *
 * `update` должен быть быстрым: пока браузер его ждёт, он не рисует вообще
 * ничего — индикатор загрузки внутри перехода замёрзнет вместе со страницей.
 * Долгое ждите снаружи, а внутри меняйте уже готовый DOM. Если `update` всё же
 * не уложился в {@link UPDATE_TIMEOUT}, анимация отменяется, а DOM обновится
 * как обычно.
 *
 * Если браузер не поддерживает API — `update` просто выполняется без анимации.
 *
 * @param update - функция, меняющая DOM (например, переход по роуту)
 * @returns promise, который резолвится после `update` (не дожидаясь анимации)
 *
 * @example
 *   await startViewTransition(() => router.push('/dashboard'))
 */
export const startViewTransition = async (update: ViewTransitionUpdate): Promise<void> => {
  if (!isViewTransitionSupported()) {
    await update()
    return
  }

  await new Promise<void>((resolve, reject) => {
    pending.push({ update, resolve, reject })
    if (!isRunning) flush()
  })
}

export type { ViewTransitionUpdate }
