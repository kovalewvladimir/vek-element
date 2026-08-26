<script setup lang="ts">
import { VuContentWrap } from '@vek-element/ui'
import { simpleRules, validateForm } from '@vek-element/ui/utils'
import {
  ElButton,
  ElDivider,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElTag,
  type FormInstance,
  type FormRules
} from 'element-plus'
import { ref, useTemplateRef } from 'vue'

// =========================
// Types
// =========================

interface IForm {
  name: string
  comment: string
  contract: string
  amount: number | undefined
  count: number | undefined
  city: string
}

// =========================
// Data
// =========================

const formRef = useTemplateRef<FormInstance>('formRef')

const form = ref<IForm>({
  name: '',
  comment: '',
  contract: '',
  amount: undefined,
  count: undefined,
  city: ''
})

/** Готовые правила: обычные объекты element-plus, комбинируются массивом */
const rules: FormRules<IForm> = {
  name: [simpleRules.requiredBlur],
  comment: [simpleRules.minMax(3, 20)],
  contract: [simpleRules.requiredChange, simpleRules.contract],
  amount: [simpleRules.requiredChange, simpleRules.aboveZero],
  count: [simpleRules.integer],
  city: [simpleRules.requiredChange]
}

const result = ref<string>('—')
const isValid = ref<boolean | null>(null)

// =========================
// Methods
// =========================

/** validateForm не бросает исключение: возвращает { isValid, fields } */
const validate = async () => {
  const { isValid: valid, fields } = await validateForm(formRef)
  isValid.value = valid
  result.value = valid ? 'Форма валидна' : `Ошибки в полях: ${Object.keys(fields ?? {}).join(', ')}`
}

const reset = () => {
  formRef.value?.resetFields()
  isValid.value = null
  result.value = '—'
}

const fillValid = () => {
  form.value = {
    name: 'Иванов',
    comment: 'Комментарий',
    contract: '5555-1',
    amount: 100.5,
    count: 3,
    city: 'Москва'
  }
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>utils / form-rules</h2>
    </template>

    <p>
      <code>simpleRules</code> — набор готовых правил element-plus, <code>validateForm</code> —
      обёртка над <code>form.validate</code>, возвращающая результат вместо исключения.
    </p>

    <el-divider content-position="left">Форма</el-divider>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="220px"
      class="max-w-700px"
    >
      <el-form-item
        label="requiredBlur"
        prop="name"
      >
        <el-input
          v-model="form.name"
          placeholder="Обязательное, проверка при уходе с поля"
        />
      </el-form-item>

      <el-form-item
        label="minMax(3, 20)"
        prop="comment"
      >
        <el-input
          v-model="form.comment"
          placeholder="Длина от 3 до 20"
        />
      </el-form-item>

      <el-form-item
        label="requiredChange + contract"
        prop="contract"
      >
        <el-input
          v-model="form.contract"
          placeholder="1111, 5555-1, 111гп, 5555э"
        />
      </el-form-item>

      <el-form-item
        label="requiredChange + aboveZero"
        prop="amount"
      >
        <el-input-number
          v-model="form.amount"
          :controls="false"
          placeholder="Больше 0"
        />
      </el-form-item>

      <el-form-item
        label="integer"
        prop="count"
      >
        <el-input-number
          v-model="form.count"
          :controls="false"
          :precision="2"
          placeholder="Только целое"
        />
      </el-form-item>

      <el-form-item
        label="requiredChange"
        prop="city"
      >
        <el-input
          v-model="form.city"
          placeholder="Обязательное, проверка при изменении"
        />
      </el-form-item>
    </el-form>

    <el-divider content-position="left">Проверка</el-divider>
    <div class="flex items-center gap-10px">
      <el-button
        type="primary"
        @click="validate"
        >validateForm</el-button
      >
      <el-button @click="fillValid">Заполнить корректно</el-button>
      <el-button @click="reset">resetFields</el-button>
      <el-tag :type="isValid === null ? 'info' : isValid ? 'success' : 'danger'">
        {{ result }}
      </el-tag>
    </div>
  </vu-content-wrap>
</template>
