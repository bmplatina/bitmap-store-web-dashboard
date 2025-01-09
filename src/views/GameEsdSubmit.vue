<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { Game } from "@/GameQuery";
import axios from "axios";
import { MdEditor, MdPreview, MdCatalog } from "md-editor-v3";

/*
 * Modal State
 */
let bIsMarkdownModalOpened = ref(false);

/*
 * Game Info for ESD
 */
let responseGameId = ref(0);
let responseGameTitle = ref('');
let responseGameLatestRevision = ref(0);
let responseGamePlatformWindows = ref(false);
let responseGamePlatformMac = ref(false);
let responseGamePlatformMobile = ref(false);
let responseGameEngine = ref('');
let responseGameGenre = ref('');
let responseGameDeveloper = ref('');
let responseGamePublisher = ref('');
let responseIsEarlyAccess = ref(false);
let responseIsReleased = ref(false);
let responseGameReleasedDate = ref<Date>();
let responseGameWebsite = ref('');
let responseGameVideoURL = ref('');
let responseGameDownloadMacURL = ref('');
let responseGameDownloadWinURL = ref('');
let responseGameImageURL = ref('');
let responseGameBinaryName = ref('');
let responseGameHeadline = ref('');
let responseGameDescription = ref('');


const state = reactive({
  loading: true,
  error: null as string | null,
});

async function fetchGames() {
  try {
    const responseGames = await axios.get<Game[]>("https://api.prodbybitmap.com/api/games");
    const responseGamesPending = await axios.get<Game[]>("https://api.prodbybitmap.com/api/games-pending");
    const fetchedGames: Array<Game> = responseGames.data;
    const fetchedGamedPending: Array<Game> = responseGamesPending.data;

    state.loading = false;
    responseGameId.value = fetchedGames.length + fetchedGamedPending.length;
  }
  catch (error) {
    state.error = '게임 데이터를 가져오는 중 오류가 발생했습니다.';
    state.loading = false;
    console.error('Error fetching games:', error);
  }
}


let bIsGamePosting = ref(false);

async function postGame(): Promise<boolean> {
  try {
    bIsGamePosting.value = true;
    const postGame: Game = {
      gameId: responseGameId.value,
      gameTitle: responseGameTitle.value,
      gameLatestRevision: responseGameLatestRevision.value,
      gamePlatformWindows: responseGamePlatformWindows.value == true ? 1 : 0,
      gamePlatformMac: responseGamePlatformMac.value == true ? 1 : 0,
      gamePlatformMobile: responseGamePlatformMobile.value == true ? 1 : 0,
      gameEngine: responseGameEngine.value,
      gameGenre: responseGameGenre.value,
      gameDeveloper: responseGameDeveloper.value,
      gamePublisher: responseGamePublisher.value,
      isEarlyAccess: responseIsEarlyAccess.value == true ? 1 : 0,
      isReleased: responseIsReleased.value == true ? 1 : 0,
      gameReleasedDate: responseGameReleasedDate.value?.toLocaleDateString("ko-KR") as string,
      gameWebsite: responseGameWebsite.value,
      gameVideoURL: responseGameVideoURL.value,
      gameDownloadMacURL: responseGameDownloadMacURL.value,
      gameDownloadWinURL: responseGameDownloadWinURL.value,
      gameImageURL: responseGameImageURL.value,
      gameBinaryName: responseGameBinaryName.value,
      gameHeadline: responseGameHeadline.value,
      gameDescription: responseGameDescription.value,
    };
    const response = await axios.post<Game>("https://api.prodbybitmap.com/api/games/push", postGame);
    console.log("Submit succeed: ", response.data);
    bIsGamePosting.value = false;
    return true;
  }
  catch (error) {
    console.error("Error submitting:", error);
    bIsGamePosting.value = false;
    return false;
  }
}

onMounted(() => {
  fetchGames();
})
</script>

<template>
  <div>
    <!-- Game ID -->
    <v-card title="게임 ID" text="게임 ID는 자동으로 생성됩니다.">
      <v-text-field v-model="responseGameId" readonly disabled label="게임 ID"></v-text-field>
    </v-card>
    <v-divider></v-divider>
    <v-card title="게임 제목" text="스토어에 표시될 게임 제목입니다.">
      <v-text-field v-model="responseGameTitle" label="게임 제목"></v-text-field>
    </v-card>
    <v-divider></v-divider>
    <v-card title="게임의 최신 버전" text="제출 시점의 게임의 최신 버전을 입력하세요. 이 값으로 업데이트를 관리합니다.">
      <v-text-field v-model="responseGameLatestRevision" label="게임 제목"></v-text-field>
    </v-card>
    <v-divider></v-divider>
    <v-card title="지원하는 플랫폼" text="이 게임이 지원하는 플랫폼을 선택하세요. 이 값으로 플랫폼별 설치 가능 여부를 판단합니다.">
      <v-checkbox v-model="responseGamePlatformWindows" label="Windows 지원" />
      <v-checkbox v-model="responseGamePlatformMac" label="macOS 지원" />
      <v-checkbox v-model="responseGamePlatformMobile" label="Android 또는 iOS (iPadOS) 지원" />
    </v-card>
    <v-divider></v-divider>
    <v-card title="게임 엔진" text="스토어에 표시될 게임 엔진입니다.">
      <v-text-field v-model="responseGameEngine" label="게임 엔진"></v-text-field>
    </v-card>
    <v-divider></v-divider>
    <v-card title="게임 장르" text="스토어에 표시될 게임 장르입니다. 콤마(,)로 장르를 구분합니다.">
      <v-text-field v-model="responseGameGenre" label="게임 장르"></v-text-field>
    </v-card>
    <v-divider></v-divider>
    <v-card title="게임 개발자" text="이 게임을 개발한 사람, 단체, 팀, 혹은 회사를 입력하세요.">
      <v-text-field v-model="responseGameDeveloper" label="게임 제목"></v-text-field>
    </v-card>
    <v-divider></v-divider>
    <v-card title="게임 퍼블리셔" text="이 게임을 배급한 유통사 혹은 전시 이름을 입력하세요.">
      <v-text-field v-model="responseGamePublisher" label="게임 제목"></v-text-field>
    </v-card>
    <v-divider></v-divider>
    <v-card title="얼리 액세스" text="이 게임은 얼리 액세스이며 정식 출시 전의 버전입니까?">
      <v-checkbox v-model="responseIsEarlyAccess" label="얼리 액세스" />
    </v-card>
    <v-divider></v-divider>
    <v-card title="출시 여부" text="이 게임은 출시되었고 적절한 게임 다운로드 링크가 업로드되었습니까? 선택하지 않는다면 스토어는 게임의 다운로드를 막습니다.">
      <v-checkbox v-model="responseIsReleased" label="얼리 액세스" />
    </v-card>
    <v-divider></v-divider>
    <v-card title="게임 출시일" text="스토어에 표시될 게임 제목입니다.">
      <v-date-picker v-model="responseGameReleasedDate"/>
    </v-card>
    <v-divider></v-divider>
    <v-card title="게임 공식 웹사이트" text="스토어에서 리다이렉트할 수 있는 게임의 공식 웹사이트입니다.">
      <v-text-field v-model="responseGameWebsite" label="게임 공식 웹사이트"></v-text-field>
    </v-card>
    <v-divider></v-divider>
    <v-card title="게임 트레일러 영상 (YouTube)">
      <v-card-text>
        <p style="white-space: pre-line">스토어에 표시될 게임의 공식 YouTube 트레일러 영상입니다.<br/>https://youtu.be/abcedfg 또는 https://youtube.com/watch?v=abcdefg일 때 abcdefg를 입력하세요.</p>
      </v-card-text>
      <v-text-field v-model="responseGameVideoURL" label="게임 트레일러 영상 (YouTube)"></v-text-field>
    </v-card>
    <v-divider></v-divider>
    <v-card title="게임 다운로드 링크" text="스토어에서 게임을 다운로드할 때 사용하는 게임 파일의 링크입니다. OneDrive, Google Drive 등 모든 링크를 사용할 수 있습니다.">
      <v-text-field v-if="responseGamePlatformMac" v-model="responseGameDownloadMacURL" label="macOS"></v-text-field>
      <v-text-field v-if="responseGamePlatformWindows" v-model="responseGameDownloadWinURL" label="Windows"></v-text-field>
    </v-card>
    <v-divider></v-divider>
    <v-card title="게임 포스터 이미지 링크" text="스토어에 표시될 게임의 메인 포스터입니다.">
      <v-text-field v-model="responseGameImageURL" label="게임 포스터 이미지 링크"></v-text-field>
    </v-card>
    <v-divider></v-divider>
    <v-card title="게임의 실행 파일 이름" text="스토어가 실행할 게임 파일 이름입니다. 확장자는 기입하지 않습니다.">
      <v-text-field v-model="responseGameBinaryName" label="게임 포스터 이미지 링크"></v-text-field>
    </v-card>
    <v-divider></v-divider>
    <v-card title="게임 헤드라인" text="게임을 나타내는 한 문장을 입력하세요.">
      <v-text-field v-model="responseGameHeadline" label="게임 헤드라인"></v-text-field>
    </v-card>
    <v-divider></v-divider>
    <v-card title="게임 상세 설명" text="게임에 대해 자세히 설명하세요.">
      <MdPreview id="preview-only" :modelValue="responseGameDescription" theme="dark" />
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="bIsMarkdownModalOpened = true" text="마크다운 편집하기" variant="tonal" />
      </v-card-actions>
    </v-card>
    <v-spacer />
    <v-btn tonal @click="postGame()" text="제출" />

    <!-- 마크다운 편집 모달 -->
    <v-dialog v-model="bIsMarkdownModalOpened">
      <v-card>
        <MdEditor v-model="responseGameDescription" language="en-US" />
      </v-card>
    </v-dialog>

    <!-- 제출 모달 -->
    <v-dialog v-model="bIsGamePosting" persistent>
      <v-card :title="'Submitting ' + responseGameTitle">
        <v-progress-circular indeterminate />
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="postcss">
@import 'md-editor-v3/lib/style.css';
</style>