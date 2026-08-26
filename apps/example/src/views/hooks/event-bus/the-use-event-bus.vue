<script setup lang="ts">
import { useEventBus, VuContentWrap } from '@vek-element/ui'
import { ElButton, ElDivider, ElInput, ElInputNumber, ElSwitch, ElTag } from 'element-plus'
import { ref } from 'vue'

import { DEMO_BUS_KEY, type DemoEvent, type DemoPayload } from './bus'
import EventBusReceiver from './event-bus-receiver.vue'

// =========================
// Data
// =========================

const text = ref<string>('Привет')
const payload = ref<number>(1)

const showReceiver1 = ref(true)
const showReceiver2 = ref(true)
const showReceiverOnce = ref(true)

const emitCount = ref(0)

const bus = useEventBus<DemoEvent, DemoPayload>(DEMO_BUS_KEY)

// =========================
// Methods
// =========================

const send = () => {
  emitCount.value++
  bus.emit({ text: `${text.value} #${emitCount.value}` }, payload.value)
}

/** Удаляет все подписки этого ключа */
const reset = () => bus.reset()
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>use-event-bus</h2>
    </template>

    <p>
      Шина событий на общем ключе. Подписки <code>on</code>/<code>once</code> снимаются
      автоматически при уничтожении scope компонента, вручную — возвращённой функцией или
      <code>off</code>/<code>reset</code>.
    </p>

    <el-divider content-position="left">Отправитель</el-divider>
    <div class="flex items-center gap-10px">
      <el-input
        v-model="text"
        class="!w-200px"
        placeholder="event.text"
      />
      <el-input-number
        v-model="payload"
        :min="0"
      />
      <el-button
        type="primary"
        @click="send"
        >emit</el-button
      >
      <el-button
        type="danger"
        @click="reset"
        >reset (снять все подписки)</el-button
      >
      <el-tag type="info">emit вызван: {{ emitCount }}</el-tag>
    </div>

    <el-divider content-position="left">Подписчики</el-divider>
    <div class="flex items-center gap-20px">
      <span>
        Получатель 1
        <el-switch v-model="showReceiver1" />
      </span>
      <span>
        Получатель 2
        <el-switch v-model="showReceiver2" />
      </span>
      <span>
        once
        <el-switch v-model="showReceiverOnce" />
      </span>
    </div>

    <p>Выключение переключателя размонтирует компонент — подписка снимается сама.</p>

    <div class="flex gap-10px">
      <event-bus-receiver
        v-if="showReceiver1"
        title="Получатель 1 (on)"
      />
      <event-bus-receiver
        v-if="showReceiver2"
        title="Получатель 2 (on)"
      />
      <event-bus-receiver
        v-if="showReceiverOnce"
        title="Получатель 3 (once)"
        once
      />
    </div>
  </vu-content-wrap>
</template>
