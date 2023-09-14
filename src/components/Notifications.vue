<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-back-button slot="start" default-href="/tabs/orders" />
        <ion-title>{{ "Notifications" }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <main>
        <section>
          <ion-list v-if="notificationsStore.getNotifications.length">
            <ion-item v-for="(notificationData, index) in notificationsStore.getNotifications" :key="index">
              <ion-label class="ion-text-wrap">
                <h3>{{ notificationData.data.title }}</h3>
                <p>{{ notificationData.data.body }}</p>
              </ion-label>
              <ion-note slot="end">{{ timeTillNotification(notificationData.time) }}</ion-note>
            </ion-item>
          </ion-list>
          <div v-else class="ion-text-center">
            {{ 'No notifications to show' }}
          </div>
        </section>
      </main>
      <ion-fab slot="fixed" size="small" vertical="top" horizontal="end" :edge="true">
        <ion-fab-button size="small" @click="openNotificationSettings()">
          <ion-icon :icon="cogOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import {
  IonBackButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import { cogOutline } from 'ionicons/icons';
// import { computed } from "vue";
import { DateTime } from "luxon";
import NotificationPreferenceModal from "./NotificationPreferenceModal.vue";
import { useNotificationStore } from '../store/notification'

const notificationsStore = useNotificationStore()
// const notifications = computed(() => notificationsStore.getNotifications)
async function openNotificationSettings() {
  const timeZoneModal = await modalController.create({
    component: NotificationPreferenceModal,
  });
  return timeZoneModal.present();
}
function timeTillNotification(time: string) {
  const timeDiff = DateTime.fromMillis(+time).diff(DateTime.local());
  return DateTime.local().plus(timeDiff).toRelative();
}
</script>

<style scoped>
main {
  margin: var(--spacer-base) auto 0;
}

@media (min-width: 991px) {
  main {
    display: flex;
    justify-content: center;
    align-items: start;
    gap: var(--spacer-2xl);
    max-width: 990px;
  }

  main>section {
    max-width: 50ch;
  }
}
</style>
