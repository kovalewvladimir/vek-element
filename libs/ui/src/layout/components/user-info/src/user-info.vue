<script setup lang="ts">
import { logout, useUserStore } from '@vek-element/ui'
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'

const { user, defaultAvatar } = useUserStore()

const handleCommand = (command: string) => {
  switch (command) {
    case 'logout': {
      loginOut()
      break
    }
    case 'settings': {
      userSettings()
      break
    }
    default: {
      break
    }
  }
}

const loginOut = () => {
  // Без redirect: пользователь вышел сам, возвращать его после входа некуда
  void logout()
}
const userSettings = () => {
  throw new Error('Not implemented')
}
</script>

<template>
  <el-dropdown
    class="custom-hover"
    trigger="click"
    @command="handleCommand"
  >
    <div class="flex items-center pr-10px">
      <span class="text-14px pr-5px">{{ user?.name }}</span>
      <img
        :src="user?.avatar || defaultAvatar"
        width="40"
        height="40"
        class="w-40px rounded-50%"
      />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="settings">Профиль</el-dropdown-item>
        <el-dropdown-item
          divided
          command="logout"
          >Выйти</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
