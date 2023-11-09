<template>
  <div class="section-header">
    <div>
      <h1>{{ $t('App') }}</h1>
      <p class="overline">{{ "Version: " + appVersion }}</p>
    </div>
    <div class="ion-text-end">
      <p class="overline">{{ "Built: " + getDateTime(appInfo.builtTime) }}</p>
      <ion-button v-if="pwaState.updateExists" @click="refreshApp()" fill="outline" color="dark" size="small">{{ $t("Update") }}</ion-button>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { IonButton } from '@ionic/vue';
import { DateTime } from 'luxon';
import { appContext } from 'src';
import { computed } from 'vue';

declare var process: any;

const appState = appContext.config.globalProperties.$store
const pwaState = computed(() => appState.getters['user/getPwaState'])

const refreshApp = () => {
  appState.dispatch('user/updatePwaState', { registration: pwaState.value.registration, updateExists: false });
  if (!pwaState.value.registration || !pwaState.value.registration.waiting) return
  pwaState.value.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
}

const appInfo = (process.env.VUE_APP_VERSION_INFO ? JSON.parse(process.env.VUE_APP_VERSION_INFO) : {}) as any;
const appVersion = appInfo.branch ? (appInfo.branch + "-" + appInfo.revision) : appInfo.tag;
const getDateTime = (time: any) => DateTime.fromMillis(time).toLocaleString(DateTime.DATETIME_MED);
</script>