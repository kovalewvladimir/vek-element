<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { ElaIconSvgDynamic, ElaIconSvgSlot, EpCloseIcon } from '../../../../components/icon-svg'
import { type ITagItem, useNavigationStore } from '../../../stores/navigate'

const { tag } = defineProps<{ tag: ITagItem }>()

const router = useRouter()
const navigationStore = useNavigationStore()

const isActive = computed(() => router.currentRoute.value.path === tag.path)

const tagClk = async () => {
  await router.push(tag.path)
}
const closeClk = async () => {
  await navigationStore.closeTag(tag)
}
</script>

<template>
  <div
    class="button"
    :class="{ active: isActive }"
    @click="tagClk"
    @click.middle="closeClk"
  >
    <ela-icon-svg-dynamic
      v-if="tag.route.meta.icon"
      class="icon"
      :size="16"
      :name="tag.route.meta.icon"
    />

    <span class="title">{{ tag.title }}</span>

    <ela-icon-svg-slot
      class="button-close"
      :size="14"
      @click.prevent.stop="closeClk"
    >
      <ep-close-icon />
    </ela-icon-svg-slot>
  </div>
</template>

<style scoped>
.active,
.active .icon,
.button.active:hover,
.button.active:hover .icon {
  background-color: var(--el-color-primary);
  color: #fff;
}
.button.active .button-close {
  visibility: visible;
}

.title {
  margin-right: 5px;
  white-space: nowrap;
}

.icon {
  margin-right: 5px;

  color: var(--el-text-color-placeholder);
}

.button {
  display: flex;
  align-items: center;
  justify-content: center;

  user-select: none;
  cursor: pointer;

  height: 29px;

  padding-left: 10px;
  padding-right: 20px;

  border: 1px solid var(--el-border-color);
  border-radius: 3px;
}
.button + .button {
  margin-left: 5px;
}
.button:hover,
.button:hover .icon {
  color: var(--el-color-primary);
}

.button-close {
  margin-right: -16px;
  visibility: hidden;
}
.button:hover .button-close {
  visibility: visible;
}
</style>
