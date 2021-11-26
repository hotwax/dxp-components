<template>
  <ion-toolbar>
    <ion-buttons slot="end" @click="closeScanner()" >
      <ion-button >
        <ion-icon :icon="closeOutline" />
      </ion-button>
    </ion-buttons>  
  </ion-toolbar>   
  <div class="scanner">
    <StreamBarcodeReader
      @decode="onDecode"
      @loaded="onLoaded"
    />
  </div> 
</template>

<script>
import { StreamBarcodeReader } from "vue-barcode-reader";
import { modalController } from '@ionic/vue';
import { 
  closeOutline
} from 'ionicons/icons';
export default {
  name: 'Scanner',
  components: {
    StreamBarcodeReader,
  },
  methods: {
    onDecode (result) {
      this.closeScanner();
    },
    closeScanner(){
      modalController.dismiss({dismissed: true});
    }
  },
  setup() {
    return {
      closeOutline
    }
  }
}
</script>