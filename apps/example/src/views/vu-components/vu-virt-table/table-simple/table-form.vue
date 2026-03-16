<script setup lang="ts">
import { useForm, useNavigationStore, VuContentWrap } from '@vek-element/ui'
import { asyncSleep, simpleRules } from '@vek-element/ui/utils'
import { ElButton, ElForm, ElFormItem, ElInput, ElPopconfirm, type FormRules } from 'element-plus'
import { useRouter } from 'vue-router'

import { generateItem, type TableSimpleItem } from './data'
import { TABLE_SIMPLE_BUS_KEY } from './symbol'

const SLEEP_TIME = 0

const router = useRouter()
const navigation = useNavigationStore()
const backRoute = navigation.getFullPathByName('TableSimple') ?? '/'

const rulesItemForm: FormRules<TableSimpleItem> = {
  name1: [simpleRules.requiredBlur]
}

const {
  form: { data: itemForm, ref: formRef },
  state,
  actions
} = useForm<TableSimpleItem, number>({
  config: {
    routeParamName: 'id',
    navigationToBack: () => router.push(backRoute),
    busKey: TABLE_SIMPLE_BUS_KEY
  },
  api: {
    get: async (id) => {
      if (id === undefined) {
        return generateItem()
      }
      const _id = Number(id)

      await asyncSleep(SLEEP_TIME)
      const data = generateItem()
      return { ...data, id: _id }
    },
    create: async (item) => {
      await asyncSleep(SLEEP_TIME)
      return {
        ...generateItem(),
        name1: item.name1,
        name2: item.name2
      }
    },
    update: async (id, item) => {
      await asyncSleep(SLEEP_TIME)
      const result = {
        ...generateItem(),
        id: id
      }
      if (item.name1) result.name1 = item.name1
      if (item.name2) result.name2 = item.name2
      return result
    },
    delete: async (id) => {
      await asyncSleep(SLEEP_TIME)
      return {
        ...generateItem(),
        id: id
      }
    }
  }
})
</script>

<template>
  <vu-content-wrap v-loading="state.loading.value"
    ><template #header>
      <el-button @click="router.push(backRoute)">Назад</el-button>

      <template v-if="state.is.create.value">
        <el-button
          type="success"
          @click="actions.create"
          >Создать</el-button
        >
      </template>

      <template v-if="state.is.update.value">
        <el-button
          type="success"
          :disabled="state.is.updateEmpty.value"
          @click="() => actions.update(true)"
          >Изменить</el-button
        >
        <el-popconfirm
          width="300"
          title="Вы уверены, что хотите удалить это?"
          @confirm="actions.remove"
        >
          <template #reference>
            <el-button type="danger">Удалить</el-button>
          </template>
        </el-popconfirm>
      </template>
    </template>

    <el-form
      v-if="itemForm"
      ref="formRef"
      class="h-full"
      :model="itemForm"
      :rules="rulesItemForm"
      label-width="150"
      label-position="left"
    >
      <el-form-item
        prop="name1"
        label="name1"
      >
        <el-input v-model="itemForm.name1" />
      </el-form-item>
      <el-form-item
        prop="name2"
        label="name2"
      >
        <el-input v-model="itemForm.name2" />
      </el-form-item>
    </el-form>
  </vu-content-wrap>
</template>
