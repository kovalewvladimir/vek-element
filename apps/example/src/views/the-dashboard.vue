<script setup lang="ts">
import {
  type INavigation,
  useNavigationStore,
  VuContentWrap,
  VuIconSvgDynamic
} from '@vek-element/ui'
import { ElButton, ElLink, ElMessage, ElTag } from 'element-plus'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

// =========================
// Constants
// =========================

const REPO_URL = 'https://github.com/kovalewvladimir/vek-element'

/** Подставляется vite через define, см. vite.config.ts */
const UI_VERSION = __UI_VERSION__
const INSTALL_COMMAND = 'npm i @vek-element/ui element-plus'

/** Разделы главной. Ключ — стабильное имя из навигации */
const SECTIONS: { name: string; description: string }[] = [
  {
    name: 'TheComponents',
    description: 'Компоненты @vek-element/ui-components: таблица, диалог, автокомплит, иконки.'
  },
  {
    name: 'TheHooks',
    description: 'Хуки: загрузка, шина событий, виртуальный список, права доступа.'
  },
  {
    name: 'TheUtils',
    description: 'Утилиты: даты, правила валидации форм, задержки, работа с путями.'
  },
  {
    name: 'TheLayout',
    description: 'Layout и роутер: параметры и кэш страниц, прокрутка, вложенное меню, теги.'
  },
  {
    name: 'Playground',
    description: 'Песочница: layout-config и navigation store, переходы по имени роута.'
  }
]

// =========================
// Data
// =========================

const router = useRouter()
const navigation = useNavigationStore()

// =========================
// Methods
// =========================

/** Первая доступная страница ветки — туда ведёт карточка */
const firstPagePath = (nav: INavigation): string | null => {
  if (nav.children) {
    for (const child of nav.children) {
      const path = firstPagePath(child)
      if (path) return path
    }
    return null
  }
  return nav.hidden ? null : navigation.getFullPathByName(nav.name)
}

/**
 * Пункты, которые реально видны в меню.
 * Скрытая группа (hidden) сама не рисуется, но отдаёт наверх своих детей.
 */
const visibleMenuChildren = (nav: INavigation): INavigation[] =>
  (nav.children ?? []).flatMap((child) =>
    child.hidden ? (child.children ? visibleMenuChildren(child) : []) : [child]
  )

const pluralPages = (count: number): string => {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return `${count} пункт`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} пункта`
  return `${count} пунктов`
}

const openPath = (path: string | null) => {
  if (path) void router.push(path)
}

const copyInstall = async () => {
  try {
    await navigator.clipboard.writeText(INSTALL_COMMAND)
    ElMessage.success('Команда скопирована')
  } catch {
    // Буфер обмена недоступен (не https или запрет в браузере) — команду видно на странице
    ElMessage.warning('Не удалось скопировать, скопируйте вручную')
  }
}

// =========================
// Computed
// =========================

const sections = computed(() =>
  SECTIONS.map(({ name, description }) => {
    const nav = navigation.findByName(name)
    if (!nav) return null

    return {
      key: name,
      title: nav.title,
      icon: nav.icon,
      description,
      count: visibleMenuChildren(nav).length,
      to: firstPagePath(nav)
    }
  }).filter((section) => section !== null)
)

/** Плитки быстрого перехода к страницам компонентов */
const components = computed(() => {
  const nav = navigation.findByName('TheComponents')
  return nav
    ? visibleMenuChildren(nav).map((child) => ({
        key: child.name,
        title: child.title,
        icon: child.icon,
        to: firstPagePath(child)
      }))
    : []
})
</script>

<template>
  <vu-content-wrap>
    <!-- Обложка -->
    <section
      class="mb-24px flex flex-col items-start gap-16px rounded-[var(--el-border-radius-base)] b-1 b-solid b-[var(--el-border-color-lighter)] bg-[var(--el-color-primary-light-9)] p-28px"
    >
      <div class="flex items-center gap-16px">
        <vu-icon-svg-dynamic
          name="vek-logo"
          :size="56"
        />
        <div>
          <div class="flex items-center gap-10px">
            <h1 class="m-0 text-28px font-600 c-[var(--el-text-color-primary)]">
              @vek-element/ui
            </h1>
            <el-tag
              type="primary"
              size="small"
              >v{{ UI_VERSION }}</el-tag
            >
          </div>
          <p class="m-0 mt-6px text-15px c-[var(--el-text-color-regular)]">
            Библиотека layout, компонентов и хуков для Vue 3 и Element Plus
          </p>
        </div>
      </div>

      <p class="m-0 max-w-760px c-[var(--el-text-color-regular)]">
        Это демо-приложение: каждая страница — рабочий пример одной части библиотеки. Само
        приложение собрано на её же layout, роутере и сторах.
      </p>

      <div class="flex flex-wrap items-center gap-12px">
        <el-button
          type="primary"
          @click="openPath(components[0]?.to ?? null)"
          >Посмотреть компоненты</el-button
        >
        <el-link
          :href="REPO_URL"
          target="_blank"
          type="primary"
          >GitHub</el-link
        >
      </div>
    </section>

    <!-- Разделы -->
    <h2 class="mb-12px text-18px font-600 c-[var(--el-text-color-primary)]">Разделы</h2>
    <div class="mb-24px grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-16px">
      <button
        v-for="section in sections"
        :key="section.key"
        type="button"
        class="vek-card flex cursor-pointer flex-col gap-10px rounded-[var(--el-border-radius-base)] b-1 b-solid b-[var(--el-border-color-light)] bg-[var(--el-fill-color-blank)] p-18px text-left"
        @click="openPath(section.to)"
      >
        <div class="flex items-center gap-10px">
          <vu-icon-svg-dynamic
            v-if="section.icon"
            :name="section.icon"
            :size="22"
            color="var(--el-color-primary)"
          />
          <span class="text-16px font-600 c-[var(--el-text-color-primary)]">
            {{ section.title }}
          </span>
        </div>

        <p class="m-0 flex-1 text-13px c-[var(--el-text-color-regular)]">
          {{ section.description }}
        </p>

        <span class="text-12px c-[var(--el-text-color-secondary)]">
          {{ pluralPages(section.count) }}
        </span>
      </button>
    </div>

    <!-- Компоненты -->
    <h2 class="mb-12px text-18px font-600 c-[var(--el-text-color-primary)]">Компоненты</h2>
    <div class="mb-24px flex flex-wrap gap-10px">
      <button
        v-for="component in components"
        :key="component.key"
        type="button"
        class="vek-chip flex cursor-pointer items-center gap-8px rounded-[var(--el-border-radius-base)] b-1 b-solid b-[var(--el-border-color-light)] bg-[var(--el-fill-color-blank)] px-12px py-8px text-13px c-[var(--el-text-color-regular)]"
        @click="openPath(component.to)"
      >
        <vu-icon-svg-dynamic
          v-if="component.icon"
          :name="component.icon"
          :size="16"
        />
        {{ component.title }}
      </button>
    </div>

    <!-- Установка -->
    <h2 class="mb-12px text-18px font-600 c-[var(--el-text-color-primary)]">Установка</h2>
    <div
      class="flex items-center justify-between gap-16px rounded-[var(--el-border-radius-base)] b-1 b-solid b-[var(--el-border-color-light)] bg-[var(--el-fill-color-light)] px-16px py-12px"
    >
      <code class="text-13px c-[var(--el-text-color-primary)]">{{ INSTALL_COMMAND }}</code>
      <el-button
        size="small"
        @click="copyInstall"
        >Копировать</el-button
      >
    </div>
  </vu-content-wrap>
</template>

<style scoped>
.vek-card,
.vek-chip {
  transition: var(--el-transition-duration);
}

.vek-card:hover,
.vek-chip:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.vek-card:hover {
  box-shadow: var(--el-box-shadow-light);
}
</style>
