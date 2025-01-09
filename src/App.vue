<template>
  <v-app>
    <v-app-bar app color="primary" dark fixed>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title class="bitmap-title">{{ $t('bitmap-store') }}</v-toolbar-title>
      <!-- 우측에 추가메뉴 아이콘을 넣기 위해 v-spacer 엘리먼트 사용 -->
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleLanguage()">
        {{ $filters.getLanguage() }}
        <!--          <v-icon>mdi-dots-vertical</v-icon>-->
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();

const toggleLanguage = () => {
  if(locale.value === 'ko')
    locale.value = 'en';
  else if(locale.value === 'en')
    locale.value = 'ko';
}
</script>
