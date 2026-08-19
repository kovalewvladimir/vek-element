import { expect, test } from '@/fixtures'

/**
 * Снимает CPU-профиль сценариев стенда `/vu-components/vu-virt-table/perf`.
 *
 * В обычный прогон не входит — это не регрессионный тест, а инструмент: он ничего не
 * утверждает, а печатает числа для решения «делать ли пункты 7–9 плана оптимизации».
 *
 *   PERF=1 npx playwright test virt-table-perf
 *   PERF=1 PERF_ROWS=100000 PERF_SIZE=100 npx playwright test virt-table-perf --headed
 */

const ROWS = Number(process.env.PERF_ROWS ?? 50_000)
const SIZE = Number(process.env.PERF_SIZE ?? 100)

/**
 * Кадры реактивности, опознаваемые по имени однозначно.
 *
 * Это заведомо **нижняя** оценка: обработчики Proxy компилируются в функции с именами
 * `get` и `set`, и отличить их от чужих одноимённых методов по профилю нельзя, поэтому
 * они сюда не входят — а в топе по собственному времени они обычно на первых местах.
 * Источник истины — список ниже, а не эта цифра.
 */
const REACTIVITY_FRAMES = new Set([
  'track',
  'trigger',
  'toWrapped',
  'toReactive',
  'toRaw',
  'createReactiveObject',
  'createGetter',
  'createSetter',
  'isDirty',
  'refreshComputed',
  'get value',
  'set value',
  'addSub',
  'removeSub',
  'link',
  'propagate',
  'startBatch',
  'endBatch'
])

test('CPU-профиль виртуальной таблицы', async ({ authedPage: page }) => {
  test.skip(!process.env.PERF, 'Ручной инструмент: PERF=1 npx playwright test virt-table-perf')
  test.setTimeout(900_000)

  await page.goto(`/vu-components/vu-virt-table/perf?rows=${ROWS}&size=${SIZE}`)
  await expect(page.getByTestId('virt-table-body')).toBeVisible()

  // Набор данных не должен попасть в профиль — грузим до старта профилировщика
  await page.getByRole('button', { name: 'Загрузить всё' }).click()
  await expect
    .poll(() => page.getByTestId('perf-loaded').textContent(), { timeout: 600_000 })
    .toContain(String(ROWS))

  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Profiler.enable')
  await cdp.send('Profiler.setSamplingInterval', { interval: 100 })
  await cdp.send('Profiler.start')

  await page.getByRole('button', { name: 'Прогнать всё' }).click()
  // Пока сценарии идут, плашка «загружено N» скрыта — ждём её возврата
  await expect(page.getByTestId('perf-loaded')).toBeHidden({ timeout: 30_000 })
  await expect(page.getByTestId('perf-loaded')).toBeVisible({ timeout: 600_000 })

  const { profile } = await cdp.send('Profiler.stop')

  // Собственное время по узлам: samples[i] исполнялся timeDeltas[i] микросекунд
  const selfById = new Map<number, number>()
  const deltas = profile.timeDeltas ?? []
  const samples = profile.samples ?? []
  for (const [i, id] of samples.entries())
    selfById.set(id, (selfById.get(id) ?? 0) + (deltas[i] ?? 0))

  const frames = profile.nodes.map((node) => {
    const frame = node.callFrame
    const file = ((frame.url || '').split('/').at(-1) ?? '').split('?')[0]
    return {
      name: frame.functionName || '(anonymous)',
      file,
      self: (selfById.get(node.id) ?? 0) / 1000
    }
  })

  const cpu = frames.reduce((acc, f) => acc + f.self, 0)
  const idle = frames
    .filter((f) => f.name === '(idle)' || f.name === '(program)')
    .reduce((acc, f) => acc + f.self, 0)
  const reactivity = frames
    .filter((f) => REACTIVITY_FRAMES.has(f.name))
    .reduce((acc, f) => acc + f.self, 0)
  const busy = cpu - idle

  // eslint-disable-next-line unicorn/prefer-dom-node-text-content -- это локатор Playwright, а не DOM-узел: innerText сохраняет разбиение на строки
  const table = await page.getByTestId('perf-results').innerText()

  const share = (value: number) => (busy > 0 ? ((value / busy) * 100).toFixed(1) : '0.0')

  console.log(`\n=== Стенд: строк ${ROWS}, sizePage ${SIZE} ===\n${table}`)
  console.log(
    `\n=== CPU: всего ${cpu.toFixed(0)} мс, из них занято ${busy.toFixed(0)} мс ===` +
      `\nреактивность, нижняя оценка (без обезличенных get/set из Proxy): ` +
      `${reactivity.toFixed(0)} мс — ${share(reactivity)} %\n`
  )

  const top = frames
    .filter((f) => f.self > 0.5 && f.name !== '(idle)' && f.name !== '(program)')
    .toSorted((a, b) => b.self - a.self)
    .slice(0, 25)

  console.log('=== Топ по собственному времени ===')
  for (const f of top)
    console.log(
      `${f.self.toFixed(1).padStart(9)} мс  ${share(f.self).padStart(5)} %  ${f.name}${f.file ? ` @ ${f.file}` : ''}`
    )
})
