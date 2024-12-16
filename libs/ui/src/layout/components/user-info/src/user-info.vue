<script setup lang="ts">
import { useNavigationStore, useUserStore } from '@vek-element/ui'
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const { user, defaultAvatar, resetUser } = useUserStore()
const { clearMenu, clearTags, routerBase } = useNavigationStore()

const handleCommand = (command: string) => {
  switch (command) {
    case 'logout':
      loginOut()
      break
    case 'settings':
      userSettings()
      break
    default:
      break
  }
}

const loginOut = () => {
  // TODO: сбросить keep-alive в root-layout или layout

  resetUser()
  clearMenu()
  clearTags()

  router.clearRoutes()
  router.addRoute(routerBase.login)

  void router.push(routerBase.login.path)
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
