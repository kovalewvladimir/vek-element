<script setup lang="ts">
import { useModalDialog, VuContentWrap } from '@vek-element/ui'
import { ElButton, ElDivider, ElTag } from 'element-plus'
import { getCurrentInstance, ref } from 'vue'

import FormDialog from './form-dialog.vue'
import Test01Dialog from './test01-dialog.vue'
import { type IEmployee } from './types'

// =========================
// Data
// =========================

const currentInstance = getCurrentInstance()

const basicResult = ref<string>('—')
const formResult = ref<string>('—')

// =========================
// Composition API
// =========================

// useModalDialog монтирует компонент диалога рядом с текущим,
// вызывает его метод open и ждёт результат
const { open: openBasic } = useModalDialog(Test01Dialog, currentInstance)
const { open: openForm } = useModalDialog(FormDialog, currentInstance)

// =========================
// Methods
// =========================

const showBasic = async () => {
  const result = await openBasic('Аргумент, переданный в open()')
  basicResult.value = result === null ? 'null (диалог закрыт без результата)' : String(result)
}

const showForm = async () => {
  const result: IEmployee | null = await openForm({
    name: 'Иванов Иван',
    department: 'Разработка'
  })
  formResult.value =
    result === null ? 'null (Отмена или крестик)' : `${result.name} — ${result.department}`
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>vu-modal-dialog</h2>
    </template>

    <p>
      Диалог открывается императивно:
      <code>useModalDialog(component, currentInstance)</code> возвращает <code>open()</code>,
      который монтирует компонент, дожидается закрытия и резолвится результатом. Компонент диалога
      должен экспозить свой <code>open()</code>, внутри — обёртка <code>vu-modal-dialog</code> с
      методами <code>open</code>/<code>close</code>.
    </p>
    <p>
      Закрытие через <code>close(data)</code> резолвит <code>data</code>, через крестик,
      <code>Escape</code> или <code>close()</code> без аргумента — <code>null</code>. Клик мимо
      диалога его не закрывает.
    </p>

    <el-divider content-position="left">Базовый диалог</el-divider>
    <p>
      Показывает аттрибут <code>dialog-title</code>, передачу аргумента в <code>open()</code> и
      уведомление об ошибке из <code>loadingWrapper</code> внутри диалога.
    </p>
    <div class="flex items-center gap-10px">
      <el-button
        type="primary"
        @click="showBasic"
        >Открыть</el-button
      >
      <el-tag type="info">Результат: {{ basicResult }}</el-tag>
    </div>

    <el-divider content-position="left">Диалог с формой и блокировкой закрытия</el-divider>
    <p>
      Слот <code>title</code> вместо <code>dialog-title</code>, аттрибут <code>top</code>, слот
      <code>footer</code>, событие <code>open</code>. Во время «сохранения» включается
      <code>is-block-close</code> — диалог не закрыть, пока операция не завершится.
    </p>
    <div class="flex items-center gap-10px">
      <el-button
        type="primary"
        @click="showForm"
        >Открыть карточку</el-button
      >
      <el-tag type="info">Результат: {{ formResult }}</el-tag>
    </div>

    <el-divider content-position="left">Особенности</el-divider>
    <ul class="list-disc pl-20px">
      <li>
        Каждый вызов <code>open()</code> монтирует новый экземпляр компонента диалога — состояние
        между открытиями не сохраняется, начальные данные передаются аргументами
        <code>open()</code>.
      </li>
      <li>Диалог монтируется в DOM только на время показа (<code>destroy-on-close</code>).</li>
      <li>Окно можно перетаскивать за заголовок (<code>draggable</code>).</li>
      <li>
        Слот <code>footer</code> необязателен: без него нижняя панель с разделителем не рендерится.
      </li>
      <li>
        Прокрутка страницы под диалогом не блокируется (<code>lock-scroll: false</code>), поэтому
        поповеры element-plus внутри диалога ведут себя корректно.
      </li>
    </ul>
  </vu-content-wrap>
</template>
