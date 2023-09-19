<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>
        {{ $t("Language") }}
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      {{ $t('Select your preferred language.') }}
    </ion-card-content>
    <ion-item lines="none">
      <ion-label>{{ $t("Choose language") }}</ion-label>
      <ion-select interface="popover" :value="currentLocale" @ionChange="setLocale($event.detail.value)">
        <ion-select-option v-for="locale in Object.keys(locales)" :key="locale" :value="locale">{{ locales[locale] }}</ion-select-option>
      </ion-select>
    </ion-item>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/vue';
import { computed } from "vue";
import { useUserStore } from '../store/user'

const userStore = useUserStore();

const locales = computed(() => userStore.getLocaleOptions);
const currentLocale = computed(() => userStore.getLocale);

const setLocale = (locale: any) => {
  userStore.setLocale(locale)
}
</script>