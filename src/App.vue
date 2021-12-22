<template>
  <ion-app id="app">
    <ion-router-outlet />
    <ion-popover trigger="app" reference="event" trigger-action="context-menu">
      <ion-content>Popover Content</ion-content>
    </ion-popover>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonContent, IonPopover, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';
import { loadingController } from '@ionic/vue';
import emitter from "@/event-bus"


export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonContent,
    IonPopover,
    IonRouterOutlet
  },
  data() {
    return {
      loader: null as any
    }
  },
  methods: {
    async presentLoader() {
      this.loader = await loadingController
        .create({
          message: this.$t("Click the backdrop to dismiss."),
          translucent: true,
          backdropDismiss: true
        });
      await this.loader.present();
    },
    dismissLoader() {
      if (this.loader) {
        this.loader.dismiss();
      }
    }
  },
  mounted() {
    emitter.on('presentLoader', this.presentLoader);
    emitter.on('dismissLoader', this.dismissLoader);
  },
  unmounted() {
    emitter.off('presentLoader', this.presentLoader);
    emitter.off('dismissLoader', this.dismissLoader);
  },
});
</script>