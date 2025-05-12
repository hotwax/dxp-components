<template>
  <ion-modal :is-open="true" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="closeModal">
            <ion-icon :icon="closeOutline" slot="icon-only" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ productName }}</ion-title>
      </ion-toolbar>
    </ion-header>
  
    <ion-content class="ion-text-center">
      <DxpShopifyImg :src="imageUrl" />
    </ion-content>
  </ion-modal>
</template>

<script lang="ts" setup>
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from '@ionic/vue';
import { defineProps } from 'vue';
import { closeOutline } from 'ionicons/icons';
import DxpShopifyImg from './DxpShopifyImg.vue';

const props = defineProps(["imageUrl", "onClose", "productName"])

const closeModal = () => {
  props.onClose()
}
</script>

<style scoped>
img { 
  max-height: 530px;
}
</style>