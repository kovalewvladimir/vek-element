<script setup lang="ts">
import { VuButtonIcon, type VuButtonIconType, VuContentWrap } from '@vek-element/ui'
import { asyncSleep } from '@vek-element/ui/utils'
import { ElDivider, ElMessage, ElPopconfirm, ElTag } from 'element-plus'
import { ref } from 'vue'

const icons: string[] = ['el-icon-menu', 'el-logo', 'ep--close']

const types: VuButtonIconType[] = ['default', 'success', 'warning', 'info', 'primary', 'danger']

const sizes = ['small', 'default', 'large'] as const

const clickCount = ref(0)
const asyncLoading = ref(false)

const onConfirm = () => ElMessage.success('Подтверждено')

/** Компонент не объявляет обработчики: click проваливается в el-button через $attrs */
const onClick = () => clickCount.value++

const onAsyncClick = async () => {
  asyncLoading.value = true
  await asyncSleep(1500)
  asyncLoading.value = false
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>vu-button-icon</h2>
    </template>

    <div class="flex gap-5">
      <div class="flex-1">
        <el-divider content-position="left">Аттрибут tooltip</el-divider>
        <div
          v-for="icon in icons"
          :key="icon"
          class="mb-10px"
        >
          <vu-button-icon
            v-for="type in types"
            :key="type"
            :type="type"
            :icon="icon"
            :tooltip="`Type: ${type}, Icon: ${icon}`"
          />
        </div>
      </div>

      <div class="flex-1">
        <el-divider content-position="left">С текстом</el-divider>
        <div
          v-for="icon in icons"
          :key="icon"
          class="mb-10px"
        >
          <vu-button-icon
            v-for="type in types"
            :key="type"
            :type="type"
            :icon="icon"
            >{{ type }}</vu-button-icon
          >
        </div>
      </div>
    </div>

    <div class="flex gap-5">
      <div class="flex-1">
        <el-divider content-position="left">Аттрибут text</el-divider>
        <div
          v-for="icon in icons"
          :key="icon"
          class="mb-10px"
        >
          <vu-button-icon
            v-for="type in types"
            :key="type"
            text
            :type="type"
            :icon="icon"
          />
        </div>
      </div>

      <div class="flex-1">
        <el-divider content-position="left">Аттрибут text bg</el-divider>
        <div
          v-for="icon in icons"
          :key="icon"
          class="mb-10px"
        >
          <vu-button-icon
            v-for="type in types"
            :key="type"
            text
            bg
            :type="type"
            :icon="icon"
          />
        </div>
      </div>

      <div class="flex-1">
        <el-divider content-position="left">Аттрибут link</el-divider>
        <div
          v-for="icon in icons"
          :key="icon"
          class="mb-10px"
        >
          <vu-button-icon
            v-for="type in types"
            :key="type"
            link
            :type="type"
            :icon="icon"
          />
        </div>
      </div>
    </div>

    <el-divider content-position="left">Аттрибут disabled</el-divider>

    <div
      v-for="icon in icons"
      :key="icon"
      class="mb-10px"
    >
      <vu-button-icon
        v-for="type in types"
        :key="type"
        disabled
        :type="type"
        :icon="icon"
        :tooltip="`Кнопка заблокирована. Type: ${type}`"
      />
    </div>

    <el-divider content-position="left">В el-popconfirm (без tooltip)</el-divider>

    <div class="mb-10px flex items-center gap-10px">
      <el-popconfirm
        title="Удалить запись?"
        confirm-button-text="Удалить"
        cancel-button-text="Отмена"
        @confirm="onConfirm"
      >
        <template #reference>
          <vu-button-icon
            data-testid="popconfirm-icon"
            type="danger"
            text
            bg
            :icon="icons[2]"
          />
        </template>
      </el-popconfirm>

      <el-popconfirm
        title="Удалить запись?"
        confirm-button-text="Удалить"
        cancel-button-text="Отмена"
        @confirm="onConfirm"
      >
        <template #reference>
          <vu-button-icon
            data-testid="popconfirm-text"
            type="danger"
            :icon="icons[2]"
            >Удалить</vu-button-icon
          >
        </template>
      </el-popconfirm>
    </div>

    <el-divider content-position="left">Аттрибут icon-size</el-divider>

    <vu-button-icon
      v-for="size in [12, 16, 18, 20, 24, 28, 32, 36, 40]"
      :key="size"
      text
      :type="types[0]"
      :icon="icons[0]"
      :icon-size="size"
    />

    <el-divider content-position="left">Аттрибут tooltip-show-after</el-divider>
    <p>Задержка перед показом подсказки в мс. По умолчанию 500.</p>

    <vu-button-icon
      v-for="showAfter in [0, 500, 1500]"
      :key="showAfter"
      text
      bg
      type="primary"
      :icon="icons[0]"
      :tooltip="`tooltip-show-after: ${showAfter} мс`"
      :tooltip-show-after="showAfter"
      class="mr-10px"
    />

    <el-divider content-position="left">Проброс атрибутов el-button</el-divider>
    <p>
      Компонент объявляет <code>inheritAttrs: false</code> и пробрасывает <code>$attrs</code> в
      <code>el-button</code>, поэтому его собственные пропсы дополняются пропсами
      <code>el-button</code>: <code>size</code>, <code>circle</code>, <code>round</code>,
      <code>plain</code>, <code>loading</code>.
    </p>

    <div class="mb-10px flex items-center gap-10px">
      <vu-button-icon
        v-for="size in sizes"
        :key="size"
        type="primary"
        :size="size"
        :icon="icons[0]"
        >size: {{ size }}</vu-button-icon
      >
    </div>

    <div class="mb-10px flex items-center gap-10px">
      <vu-button-icon
        type="primary"
        circle
        :icon="icons[0]"
        tooltip="circle"
      />
      <vu-button-icon
        type="primary"
        round
        :icon="icons[0]"
        >round</vu-button-icon
      >
      <vu-button-icon
        type="primary"
        plain
        :icon="icons[0]"
        >plain</vu-button-icon
      >
      <vu-button-icon
        type="primary"
        :loading="asyncLoading"
        :icon="icons[0]"
        @click="onAsyncClick"
        >loading по клику</vu-button-icon
      >
    </div>

    <el-divider content-position="left">Событие click</el-divider>
    <p>Обработчик тоже приходит через <code>$attrs</code> — отдельного эмита у компонента нет.</p>

    <div class="flex items-center gap-10px">
      <vu-button-icon
        type="success"
        :icon="icons[0]"
        tooltip="С подсказкой (обёртка el-tooltip)"
        @click="onClick"
        >С tooltip</vu-button-icon
      >
      <vu-button-icon
        type="success"
        :icon="icons[0]"
        @click="onClick"
        >Без tooltip</vu-button-icon
      >
      <el-tag type="info">Кликов: {{ clickCount }}</el-tag>
    </div>
  </vu-content-wrap>
</template>
