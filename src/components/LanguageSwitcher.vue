<template>
    <ion-card>
    <ion-card-header>
      <ion-card-title>
        {{ ("Language") }}
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      {{ ('Select your preferred language.') }}
    </ion-card-content>
    <ion-item lines="none">
      <ion-label>{{ ("Choose language") }}</ion-label>
      <ion-select interface="popover" :value="locale" @ionChange="setLocale($event.detail.value)">
        <ion-select-option v-for="locale in Object.keys(locales)" :key="locale" :value="locale">{{ locales[locale] }}</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/vue';
import { computed } from "vue";
import { appContext, i18n } from "../index";
declare var process: any;

const store = appContext.config.globalProperties.$store;
const locales = process.env.VUE_APP_LOCALES ? JSON.parse(process.env.VUE_APP_LOCALES) : { "en": "English" };
const locale = computed(() => store.getters['user/setLocale']);
const setLocale = async (locale: any) => {
  await store.dispatch('user/setLocale', { locale });
  i18n.global.locale = locale;
}
</script>