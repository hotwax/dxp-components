<template>
  <ion-toolbar>
    <ion-buttons slot="end" @click="closeScanner()">
      <ion-button>
        <ion-icon :icon="closeOutline" />
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
  <div class="scanner">
    <StreamBarcodeReader
      @decode="onDecode"
    />
  </div>
</template>

<script setup lang="ts">
import { IonButton, IonButtons, IonIcon, IonToolbar, modalController } from '@ionic/vue';
import { closeOutline } from 'ionicons/icons'
import { StreamBarcodeReader } from "vue-barcode-reader";

function onDecode(result: any) {
  modalController.dismiss({dismissed: true, value: result});
  result = '';
}

function closeScanner() {
  modalController.dismiss({dismissed: true});
}
</script>

<style scoped>
.scanner {
  position: sticky;
  top: 0;
  z-index: 2;
}
</style>
