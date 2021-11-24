<template>
    <vue-qrcode value="Hello, World!" :options="{ width: 200 }"></vue-qrcode>
</template>
<script>
import VueQrcode from '@chenfengyuan/vue-qrcode';
export default {
    components:{
        VueQrcode
    }
}
</script>