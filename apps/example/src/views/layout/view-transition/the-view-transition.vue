<script setup lang="ts">
import {
  useLayoutConfigStore,
  useNavigationStore,
  useViewTransition,
  VuContentWrap
} from '@vek-element/ui'
import { ElAlert, ElButton, ElDivider, ElSwitch, ElTag } from 'element-plus'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

// =========================
// Data
// =========================

const config = useLayoutConfigStore()
const navigation = useNavigationStore()

/**
 * start — изменение DOM внутри перехода (навигацию оборачивать не нужно)
 * isEnabled — включено в конфиге И поддерживается браузером
 */
const { isEnabled, start } = useViewTransition()

const router = useRouter()

const scrollLink = navigation.getFullPathByName('the-scroll-1')
const dashboardLink = navigation.getFullPathByName('the-dashboard')

const cards = ref([1, 2, 3, 4, 5])
const isRow = ref(true)

// =========================
// Methods
// =========================

const goScroll = async () => {
  if (scrollLink) await router.push(scrollLink)
}
const goDashboard = async () => {
  if (dashboardLink) await router.push(dashboardLink)
}

/** Каждая карточка со своим view-transition-name — браузер сам анимирует переезд */
const shuffle = async () => {
  await start(() => {
    cards.value = cards.value.toSorted(() => Math.random() - 0.5)
  })
}
const toggleLayout = async () => {
  await start(() => {
    isRow.value = !isRow.value
  })
}
</script>

<template>
  <vu-content-wrap>
    <template #header>
      <h2>view-transition</h2>
    </template>

    <p>
      Переходы между страницами анимируются через
      <code>document.startViewTransition</code>: браузер снимает страницу «до» и «после» и сам
      кросс-фейдит их. Снимается страница целиком, поэтому контент, меню, теги и хлебные крошки
      меняются одновременно. Длительность — css переменная
      <code>--view-transition-duration</code> (150ms).
    </p>

    <p>
      Анимируется любая навигация — <code>router.push</code>, <code>&lt;router-link&gt;</code>,
      кнопки «назад»/«вперёд» в браузере. Оборачивать вызовы не нужно: кит вешает гвард на
      <code>beforeResolve</code>, то есть на момент, когда чанк страницы уже догружен и гварды
      отработали. Хук <code>useViewTransition</code> нужен для остального DOM.
    </p>

    <p>
      Переходы не накладываются друг на друга: клики, пришедшие во время анимации, копятся и
      применяются одним следующим переходом. Промежуточные роуты при этом проходятся (теги
      создаются), но не мелькают — анимация играет сразу на последнюю запрошенную страницу.
    </p>

    <p>
      Пока браузер ждёт обновление DOM, он не рисует вообще ничего — спиннер внутри перехода замёрз
      бы вместе со страницей. Поэтому загрузка идёт до перехода, при живом интерфейсе: если
      навигация затянулась дольше 200ms, сверху layout появляется полоса загрузки, а переход играет
      уже на готовой странице.
    </p>

    <el-divider content-position="left">Состояние</el-divider>

    <div class="flex items-center gap-20px">
      <el-switch
        :model-value="config.viewTransition.enabled"
        active-text="Анимация перехода"
        @update:model-value="config.viewTransition.setEnabled($event as boolean)"
      />
      <el-tag :type="isEnabled ? 'success' : 'info'"> isEnabled: {{ isEnabled }} </el-tag>
    </div>

    <el-alert
      class="mt-10px"
      :closable="false"
      type="info"
      show-icon
      title="Выключить можно и на старте: createUI({ layout: { viewTransition: false } })"
    />

    <el-divider content-position="left">Переход по роуту</el-divider>

    <div class="flex items-center gap-10px">
      <el-button
        type="primary"
        @click="goDashboard"
        >push → Главная</el-button
      >
      <el-button
        type="primary"
        @click="goScroll"
        >push → Scroll 1</el-button
      >
      <router-link
        v-if="scrollLink"
        :to="scrollLink"
        ><el-button>router-link → Scroll 1</el-button></router-link
      >
    </div>

    <el-divider content-position="left">Анимация произвольного DOM</el-divider>

    <p>
      <code>start</code> работает не только с роутером: у карточек свой
      <code>view-transition-name</code>, поэтому браузер анимирует их переезд без единого
      <code>@keyframes</code>. Элемент со своим именем выпадает из снимка страницы и анимируется
      отдельной группой — поэтому карточки участвуют и в переходе между страницами.
    </p>

    <div class="flex items-center gap-10px">
      <el-button @click="shuffle">Перемешать</el-button>
      <el-button @click="toggleLayout">{{ isRow ? 'В столбец' : 'В строку' }}</el-button>
    </div>

    <div
      class="mt-10px flex gap-10px"
      :class="isRow ? 'flex-row' : 'flex-col w-200px'"
    >
      <div
        v-for="card in cards"
        :key="card"
        class="card"
        :style="{ viewTransitionName: `vek-demo-card-${card}` }"
      >
        {{ card }}
      </div>
    </div>
  </vu-content-wrap>
</template>

<style scoped>
p + p {
  margin-top: 10px;
}

.card {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 80px;
  width: 80px;

  color: #fff;
  background-color: var(--el-color-primary);
  border-radius: var(--el-border-radius-base);
}
</style>
