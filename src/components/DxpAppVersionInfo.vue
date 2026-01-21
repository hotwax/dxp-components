<template>
  <div class="section-header">
    <div>
      <h1>{{ translate('App') }}</h1>
      <p class="overline">{{ translate("Version: ", { appVersion }) }}</p>
    </div>
    <div class="ion-text-end">
      <p class="overline">{{ translate("Built: ", { builtDateTime: getDateTime(appInfo.builtTime) }) }}</p>
      <ion-button v-if="pwaState.updateExists" @click="refreshApp()" fill="outline" color="dark" size="small">{{ translate("Update") }}</ion-button>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { IonButton } from '@ionic/vue';
import { DateTime } from 'luxon';
import { appContext, translate, useUserStore } from 'src';
import { computed } from 'vue';

declare var process: any;

const userStore = useUserStore();

const appState = appContext.config.globalProperties.$store
const pwaState = computed(() => appState.getters['user/getPwaState'])

const refreshApp = () => {
  appState.dispatch('user/updatePwaState', { registration: pwaState.value.registration, updateExists: false });
  if (!pwaState.value.registration || !pwaState.value.registration.waiting) return
  pwaState.value.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
}

const appInfo = (process.env.VUE_APP_VERSION_INFO ? JSON.parse(process.env.VUE_APP_VERSION_INFO) : {}) as any;
const appVersion = process.env.VUE_APP_BUILD ? process.env.VUE_APP_BUILD : appInfo.tag ? appInfo.tag : appInfo.branch ? (appInfo.branch + "-" + appInfo.revision) : "";
const getDateTime = (time: any) => DateTime.fromMillis(time).setZone(userStore.currentTimeZoneId).toLocaleString(DateTime.DATETIME_MED);
</script>