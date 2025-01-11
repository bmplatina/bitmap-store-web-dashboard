<script setup lang="ts">
// Libraries
import { onMounted, ref, computed } from 'vue'
import { Game } from "@/GameQuery";
import { useI18n } from 'vue-i18n';
import dayjs from "dayjs";

const { t } = useI18n();

const props = defineProps<{
  gameObject: Game,
}>();

/*
 * Images
 */
import UnknownImage from '@/assets/unknownImage.png';
import PlatformWindows11Image from '@/assets/platformWindows11.png';
import PlatformMacOSImage from '@/assets/platformMac.png';

/*
 * Released Ago
 */
function releasedAgo(): number {
  const today = dayjs();
  const releasedDateFormat = dayjs(props.gameObject.gameReleasedDate);
  return today.diff(releasedDateFormat, "years");
}

/*
 * Modal state
 */
let bIsDetailModalOpened = ref(false);

/**
 * Insert or Update InstallState: GameInstallInfo to NeDB
 */
</script>

<template>
  <!-- Button -->
  <v-card max-width="400">
    <v-img
      :src="gameObject.gameImageURL"
      :lazy-src="UnknownImage"
      :alt="gameObject.gameTitle"
      cover
      @click="bIsDetailModalOpened = true"
    ></v-img>
    <v-card-text>
      <div style="text-align: left;">
        <h2 class="title primary--text mb-2" @click="bIsDetailModalOpened = true">{{ gameObject.gameTitle }}</h2>
        <div class="d-flex align-center mb-2">
          <v-img
            :src="PlatformWindows11Image"
            v-if="props.gameObject.gamePlatformWindows == 1"
            :max-width="20"
            :max-height="20"
            style="margin-right: 8px"
          ></v-img>
          <v-img
            :src="PlatformMacOSImage"
            v-if="props.gameObject.gamePlatformMac == 1"
            :max-width="20"
            :max-height="20"
            style="margin-right: 8px"
          ></v-img>
        </div>
        <p class="mb-0">{{ `${$t('dev')}: ${gameObject.gameDeveloper}` }}</p>
        <p class="mb-0">{{ `${$t('genre')}: ${gameObject.gameGenre}` }}</p>
        <p class="mb-0">{{ `${$t('released-date')}: ${$filters.formatDate(gameObject.gameReleasedDate, $filters.getLanguage())}` }}</p>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn variant="plain" @click="bIsDetailModalOpened = true">{{ $t('details') }}</v-btn>
    </v-card-actions>
  </v-card>

  <!-- Detail View -->
  <v-dialog v-model="bIsDetailModalOpened" width="90%" height="80%">
    <v-card style="height: 100%;">
      <v-card-title class="headline grey lighten-2" primary-title>
        {{ $t('bitmap-store') }}: {{ gameObject.gameTitle }}
      </v-card-title>
      <v-divider />

      <v-row style="height: 80%;" class="d-flex">
        <v-col cols="3" class="d-flex flex-column align-items-center">
          <div>
            <v-img
              class="rounded-xl mx-auto"
              :src="gameObject.gameImageURL"
              :lazy-src="UnknownImage"
              :alt="gameObject.gameTitle"
              :max-width="240"
              style="margin-top: calc(4% + 16px)"
            ></v-img>
            <div class="d-flex justify-center align-center mt-5 w-100">
              <h2 class="text-h5 mr-2">{{ gameObject.gameTitle }}</h2>
              <p v-if="gameObject.isEarlyAccess" class="mb-0">{{ $t('early-access') }}</p>
            </div>
          </div>
        </v-col>

        <v-divider vertical style="margin-top: 12px; margin-bottom: 12px"></v-divider>

        <v-col cols="9" style="display: flex; flex-direction: column; height: 100%;" class="align-center">
          <div style="flex: 1; overflow-y: auto; margin-top: 4%; margin-bottom: 1%; margin-left: 4%; margin-right: 4%;">
            <v-card
              class="mt-4 pa-3 rounded-xl"
              :title="$t('preview')"
              variant="tonal"
              style="white-space: pre-line;"
            >
              <iframe
                :src="YouTubeURL"
                class="mx-auto"
                frameborder="0" allowfullscreen
                sandbox="allow-scripts allow-same-origin allow-presentation"
                style="width: 512px; height: 288px; margin-top: 4%"
                referrerpolicy="no-referrer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </v-card>
            <v-card
              class="mt-4 pa-3 rounded-xl"
              :title="$filters.getLanguage() === 'ko' ? `${gameObject.gameTitle + $t('information-of')}` : `${$t('information-of') + gameObject.gameTitle}`"
              variant="tonal"
              style="white-space: pre-line;"
            >
              <v-card-text>
                <p>{{ $t('released-date') }}: {{ $filters.formatDate(gameObject.gameReleasedDate, $filters.getLanguage()) }} ({{ `${releasedAgo()}${$t('years-ago')}` }})</p>
                <p>{{ $t('genre') }}: {{ gameObject.gameGenre }}</p>
                <p>{{ $t('developer') }}: {{ gameObject.gameDeveloper }}</p>
                <p>{{ $t('publisher') }}: {{ gameObject.gamePublisher }}</p>
                <v-divider style="margin-top: 1%; margin-bottom: 1%"/>
                <p>{{ $t('latest-version') + gameObject.gameLatestRevision }}</p>
                <a :href="gameObject.gameWebsite" @click="openExternal">{{ $t('official-website') }}</a>
              </v-card-text>
            </v-card>
            <v-card
              class="mt-4 pa-3 rounded-xl"
              :title="gameObject.gameHeadline"
              variant="tonal"
              style="white-space: pre-line;"
            >
              <v-card-text>
                <v-markdown-renderer :source="gameObject.gameDescription" />
              </v-card-text>
            </v-card>
            <v-card
              class="mt-4 pa-3 rounded-xl"
              :title="$t('system-requirements')"
              variant="tonal"
            >
              <!-- Mac 지원 게임 -->
              <v-card-text>
                {{ $t('macos-system-requirements').replace(/\\n/g, '\n') }}
              </v-card-text>
              <!-- Windows 지원 게임 -->
              <v-card-text>
                {{ $t('windows-system-requirements').replace(/\\n/g, '\n') }}
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
      <v-divider />
      <v-card-actions>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
</style>