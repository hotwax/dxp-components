<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>
        {{ $t('Facility') }}
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      {{ $t('Specify which facility you want to operate from. Order, inventory and other configuration data will be specific to the facility you select.') }}
    </ion-card-content>
    <ion-item lines="none">
      <ion-label>
        {{ currentFacility.facilityName }}
        <p>{{ currentFacility.facilityId }}</p>
      </ion-label>
      <ion-button id="select-facility-modal" slot="end" fill="outline" color="dark">Change</ion-button>
    </ion-item>
  </ion-card>
  <!-- Using inline modal(as recommended by ionic), also using it inline as the component inside modal is not getting mounted when using modalController -->
  <ion-modal ref="facilityModal" trigger="select-facility-modal" @didPresent="" @didDismiss="">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="closeModal">
            <ion-icon :icon="closeOutline" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $t("Select Facility") }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-toolbar>
      <ion-searchbar @ionFocus="selectSearchBarText($event)" :placeholder="$t('Search facilities')" v-model="queryString" @keyup.enter="queryString = $event.target.value; findFacility()" @keydown="preventSpecialCharacters($event)"/>
    </ion-toolbar>
    <ion-content>
      <div>
        <ion-radio-group v-model="selectedFacilityId">
          <!-- Loading state -->
          <div class="empty-state" v-if="isLoading">
            <ion-item lines="none">
              <ion-spinner color="secondary" name="crescent" slot="start" />
              {{ $t("Fetching facilities") }}
            </ion-item>
          </div>

          <ion-list v-if="filteredFacilities.length ">
            <ion-item v-for="facility in filteredFacilities" :key="facility.facilityId">
              <ion-radio label-placement="end" justify="start" :value="facility.facilityId">
                <ion-label>
                  {{ facility.facilityName }}
                  <p>{{ facility.facilityId }}</p>
                </ion-label>
              </ion-radio>
            </ion-item>
          </ion-list>
          <!-- Empty state -->
          <div class="empty-state" v-else>
            <p>{{ $t("No facilities found") }}</p>
          </div>
        </ion-radio-group>
      </div>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button :disabled="selectedFacilityId === currentFacility.facilityId" @click="setFacility">
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
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
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
import { useUserStore } from 'src/store/user';
import { computed, ref } from 'vue';

const userStore = useUserStore();

const facilities = computed(() => userStore.getFacilites)
const currentFacility = computed(() => userStore.getCurrentFacility)

const facilityModal = ref()
const queryString = ref('')
const isLoading = ref(false);
const filteredFacilities = ref(facilities.value)
const selectedFacilityId = ref(currentFacility.value.facilityId)

const emit = defineEmits(["updateFacility"])

const closeModal = () => {
  facilityModal.value.$el.dismiss(null, 'cancel');
}

const findFacility = () => {
  isLoading.value = true
  const searchedString = queryString.value.toLowerCase();
  filteredFacilities.value = facilities.value.filter((facility: any) => 
    facility.facilityName.toLowerCase().match(searchedString) || 
    facility.facilityId.toLowerCase().match(searchedString)
  );
  isLoading.value = false
}

async function selectSearchBarText(event: any) {
  const element = await event.target.getInputElement()
  element.select();
}

function preventSpecialCharacters($event: any) {
  // Searching special characters fails the API, hence, they must be omitted
  if(/[`!@#$%^&*()_+\-=\\|,.<>?~]/.test($event.key)) $event.preventDefault();
}

function setFacility() {
  const selectedFacility = facilities.value.find((facility: any) => facility.facilityId === selectedFacilityId.value)
  if(selectedFacility) {
    userStore.setFacility(selectedFacility)
  }
  emit('updateFacility', selectedFacility.facilityId);
  closeModal();
}
</script>

<style scoped>
ion-content {
  --padding-bottom: 70px;
}
</style>