<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  provide,
  ref,
  useTemplateRef,
  watch
} from 'vue'

import {
  ARROW_PATH,
  MENU_LEVEL_KEY,
  MENU_ROOT_KEY,
  VIEWPORT_MARGIN
} from './context'

const { label = '', disabled = false } = defineProps<{
  /** Заголовок группы */
  label?: string
  /** Группа недоступна */
  disabled?: boolean
  /**
   * Совместимость с API `@imengyu/vue3-context-menu`: группа не реагирует на
   * клик (раскрывается по наведению), поэтому проп только поглощается.
   */
  clickClose?: boolean
}>()

const root = inject(MENU_ROOT_KEY)
const parentLevel = inject(MENU_LEVEL_KEY)

const id = Symbol('vt-context-menu-group')
const rowRef = useTemplateRef<HTMLElement>('rowRef')
const submenuRef = useTemplateRef<HTMLElement>('submenuRef')
const submenuPos = ref({ left: 0, top: 0 })
const ready = ref(false)

const opened = computed(() => parentLevel?.activeGroup.value === id)
const preserveIconWidth = computed(() => root?.preserveIconWidth.value ?? true)
const theme = computed(() => root?.theme.value ?? '')
const zIndex = computed(() => (root?.zIndex.value ?? 100) + (parentLevel?.depth ?? 0) + 1)

// Уровень для дочерних пунктов/групп этого подменю.
const childActiveGroup = ref<symbol | null>(null)
provide(MENU_LEVEL_KEY, {
  activeGroup: childActiveGroup,
  depth: (parentLevel?.depth ?? 0) + 1
})

const onMouseenter = (): void => {
  if (disabled) return
  if (parentLevel) parentLevel.activeGroup.value = id
}

// Подменю с `position: fixed` — не обрезается прокруткой родителя и escape'ит
// его overflow. Координаты считаем от строки-заголовка.
const updateSubmenuPosition = (): void => {
  const row = rowRef.value
  const box = submenuRef.value
  if (!row || !box) return

  const r = row.getBoundingClientRect()
  const w = box.offsetWidth
  const h = box.offsetHeight
  const vw = window.innerWidth
  const vh = window.innerHeight

  // По умолчанию — вправо; при нехватке места — влево.
  let left = r.right - 3
  if (left + w > vw - VIEWPORT_MARGIN) {
    left = r.left - w + 3
    if (left < VIEWPORT_MARGIN) left = Math.max(VIEWPORT_MARGIN, vw - w - VIEWPORT_MARGIN)
  }

  let top = r.top - 6
  if (top + h > vh - VIEWPORT_MARGIN) top = vh - h - VIEWPORT_MARGIN
  if (top < VIEWPORT_MARGIN) top = VIEWPORT_MARGIN

  submenuPos.value = { left, top }
}

const onViewportChange = (): void => updateSubmenuPosition()

watch(opened, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    updateSubmenuPosition()
    ready.value = true
    window.addEventListener('resize', onViewportChange)
    window.addEventListener('scroll', onViewportChange, true)
  } else {
    ready.value = false
    childActiveGroup.value = null
    window.removeEventListener('resize', onViewportChange)
    window.removeEventListener('scroll', onViewportChange, true)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})
</script>

<template>
  <div
    class="mx-context-menu-item-wrapper"
    data-type="ContextMenuGroup"
  >
    <div
      ref="rowRef"
      class="mx-context-menu-item"
      :class="[disabled ? 'disabled' : '', opened ? 'open' : '']"
      @mouseenter="onMouseenter"
    >
      <div class="mx-item-row">
        <div
          class="mx-icon-placeholder"
          :class="{ 'preserve-width': preserveIconWidth }"
        >
          <slot name="icon" />
        </div>
        <span class="label">{{ label }}</span>
      </div>

      <div class="mx-item-row">
        <svg
          class="mx-right-arrow"
          aria-hidden="true"
          viewBox="0 0 1024 1024"
        >
          <path :d="ARROW_PATH" />
        </svg>
      </div>
    </div>

    <div
      v-if="opened"
      ref="submenuRef"
      class="mx-context-menu"
      :class="theme"
      :style="{
        position: 'fixed',
        left: `${submenuPos.left}px`,
        top: `${submenuPos.top}px`,
        zIndex,
        opacity: ready ? 1 : 0
      }"
      data-type="ContextSubMenu"
    >
      <div class="mx-context-menu-items">
        <slot />
      </div>
    </div>
  </div>
</template>
