<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>
        {{ $t('Timezone') }}
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      {{ $t('The timezone you select is used to ensure automations you schedule are always accurate to the time you select.') }}
    </ion-card-content>
    <ion-item lines="none">
      <ion-label>{{ currentTimeZoneId }}</ion-label>
      <ion-button id="time-zone-modal" slot="end" fill="outline" color="dark">{{ $t("Change") }}</ion-button>
    </ion-item>
  </ion-card>
  <!-- Using inline modal(as recommended by ionic), also using it inline as the component inside modal is not getting mounted when using modalController -->
  <ion-modal ref="timeZoneModal" trigger="time-zone-modal" @didPresent="search()" @didDismiss="clearSearch()">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="closeModal">
            <ion-icon :icon="closeOutline" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $t("Select time zone") }}</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar @ionFocus="selectSearchBarText($event)" :placeholder="$t('Search time zones')"  v-model="queryString" @keyup.enter="queryString = $event.target.value; findTimeZone()" @keydown="preventSpecialCharacters($event)" />
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Empty state -->
      <div class="empty-state" v-if="isLoading">
        <ion-item lines="none">
          <ion-spinner color="secondary" name="crescent" slot="start" />
          {{ $t("Fetching time zones") }}
        </ion-item>
      </div>
      <div class="empty-state" v-else-if="filteredTimeZones.length === 0">
        <p>{{ $t("No time zone found") }}</p>
      </div>

      <!-- Timezones -->
      <div v-else>
        <ion-list>
          <ion-radio-group value="rd" v-model="timeZoneId">
            <ion-item :key="timeZone.id" v-for="timeZone in filteredTimeZones">
              <ion-radio label-placement="end" justify="start" :value="timeZone.id">{{ timeZone.label }} ({{ timeZone.id }})</ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-list>
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button :disabled="!currentTimeZoneId" @click="setUserTimeZone">
          <ion-icon :icon="saveOutline" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard, 
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRadio,
  IonRadioGroup,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import { closeOutline, saveOutline } from "ionicons/icons";
import { appContext, useUserStore } from '../index';
import { computed, onBeforeMount, ref } from "vue";

const appState = appContext.config.globalProperties.$store;
const userStore = useUserStore();

const userProfile: any = computed(() => appState.getters['user/getUserProfile'])
const timeZones = computed(() => userStore.getTimeZones)
const currentTimeZoneId = computed(() => userStore.getCurrentTimeZone)

const isLoading = ref(false);
const timeZoneModal = ref();
const queryString = ref('');
const filteredTimeZones = ref([])
const timeZoneId = ref('')

const emit = defineEmits(["timeZoneUpdated"])
const props = defineProps({
  persist: {
    type: Boolean,
    default: false
  }
})

const closeModal = () => {
  timeZoneModal.value.$el.dismiss(null, 'cancel');
}

onBeforeMount(async () => {
  isLoading.value = true;
  await userStore.getAvailableTimeZones();
  findTimeZone();

  if(userProfile.value && userProfile.value.userTimeZone) {
    userStore.currentTimeZoneId = userProfile.value.userTimeZone
    timeZoneId.value = userProfile.value.userTimeZone
  }

  isLoading.value = false;
})

async function setUserTimeZone() {
  await userStore.setUserTimeZone(timeZoneId.value).then((tzId) => {
    emit('timeZoneUpdated', tzId);
  }).catch(err => err)
  closeModal();
}

function findTimeZone() {
  const searchedString = queryString.value.toLowerCase();
  filteredTimeZones.value = timeZones.value.filter((timeZone: any) => timeZone.id.toLowerCase().match(searchedString) || timeZone.label.toLowerCase().match(searchedString));
}

async function selectSearchBarText(event: any) {
  const element = await event.target.getInputElement()
  element.select();
}

function preventSpecialCharacters($event: any) {
  // Searching special characters fails the API, hence, they must be omitted
  if(/[`!@#$%^&*()_+\-=\\|,.<>?~]/.test($event.key)) $event.preventDefault();
}

function search() {
  isLoading.value = true;
  findTimeZone();
  isLoading.value = false;
}

// clearing the data explicitely as the modal is mounted due to the component being mounted always
function clearSearch() {
  // Do not clear the data on modal dismiss if the user wants to persist the search even after modal close
  if(props.persist) {
    return;
  }
  queryString.value = ''
  filteredTimeZones.value = []
}
</script>