<script setup lang="ts">
import { useEventBus } from '@vek-element/ui'
import { ElButton, ElCard, ElEmpty, ElTag } from 'element-plus'
import { onScopeDispose, ref } from 'vue'

import { DEMO_BUS_KEY, type DemoEvent, type DemoPayload } from './bus'

const { title, once = false } = defineProps<{
  /** Заголовок карточки */
  title: string
  /** Подписаться через once — сработает один раз */
  once?: boolean
}>()

const log = ref<string[]>([])
const isAlive = ref(true)

const bus = useEventBus<DemoEvent, DemoPayload>(DEMO_BUS_KEY)

const listener = (event: DemoEvent, payload?: DemoPayload) => {
  log.value.unshift(`${event.text} (payload: ${payload ?? '—'})`)
  if (once) isAlive.value = false
}

// Отписка происходит автоматически при уничтожении scope компонента
const stop = once ? bus.once(listener) : bus.on(listener)

onScopeDispose(() => (isAlive.value = false))

const unsubscribe = () => {
  stop()
  isAlive.value = false
}
</script>

<template>
  <el-card
    class="flex-1"
    shadow="never"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <b>{{ title }}</b>
        <el-tag :type="isAlive ? 'success' : 'info'">
          {{ isAlive ? 'подписан' : 'отписан' }}
        </el-tag>
      </div>
    </template>

    <el-button
      size="small"
      :disabled="!isAlive"
      class="mb-10px"
      @click="unsubscribe"
      >off()</el-button
    >

    <el-empty
      v-if="log.length === 0"
      description="Событий не было"
      :image-size="60"
    />
    <div
      v-for="(item, index) in log"
      :key="index"
    >
      {{ item }}
    </div>
  </el-card>
</template>
