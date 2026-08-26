<script setup lang="ts">
import { VuModalDialog } from '@vek-element/ui'
import { asyncSleep, simpleRules, validateForm } from '@vek-element/ui/utils'
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElTag,
  type FormInstance,
  type FormRules
} from 'element-plus'
import { ref, useTemplateRef } from 'vue'

import { type IEmployee } from './types'

// =========================
// Refs
// =========================

const dialog = useTemplateRef('dialog')
const formRef = useTemplateRef<FormInstance>('formRef')

// =========================
// Data
// =========================

const form = ref<IEmployee>({ name: '', department: '' })
const isSaving = ref(false)

const rules: FormRules<IEmployee> = {
  name: [simpleRules.requiredBlur],
  department: [simpleRules.requiredBlur]
}

// =========================
// Methods
// =========================

/** Аргументы open приходят из useModalDialog(...).open(...) */
async function open(employee: IEmployee) {
  if (!dialog.value) throw new Error('Dialog is not defined')
  form.value = { ...employee }
  return (await dialog.value.open()) as IEmployee | null
}

/**
 * Пока идёт сохранение, is-block-close не даёт закрыть диалог
 * ни крестиком, ни кликом мимо, ни Escape
 */
const save = async () => {
  const { isValid } = await validateForm(formRef)
  if (!isValid) return

  isSaving.value = true
  await asyncSleep(2000)
  isSaving.value = false

  dialog.value?.close({ ...form.value })
}

/** close() без аргумента закрывает диалог, а open резолвится в null */
const cancel = () => dialog.value?.close()

/** Событие open приходит из el-dialog — форма готова к вводу, сбрасываем прошлые ошибки */
const onOpen = () => formRef.value?.clearValidate()

// =========================
// Expose
// =========================

defineExpose({ open })
</script>

<template>
  <vu-modal-dialog
    ref="dialog"
    top="15vh"
    :is-block-close="isSaving"
    @open="onOpen"
  >
    <template #title>
      <div class="flex items-center gap-10px">
        <b>Карточка сотрудника</b>
        <el-tag
          size="small"
          type="info"
          >{{ form.name }}</el-tag
        >
      </div>
    </template>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :disabled="isSaving"
      label-width="120px"
    >
      <el-form-item
        label="ФИО"
        prop="name"
      >
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item
        label="Отдел"
        prop="department"
      >
        <el-input v-model="form.department" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex items-center justify-end gap-10px">
        <el-tag
          v-if="isSaving"
          type="warning"
          >Сохранение — закрытие заблокировано</el-tag
        >
        <el-button
          :disabled="isSaving"
          @click="cancel"
          >Отмена</el-button
        >
        <el-button
          type="primary"
          :loading="isSaving"
          @click="save"
          >Сохранить</el-button
        >
      </div>
    </template>
  </vu-modal-dialog>
</template>
