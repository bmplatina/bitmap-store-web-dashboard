<script setup lang="ts">
import { ref } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import { useI18n } from "vue-i18n";
import { useLocale } from "vuetify";

const { current } = useLocale();
const { locale, t } = useI18n();

const bIsSidebarOpened = ref(false);
const toggleSidebarOpenState = () => {
  bIsSidebarOpened.value = !bIsSidebarOpened.value;
};

const toggleLanguage = () => {
  if(locale.value === 'ko') {
    locale.value = 'en';
    current.value = 'en';
  }
  else if(locale.value === 'en') {
    locale.value = 'ko';
    current.value = 'ko';
  }
};
</script>

<template>
  <v-app>
    <v-app-bar app color="primary" dark fixed>
      <v-app-bar-nav-icon @click="toggleSidebarOpenState()" />
      <v-toolbar-title class="bitmap-title">{{ $t('bitmap-store') }}</v-toolbar-title>
      <!-- 우측에 추가메뉴 아이콘을 넣기 위해 v-spacer 엘리먼트 사용 -->
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleLanguage()">
        {{ $filters.getLanguage() }}
        <!--          <v-icon>mdi-dots-vertical</v-icon>-->
      </v-btn>
    </v-app-bar>
    <Sidebar :bIsOpened="bIsSidebarOpened" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
