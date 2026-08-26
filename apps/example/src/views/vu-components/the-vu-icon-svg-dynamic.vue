<script setup lang="ts">
import { VuContentWrap, VuIconSvgDynamic } from '@vek-element/ui'
import { ElAlert, ElButton, ElDivider, ElMessage, ElTag } from 'element-plus'
import { ref } from 'vue'

/** Имена берутся из спрайта, который собирает плагин @vek-element/vite-svg */
const icons: string[] = ['el-icon-menu', 'el-logo', 'ep--close', 'vek-logo']

const sizes: number[] = [16, 24, 32, 48, 64]

const clickCount = ref(0)
const showUnknown = ref(false)

const onClick = (name: string) => {
  clickCount.value++
  ElMessage.success(`Клик по иконке ${name}`)
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>vu-icon-svg-dynamic</h2>
    </template>

    <p>
      Иконка ищется в svg-спрайте по имени файла: <code>name="el-logo"</code> — это
      <code>src/assets/svgs/el-logo.svg</code>. Спрайт собирает vite-плагин
      <code>@vek-element/vite-svg</code>, поэтому имена доступны без импорта файла. Если нужно
      передать svg напрямую — есть <code>vu-icon-svg-slot</code>.
    </p>

    <el-divider content-position="left">Разные иконки</el-divider>
    <div class="flex items-center gap-20px">
      <div
        v-for="icon in icons"
        :key="icon"
        class="flex flex-col items-center gap-5px"
      >
        <vu-icon-svg-dynamic :name="icon" />
        <el-tag
          type="info"
          size="small"
          >{{ icon }}</el-tag
        >
      </div>
    </div>

    <el-divider content-position="left">Аттрибут size</el-divider>
    <div class="flex items-center gap-20px">
      <vu-icon-svg-dynamic
        v-for="size in sizes"
        :key="size"
        name="el-icon-menu"
        :size="size"
      />
    </div>

    <el-divider content-position="left">Аттрибуты color и hover-color</el-divider>
    <p>
      Цвет применяется к путям с <code>fill="currentColor"</code>; иконка с зашитыми цветами
      (<code>el-logo</code>) их сохраняет.
    </p>
    <div class="flex items-center gap-20px">
      <vu-icon-svg-dynamic
        name="ep--close"
        color="red"
        hover-color="green"
      />
      <vu-icon-svg-dynamic
        name="el-icon-menu"
        color="#409eff"
        hover-color="#f56c6c"
      />
      <vu-icon-svg-dynamic
        name="el-icon-menu"
        color="var(--el-color-success)"
        hover-color="var(--el-color-warning)"
      />
    </div>

    <el-divider content-position="left">Событие click</el-divider>
    <div class="flex items-center gap-20px">
      <vu-icon-svg-dynamic
        v-for="icon in icons"
        :key="icon"
        :name="icon"
        :size="28"
        hover-color="var(--el-color-primary)"
        class="cursor-pointer"
        @click="onClick(icon)"
      />
      <el-tag type="info">Кликов: {{ clickCount }}</el-tag>
    </div>

    <el-divider content-position="left">Неизвестное имя</el-divider>
    <el-alert
      type="warning"
      class="mb-10px"
      :closable="false"
      show-icon
      title="Компонент не падает: место под иконку остаётся пустым, а в консоль уходит предупреждение «Icon '...' not found»"
    />
    <div class="flex items-center gap-20px">
      <el-button @click="showUnknown = !showUnknown">
        {{ showUnknown ? 'Убрать' : 'Показать' }} иконку с несуществующим именем
      </el-button>
      <vu-icon-svg-dynamic
        v-if="showUnknown"
        name="icon-does-not-exist"
      />
    </div>
  </vu-content-wrap>
</template>
