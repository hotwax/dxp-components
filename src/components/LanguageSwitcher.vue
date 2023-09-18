<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>
        {{ translate("Language") }}
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      {{ translate('Select your preferred language.') }}
    </ion-card-content>
    <ion-item lines="none">
      <ion-label>{{ translate("Choose language") }}</ion-label>
      <ion-select interface="popover" :value="locale" @ionChange="setLocale($event.detail.value)">
        <ion-select-option v-for="locale in Object.keys(locales)" :key="locale" :value="locale">{{ locales[locale] }}</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/vue';
import { computed } from "vue";
import { appContext, translate } from "../index";
declare var process: any;

const appState = appContext.config.globalProperties.$store
const locales = process.env.VUE_APP_LOCALES ? JSON.parse(process.env.VUE_APP_LOCALES) : { "en": "English" };
const locale = computed(() => appState.getters['user/getLocale']);
const setLocale = async (locale: string) => {
  await appState.dispatch('user/setLocale', locale);
}
</script>