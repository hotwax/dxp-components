<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button @click="closeModal">
          <ion-icon slot="icon-only" :icon="closeOutline" />
        </ion-button>
      </ion-buttons>
      <ion-title>{{ "Notification Preference" }}</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-list>
      <ion-item :key="pref.enumId" v-for="pref in notificationPrefs">
        <ion-label class="ion-text-wrap">{{ pref.description }}</ion-label>
        <ion-toggle @ionChange="toggleNotificationPref(pref.enumId, $event.detail.checked)" :checked="pref.isEnabled"
          slot="end" />
      </ion-item>
    </ion-list>
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="confirmSave()">
        <ion-icon :icon="save" />
      </ion-fab-button>
    </ion-fab>
  </ion-content>
</template>
<script setup lang="ts">
import {
  IonButtons,
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToggle,
  IonToolbar,
  modalController,
  alertController,
} from "@ionic/vue";
import {
  save
} from 'ionicons/icons';
import { computed, onMounted, ref } from "vue";
import { closeOutline } from "ionicons/icons";
import { useNotificationStore } from '../store/notification'
// import { showToast } from "@/utils";
import { appContext } from "../index";

const store = appContext.config.globalProperties.$store;
const notificationsStore = useNotificationStore()
let notificationPrefs = ref([])
let initialNotificationPref = ref({}) as any
let notificationPrefToUpate = ref({
  subscribe: [],
  unsubscribe: []
}) as any
const appUserState = computed(() => {
  return {
    instanceUrl: store.getters['user/getInstanceUrl'],
    currentFacility: store.getters['user/getCurrentFacility']
  }
}) as any

function closeModal() {
  modalController.dismiss({ dismissed: true });
}
function toggleNotificationPref(enumId: string, value: boolean) {
  // updates the notificationPrefToUpate to check which pref
  // values were updated from their initial values
  if (value !== initialNotificationPref[enumId]) {
    value
      ? notificationPrefToUpate.subscribe.push(enumId)
      : notificationPrefToUpate.unsubscribe.push(enumId)
  } else {
    !value
      ? notificationPrefToUpate.subscribe.splice(notificationPrefToUpate.subscribe.indexOf(enumId), 1)
      : notificationPrefToUpate.unsubscribe.splice(notificationPrefToUpate.subscribe.indexOf(enumId), 1)
  }
}
async function updateNotificationPref() {
  // TODO disbale button if initial and final are same
  try {
    const successCount: any = await notificationsStore.handleTopicSubscription(notificationPrefToUpate, appUserState.instanceUrl, appUserState.currentFacility.facilityId)
    handlePreferenceUpdateMessage(successCount)
  } catch (error) {
    console.error(error)
  }
}
function handlePreferenceUpdateMessage(successCount: number) {
  if (successCount === notificationPrefToUpate.subscribe.length + notificationPrefToUpate.unsubscribe.length) {
    console.log('Notification preferences updated.')
  } else {
    console.log('Notification preferences not updated. Please try again.')
  }
}
async function confirmSave() {
  const message = "Are you sure you want to update the notification preferences?";
  const alert = await alertController.create({
    header: "Update notification preferences",
    message,
    buttons: [
      {
        text: "Cancel",
      },
      {
        text: "Confirm",
        handler: async () => {
          await updateNotificationPref();
          modalController.dismiss({ dismissed: true });
        }
      }
    ],
  });
  return alert.present();
}

onMounted(async () => {
  notificationPrefs = await notificationsStore.fetchNotificationPreferences(appUserState.instanceUrl, appUserState.currentFacility.facilityId)
  initialNotificationPref = notificationPrefs.value.reduce((notificationPref: any, pref: any) => {
    notificationPref[pref.enumId] = pref.isEnabled
    return notificationPref
  }, {})
})
</script>