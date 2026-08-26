<script setup lang="ts">
import {
  type ContextMenuOptions,
  VuContentWrap,
  VuContextMenu,
  VuContextMenuGroup,
  VuContextMenuItem,
  VuContextMenuSeparator,
  VuIconSvgDynamic
} from '@vek-element/ui'
import { ElButton, ElDivider, ElSwitch, ElTag } from 'element-plus'
import { reactive, ref } from 'vue'

// =========================
// Data
// =========================

const show = ref(false)
const options = reactive<ContextMenuOptions>({
  x: 0,
  y: 0,
  zIndex: 3000,
  preserveIconWidth: true,
  adjustPosition: true
})

/** Пункт с галочкой: `click-close = false`, поэтому меню остаётся открытым */
const checked = ref(false)
const lastAction = ref<string>('—')
const closeCount = ref(0)

const fruits = ['Яблоко', 'Груша', 'Слива']

// =========================
// Methods
// =========================

/** Открыть меню в точке курсора */
const openByEvent = (e: MouseEvent) => {
  options.x = e.clientX
  options.y = e.clientY
  show.value = true
}

/** Открыть меню под кнопкой (xOffset/yOffset — смещение от точки x/y) */
const openByButton = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  options.x = rect.left
  options.y = rect.bottom
  options.yOffset = 4
  show.value = true
}

const onItem = (name: string) => {
  lastAction.value = name
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>vu-context-menu</h2>
    </template>

    <p>
      Облегчённая замена <code>@imengyu/vue3-context-menu</code>. Меню телепортируется в
      <code>body</code>, закрывается по клику вне, по <code>Escape</code> и по клику на пункте (если
      <code>click-close</code> не выключен).
    </p>

    <el-divider content-position="left">Опции</el-divider>
    <div class="flex items-center gap-20px">
      <span>
        preserveIconWidth
        <el-switch v-model="options.preserveIconWidth" />
      </span>
      <span>
        adjustPosition
        <el-switch v-model="options.adjustPosition" />
      </span>
      <el-tag type="info">z-index: {{ options.zIndex }}</el-tag>
    </div>

    <el-divider content-position="left">Вызов меню</el-divider>
    <div class="flex items-center gap-10px">
      <el-button
        type="primary"
        @click="openByButton"
        >Открыть под кнопкой</el-button
      >
      <el-tag>Последнее действие: {{ lastAction }}</el-tag>
      <el-tag type="info">Событие close: {{ closeCount }}</el-tag>
    </div>

    <div
      class="mt-10px h-160px flex items-center justify-center b-1 b-dashed b-[var(--el-border-color)] rounded-[var(--el-border-radius-base)] select-none"
      @contextmenu.prevent="openByEvent"
    >
      Клик правой кнопкой по этой области
    </div>

    <el-divider content-position="left">Меню</el-divider>
    <p>
      Пункты: обычный, со слотом <code>icon</code>, с галочкой (<code>checked</code>), со слотом
      <code>label</code>, заблокированный (<code>disabled</code>), разделитель и вложенные группы.
    </p>

    <vu-context-menu
      v-model:show="show"
      :options="options"
      @close="closeCount++"
    >
      <vu-context-menu-item
        label="Обычный пункт"
        @click="onItem('Обычный пункт')"
      />

      <vu-context-menu-item
        label="Пункт с иконкой"
        @click="onItem('Пункт с иконкой')"
      >
        <template #icon>
          <vu-icon-svg-dynamic
            name="el-icon-menu"
            :size="16"
          />
        </template>
      </vu-context-menu-item>

      <vu-context-menu-item
        label="Галочка (меню не закрывается)"
        :checked="checked"
        :click-close="false"
        @click="checked = !checked"
      />

      <vu-context-menu-item
        label="Заблокированный"
        disabled
      />

      <vu-context-menu-separator />

      <vu-context-menu-item @click="onItem('Слот label')">
        <template #label>
          <span class="c-[var(--el-color-danger)] font-bold">Слот label</span>
        </template>
      </vu-context-menu-item>

      <vu-context-menu-separator />

      <vu-context-menu-group label="Группа (наведи)">
        <template #icon>
          <vu-icon-svg-dynamic
            name="el-logo"
            :size="16"
          />
        </template>

        <vu-context-menu-item
          v-for="fruit in fruits"
          :key="fruit"
          :label="fruit"
          @click="onItem(fruit)"
        />

        <vu-context-menu-separator />

        <vu-context-menu-group label="Вложенная группа">
          <vu-context-menu-item
            label="Глубокий пункт"
            @click="onItem('Глубокий пункт')"
          />
        </vu-context-menu-group>
      </vu-context-menu-group>

      <vu-context-menu-group
        label="Заблокированная группа"
        disabled
      >
        <vu-context-menu-item label="Не откроется" />
      </vu-context-menu-group>
    </vu-context-menu>
  </vu-content-wrap>
</template>
