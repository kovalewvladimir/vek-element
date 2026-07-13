<script setup lang="ts">
import { computed, inject } from 'vue'

import { CHECK_PATH, MENU_LEVEL_KEY, MENU_ROOT_KEY } from './context'

const {
  label = '',
  checked = false,
  disabled = false,
  clickClose = true,
  customClass = ''
} = defineProps<{
  /** Текст пункта (можно заменить слотом `label`) */
  label?: string
  /** Показать галочку слева */
  checked?: boolean
  /** Пункт недоступен */
  disabled?: boolean
  /** Закрывать меню по клику. По умолчанию true */
  clickClose?: boolean
  /** Доп. css-класс на строку пункта */
  customClass?: string
}>()

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()

const root = inject(MENU_ROOT_KEY)
const level = inject(MENU_LEVEL_KEY)

const preserveIconWidth = computed(() => root?.preserveIconWidth.value ?? true)

const onClick = (e: MouseEvent): void => {
  if (disabled) return
  emit('click', e)
  if (clickClose) root?.close()
}

// Наведение на обычный пункт закрывает открытое соседнее подменю этого уровня.
const onMouseenter = (): void => {
  if (level) level.activeGroup.value = null
}
</script>

<template>
  <div
    class="mx-context-menu-item-wrapper"
    data-type="ContextMenuItem"
  >
    <div
      class="mx-context-menu-item"
      :class="[disabled ? 'disabled' : '', customClass]"
      @click="onClick"
      @mouseenter="onMouseenter"
    >
      <div class="mx-item-row">
        <div
          class="mx-icon-placeholder"
          :class="{ 'preserve-width': preserveIconWidth }"
        >
          <slot name="icon" />
          <svg
            v-if="checked"
            class="mx-checked-mark"
            aria-hidden="true"
            viewBox="0 0 1024 1024"
          >
            <path :d="CHECK_PATH" />
          </svg>
        </div>

        <slot name="label">
          <span class="label">{{ label }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>
