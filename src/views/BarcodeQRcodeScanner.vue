<template>
  <ion-page>
    <ion-content>
      <ion-button @click="scanCode">Scan</ion-button>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { IonContent, IonPage, modalController } from '@ionic/vue';
import { defineComponent } from 'vue';
import Scanner from './Scanner.vue'
export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
  },       
  methods: {
    async scanCode () {
      const modal = await modalController
        .create({
          component: Scanner,
        });
        modal.onDidDismiss()
      .then((result) => {
        console.log(result);
        alert(result.role);
      });
      return modal.present();
    },
  },
});
</script>