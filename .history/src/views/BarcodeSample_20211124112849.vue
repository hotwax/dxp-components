<template>
    <vue-barcode  value="1234567" :options="{ displayValue: false }"></vue-barcode>
</template>
<script>
import VueBarcode from '@chenfengyuan/vue-barcode';

export default {
    components:{
        VueBarcode
    }
}
</script>