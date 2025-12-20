<template>
  <div v-if="uiStore.showLanguageSwitcher" class="language-switcher">
    <button
      v-for="lang in languages"
      :key="lang"
      :class="['lang-btn', { active: locale === lang }]"
      @click="setLocale(lang)"
      :title="lang === 'en' ? $t('languages.english') : $t('languages.german')"
    >
      {{ lang.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useUIStore } from '@/stores/ui';

const { locale } = useI18n();
const uiStore = useUIStore();
const languages = ['en', 'de'] as const;

const setLocale = (lang: 'en' | 'de') => {
  locale.value = lang;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('locale', lang);
  }
};
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 0.25rem;
}

.lang-btn {
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: 1px solid #4b5563;
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.lang-btn:hover {
  border-color: #6b7280;
  color: #d1d5db;
}

.lang-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #f3f4f6;
}

.lang-btn.active:hover {
  background: #2563eb;
  border-color: #2563eb;
}
</style>
