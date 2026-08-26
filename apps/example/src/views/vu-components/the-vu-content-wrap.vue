<script setup lang="ts">
import { VuContentWrap } from '@vek-element/ui'
import { ElButton, ElDivider, ElTag } from 'element-plus'
import { ref } from 'vue'

const rows = ref<number[]>(Array.from({ length: 50 }, (_, i) => i + 1))
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>vu-content-wrap</h2>
    </template>

    <p>
      Обёртка страницы: занимает 100% высоты родителя, рисует рамку/фон темы и прокручивает только
      содержимое. Слот <code>header</code> необязателен — без него шапка не рендерится.
    </p>

    <el-divider content-position="left">Со слотом header</el-divider>
    <div class="h-160px">
      <vu-content-wrap>
        <template #header>
          <div class="flex items-center justify-between">
            <b>Заголовок</b>
            <el-button
              type="primary"
              size="small"
              >Действие</el-button
            >
          </div>
        </template>
        Содержимое блока.
      </vu-content-wrap>
    </div>

    <el-divider content-position="left">Без слота header</el-divider>
    <div class="h-120px">
      <vu-content-wrap
        >Шапки нет — блок <code>vu-content-wrap__header</code> не создаётся.</vu-content-wrap
      >
    </div>

    <el-divider content-position="left">Прокрутка содержимого</el-divider>
    <div class="h-200px">
      <vu-content-wrap>
        <template #header>
          <b>Шапка остаётся на месте</b>
        </template>
        <div
          v-for="row in rows"
          :key="row"
          class="mb-5px"
        >
          <el-tag>Строка {{ row }}</el-tag>
        </div>
      </vu-content-wrap>
    </div>

    <el-divider content-position="left">Вложенность</el-divider>
    <div class="h-220px">
      <vu-content-wrap>
        <template #header>
          <b>Внешний</b>
        </template>
        <div class="h-140px flex gap-10px">
          <vu-content-wrap>
            <template #header>Вложенный 1</template>
            Колонка 1
          </vu-content-wrap>
          <vu-content-wrap>
            <template #header>Вложенный 2</template>
            Колонка 2
          </vu-content-wrap>
        </div>
      </vu-content-wrap>
    </div>
  </vu-content-wrap>
</template>
