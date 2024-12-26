<script setup lang="ts">
import { useLoading } from '@vek-element/ui'
import { asyncSleep } from '@vek-element/ui/utils'
import { ElButton, ElLink } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const { loading, loadingWrapper } = useLoading()

const loginClk = loadingWrapper(async () => {
  auth.login()

  if (route.query.redirect) {
    await router.push(route.query.redirect as string)
    return
  }
  await router.push('/')
})

const loginClkFail = loadingWrapper(async () => {
  await asyncSleep(1000)
  throw new Error('login fail')
})
</script>

<template>
  <div class="flex justify-center items-center h-100vh flex-col">
    <h1>Login</h1>

    <el-link
      class="mb-10px mt-10px"
      href="/params/original"
      >el-link params/original</el-link
    >

    <el-button
      link
      class="mb-10px"
      @click="() => router.push('params/original')"
      >el-button params/original</el-button
    >

    <el-button
      :loading="loading"
      @click="loginClk"
      >Login</el-button
    >

    <el-button
      :loading="loading"
      @click="loginClkFail"
      >loginClkFail</el-button
    >
  </div>
</template>
