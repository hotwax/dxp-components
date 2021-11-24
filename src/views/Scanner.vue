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
export default {
    name: 'Scanner',
    components:{
        StreamBarcodeReader,
    }
}
</script>