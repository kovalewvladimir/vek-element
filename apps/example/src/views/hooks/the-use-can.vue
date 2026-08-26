<script setup lang="ts">
import { useCan, VuContentWrap } from '@vek-element/ui'
import { ElAlert, ElButton, ElDivider, ElTable, ElTableColumn, ElTag } from 'element-plus'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

// =========================
// Data
// =========================

const route = useRoute()
const can = useCan()

const unknownRoleResult = ref<string>('—')

// =========================
// Computed
// =========================

/** Дополнительные роли объявляются в навигации маршрута (roles) */
const extraRoles = computed(() =>
  Object.entries(can.roles ?? {}).map(([name, value]) => ({
    name,
    description: value.description,
    active: can.is(name)
  }))
)

// =========================
// Methods
// =========================

/** is() бросает исключение для роли, не объявленной в навигации */
const checkUnknownRole = () => {
  try {
    can.is('UnknownRole')
    unknownRoleResult.value = 'Исключения не было'
  } catch (error) {
    unknownRoleResult.value = (error as Error).message
  }
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>use-can</h2>
    </template>

    <p>
      Роль текущего пользователя для страницы берётся из <code>user.roles[route.meta.name]</code> —
      их отдаёт <code>auth.getUser()</code>. Базовые роли <code>RW</code> (чтение и запись) и
      <code>RO</code> (только чтение) доступны всегда; дополнительные объявляются в навигации
      маршрута в поле <code>roles</code>.
    </p>

    <el-divider content-position="left">Текущий маршрут</el-divider>
    <div class="flex items-center gap-10px">
      <el-tag type="info">route.meta.name: {{ route.meta.name }}</el-tag>
      <el-tag :type="can.isRW ? 'success' : 'info'">isRW: {{ can.isRW }}</el-tag>
      <el-tag :type="can.isRO ? 'success' : 'info'">isRO: {{ can.isRO }}</el-tag>
    </div>

    <el-divider content-position="left">Дополнительные роли маршрута</el-divider>
    <p>
      Объявлены в <code>navigation/hooks.ts</code>. В демо-приложении
      <code>auth.getUser()</code> выдаёт всем маршрутам роль <code>RW</code>, поэтому
      <code>is('TestRole')</code> — <code>false</code>.
    </p>
    <div class="max-w-700px">
      <el-table
        :data="extraRoles"
        empty-text="Дополнительных ролей нет"
      >
        <el-table-column
          prop="name"
          label="Роль"
          width="200"
        />
        <el-table-column
          prop="description"
          label="Описание"
        />
        <el-table-column
          label="is(role)"
          width="140"
        >
          <template #default="{ row }">
            <el-tag :type="row.active ? 'success' : 'info'">{{ row.active }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-divider content-position="left">Неизвестная роль</el-divider>
    <el-alert
      type="warning"
      class="mb-10px"
      :closable="false"
      show-icon
      title="is() бросает исключение, если роль не RW/RO и не объявлена в навигации маршрута — опечатка в имени роли не пройдёт незамеченной"
    />
    <div class="flex items-center gap-10px">
      <el-button @click="checkUnknownRole">is('UnknownRole')</el-button>
      <el-tag type="danger">{{ unknownRoleResult }}</el-tag>
    </div>
  </vu-content-wrap>
</template>
