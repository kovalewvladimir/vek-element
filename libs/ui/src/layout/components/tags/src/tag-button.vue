<script setup lang="ts">
import { EpCloseIcon, type ITagItem, useNavigationStore } from '@vek-element/ui'
import { trimEndPath } from '@vek-element/ui/utils'
import { VuIconSvgDynamic, VuIconSvgSlot } from '@vek-element/ui-components'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const { tag } = defineProps<{ tag: ITagItem }>()

const router = useRouter()
const navigationStore = useNavigationStore()

const isActive = computed(
  () => trimEndPath(router.currentRoute.value.path) === trimEndPath(tag.path)
)

const tagClk = async () => {
  await router.push(tag.path)
}
const closeClk = async () => {
  if (tag.affix) return
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
    <vu-icon-svg-dynamic
      v-if="tag.route.meta.icon"
      class="icon"
      :size="16"
      :name="tag.route.meta.icon"
    />

    <span class="title">{{ tag.title }}</span>

    <vu-icon-svg-slot
      v-if="!tag.affix"
      class="button-close"
      :size="14"
      @click.prevent.stop="closeClk"
    >
      <ep-close-icon />
    </vu-icon-svg-slot>
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
  font-size: 12px;
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
  border-radius: var(--el-border-radius-base);
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
