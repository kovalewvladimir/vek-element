<script setup lang="ts">
import { EpCloseIcon, VuIconSvgSlot } from '@vek-element/ui'
import { ElDialog } from 'element-plus'
import { nextTick, ref } from 'vue'

const {
  dialogTitle = 'Dialog',
  isBlockClose = false,
  top = '10px'
} = defineProps<{
  /**
   *   Заголовок диалога (по умолчанию 'Dialog')
   */
  dialogTitle?: string

  /**
   *   Блокировка закрытия диалога (по умолчанию false)
   */

  isBlockClose?: boolean
  /**
   *   Отступ сверху (по умолчанию '10px')
   */
  top?: string
}>()

const emit = defineEmits(['open'])

const visible = ref<boolean>(false)
let resolvePromise: ((value: unknown) => void) | null = null

const handlerOpen = () => {
  emit('open')
}
const open = () => {
  const promise = new Promise((resolve) => {
    resolvePromise = resolve
  })
  visible.value = true

  return promise
}

const close = (outputObj = null) => {
  // nextTick нужен для того, чтобы isBlockClose успел обновиться
  void nextTick(() => {
    if (isBlockClose) return

    if (outputObj !== null && resolvePromise) {
      resolvePromise(outputObj)
    }

    visible.value = false
  })
}
const handleBeforeClose = (done: () => void) => {
  if (isBlockClose) return

  done()
}
const handlerClose = () => {
  if (resolvePromise) {
    resolvePromise(null)
  }
}

defineExpose({ open, close })
</script>

<template>
  <el-dialog
    v-model="visible"
    class="vu-modal-dialog"
    destroy-on-close
    :lock-scroll="false"
    draggable
    :top="top"
    :close-on-click-modal="false"
    :show-close="false"
    :before-close="handleBeforeClose"
    @open="handlerOpen"
    @close="handlerClose"
  >
    <template #header>
      <div class="flex items-center">
        <div>
          <slot name="title">
            {{ dialogTitle }}
          </slot>
        </div>
        <div class="flex flex-grow-1 flex-justify-end">
          <vu-icon-svg-slot
            color="var(--el-color-info)"
            hover-color="var(--el-color-primary)"
            class="cursor-pointer"
            :size="24"
            @click="close()"
          >
            <ep-close-icon />
          </vu-icon-svg-slot>
        </div>
      </div>
    </template>

    <slot />

    <template
      v-if="$slots.footer"
      #footer
    >
      <div><slot name="footer" /></div>
    </template>
  </el-dialog>
</template>

<style>
.vu-modal-dialog {
  padding-left: 0;
  padding-right: 0;

  .el-dialog__header > div,
  .el-dialog__footer > div {
    padding-left: var(--el-dialog-padding-primary);
    padding-right: var(--el-dialog-padding-primary);
  }

  .el-dialog__body {
    padding: var(--el-dialog-padding-primary);
  }

  .el-dialog__header {
    border-bottom: 1px solid var(--el-border-color);
  }

  .el-dialog__footer {
    border-top: 1px solid var(--el-border-color);
  }
}
</style>
