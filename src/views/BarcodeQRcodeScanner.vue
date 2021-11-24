<template>
<div class="scanner">
     <StreamBarcodeReader
    @decode="onDecode"
    @loaded="onLoaded"
></StreamBarcodeReader>
</div>
</template>

<script>
import { StreamBarcodeReader } from "vue-barcode-reader";

export default {
  components: {
    StreamBarcodeReader
  },
  
     methods: {
  onDecode (result) {
    console.log(result)
  }
}
  
}
</script>
<style scoped>
.scanner{

  text-align: center;
}
</style>