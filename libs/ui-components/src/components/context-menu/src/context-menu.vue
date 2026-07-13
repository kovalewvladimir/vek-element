<script setup lang="ts">
import './style.css'

import {
  computed,
  nextTick,
  onBeforeUnmount,
  provide,
  ref,
  useTemplateRef,
  watch
} from 'vue'

import {
  type ContextMenuOptions,
  MENU_LEVEL_KEY,
  MENU_ROOT_KEY,
  VIEWPORT_MARGIN
} from './context'

const { show = false, options = {} } = defineProps<{
  show?: boolean
  options?: ContextMenuOptions
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'close'): void
}>()

const menuRef = useTemplateRef<HTMLElement>('menuRef')
const position = ref({ left: 0, top: 0 })

const theme = computed(() => options.theme ?? '')
const zIndex = computed(() => options.zIndex ?? 100)
const preserveIconWidth = computed(() => options.preserveIconWidth ?? true)
const adjustPosition = computed(() => options.adjustPosition ?? true)

const activeGroup = ref<symbol | null>(null)

const close = (): void => {
  if (!show) return
  emit('update:show', false)
  emit('close')
}

provide(MENU_ROOT_KEY, { theme, zIndex, preserveIconWidth, adjustPosition, close })
provide(MENU_LEVEL_KEY, { activeGroup, depth: 0 })

const updatePosition = (): void => {
  const el = menuRef.value
  if (!el) return

  let left = (options.x ?? 0) + (options.xOffset ?? 0)
  let top = (options.y ?? 0) + (options.yOffset ?? 0)

  if (adjustPosition.value) {
    const { offsetWidth: w, offsetHeight: h } = el
    const vw = window.innerWidth
    const vh = window.innerHeight
    if (left + w > vw - VIEWPORT_MARGIN) left = vw - w - VIEWPORT_MARGIN
    if (top + h > vh - VIEWPORT_MARGIN) top = vh - h - VIEWPORT_MARGIN
    if (left < VIEWPORT_MARGIN) left = VIEWPORT_MARGIN
    if (top < VIEWPORT_MARGIN) top = VIEWPORT_MARGIN
  }

  position.value = { left, top }
}

// Закрытие по клику вне меню.
// Используем capture-фазу pointerdown: клики по вложенным (в т.ч. `position: fixed`)
// подменю и по не-телепортируемым поповерам Element Plus остаются внутри DOM меню.
const onDocPointerDown = (e: PointerEvent): void => {
  const el = menuRef.value
  if (el && !el.contains(e.target as Node)) close()
}
const onKeydown = (e: KeyboardEvent): void => {
  if (e.key === 'Escape') close()
}
const onViewportChange = (): void => updatePosition()

const bind = (): void => {
  document.addEventListener('pointerdown', onDocPointerDown, true)
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onViewportChange)
}
const unbind = (): void => {
  document.removeEventListener('pointerdown', onDocPointerDown, true)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onViewportChange)
}

watch(
  () => show,
  async (visible) => {
    activeGroup.value = null
    if (visible) {
      await nextTick()
      updatePosition()
      bind()
    } else {
      unbind()
    }
  }
)

onBeforeUnmount(unbind)
</script>

<template>
  <teleport to="body">
    <div
      v-if="show"
      ref="menuRef"
      class="mx-context-menu"
      :class="theme"
      :style="{
        position: 'fixed',
        left: `${position.left}px`,
        top: `${position.top}px`,
        zIndex
      }"
      data-type="ContextMenu"
    >
      <div class="mx-context-menu-items">
        <slot />
      </div>
    </div>
  </teleport>
</template>
