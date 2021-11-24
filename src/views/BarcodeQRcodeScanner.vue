<template>

  <ion-content>
    <ion-button @click="setOpen(true)">Open Scanner</ion-button>
    <ion-modal
    :is-open="isOpenRef"
    css-class="my-custom-class"
    @didDismiss="setOpen(false)"
  >
    <Scanner :data="data" />
  </ion-modal>
  </ion-content>

<!-- <div class="scanner">
     <StreamBarcodeReader
    @decode="onDecode"
    @loaded="onLoaded"
></StreamBarcodeReader>
</div> -->

</template>

<script>
import Scanner from './Scanner.vue'
import { IonButton, IonContent, IonModal } from '@ionic/vue';
// import Scanner from './Scanner.vue'
// import { StreamBarcodeReader } from "vue-barcode-reader";
import { defineComponent, ref } from 'vue';
export default defineComponent({
  components: { IonModal, IonButton, 
    IonContent, Scanner
},
  setup() {
    const isOpenRef = ref(false);
    const setOpen = (state) => isOpenRef.value = state;
    const data = { content: 'New Content' };
    return { isOpenRef, setOpen, data }
  },
  methods: {
    onDecode (result) {
      console.log(result)
    }
  }
});
// export default {
//   components: {
//     // StreamBarcodeReader,
//     IonButton,
//     IonContent,
//     IonModal
//     // Scanner
//   },
//   methods: {
//     onDecode (result) {
//       console.log(result)
//     },
//     async openScanner() {
//       const scanner = await modalController
//         .create({
//           component: Scanner,
//         })
//       return scanner.present();
//     },
// }
  
// }
</script>
<style scoped>
/* .scanner{
  text-align: center;
} */
</style>