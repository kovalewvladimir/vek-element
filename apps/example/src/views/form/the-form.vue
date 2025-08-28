<script setup lang="ts">
import { VuContentWrap } from '@vek-element/ui'
import { validateForm } from '@vek-element/ui/utils'
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  type FormInstance,
  type FormRules
} from 'element-plus'
import { ref, useTemplateRef } from 'vue'

const formRef = useTemplateRef<FormInstance>('formRef')
const formData = ref({
  name: '',
  email: ''
})

const rules: FormRules = {
  name: [
    { required: true, message: 'Пожалуйста, введите имя', trigger: 'blur' },
    { min: 3, message: 'Имя должно содержать минимум 3 символа', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Пожалуйста, введите email', trigger: 'blur' },
    { type: 'email', message: 'Введите корректный email', trigger: 'blur' }
  ]
}

const submitForm = async () => {
  const { isValid } = await validateForm(formRef)
  if (isValid) {
    console.log('Форма успешно отправлена!')
  } else {
    console.log('Ошибка валидации')
  }
}
</script>

<template>
  <vu-content-wrap>
    <template #header><h2>Форма</h2></template>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item
        label="Имя"
        prop="name"
      >
        <el-input
          v-model="formData.name"
          placeholder="Введите имя"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Email"
        prop="email"
      >
        <el-input
          v-model="formData.email"
          placeholder="Введите email"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm"
          >Отправить</el-button
        >
      </el-form-item>
    </el-form>
  </vu-content-wrap>
</template>
