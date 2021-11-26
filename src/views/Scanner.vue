<template>
    <div class="scanner">
        <StreamBarcodeReader
            @decode="onDecode"
            @loaded="onLoaded"
        />
    </div> 
</template>

<script>
import { StreamBarcodeReader } from "vue-barcode-reader";
import {modalController } from '@ionic/vue';
export default {
    name: 'Scanner',
    components:{
        StreamBarcodeReader,
    },
    methods: {
    onDecode (result) {
      console.log(result);
      modalController.dismiss({dismissed:true});
    }
  }
}
</script>