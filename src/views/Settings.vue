<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-menu-button slot="start" />
        <ion-title>{{ translate("Settings") }}</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content>
      <div class="user-profile">
        <ion-card>
          <ion-item lines="full">
            <ion-avatar slot="start" v-if="userProfile?.partyImageUrl">
              <Image :src="userProfile.partyImageUrl"/>
            </ion-avatar>
            <!-- ion-no-padding to remove extra side/horizontal padding as additional padding 
            is added on sides from ion-item and ion-padding-vertical to compensate the removed
            vertical padding -->
            <ion-card-header class="ion-no-padding ion-padding-vertical">
              <ion-card-subtitle>{{ userProfile?.userLoginId }}</ion-card-subtitle>
              <ion-card-title>{{ userProfile?.partyName }}</ion-card-title>
            </ion-card-header>
          </ion-item>
          <ion-button color="danger" @click="logout()">{{ translate("Logout") }}</ion-button>
          <ion-button fill="outline" @click="goToLaunchpad()">
            {{ translate("Go to Launchpad") }}
            <ion-icon slot="end" :icon="openOutline" />
          </ion-button>
          <!-- Commenting this code as we currently do not have reset password functionality -->
          <!-- <ion-button fill="outline" color="medium">{{ translate("Reset password") }}</ion-button> -->
        </ion-card>
      </div>

      <div class="section-header">
        <h1>{{ translate('OMS') }}</h1>
      </div>

      <section>
        <OmsInstanceNavigator />

        <ion-card>
          <ion-card-header>
            <ion-card-subtitle>
              {{ translate("Product Store") }}
            </ion-card-subtitle>
            <ion-card-title>
              {{ translate("Store") }}
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            {{ translate('A store represents a company or a unique catalog of products. If your OMS is connected to multiple eCommerce stores selling different collections of products, you may have multiple Product Stores set up in HotWax Commerce.') }}
          </ion-card-content>
          <ion-item lines="none">
            <ion-label> {{ translate("Select store") }} </ion-label>
            <ion-select interface="popover" :value="currentEComStore.productStoreId" @ionChange="setEComStore($event)">
              <ion-select-option v-for="store in (userProfile ? userProfile.stores : [])" :key="store.productStoreId" :value="store.productStoreId" >{{ store.storeName }}</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>
              {{ translate("Facility") }}
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            {{ translate('Specify which facility you want to operate from. Order, inventory and other configuration data will be specific to the facility you select.') }}
          </ion-card-content>
          <ion-item lines="none">
            <ion-label>{{ translate("Select facility") }}</ion-label>
            <ion-select interface="popover" :value="currentFacility?.facilityId" @ionChange="setFacility($event)">
              <ion-select-option v-for="facility in (userProfile ? userProfile.facilities : [])" :key="facility.facilityId" :value="facility.facilityId" >{{ facility.facilityName }}</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-card>
      </section>

      <hr />

      <DxpAppVersionInfo />

      <section>
        <ion-card>
          <ion-card-header>
            <ion-card-title>
              {{ translate('Timezone') }}
            </ion-card-title>
          </ion-card-header>

          <ion-card-content>
            {{ translate('The timezone you select is used to ensure automations you schedule are always accurate to the time you select.') }}
          </ion-card-content>

          <ion-item lines="none">
            <ion-label> {{ userProfile && userProfile.userTimeZone ? userProfile.userTimeZone : '-' }} </ion-label>
            <ion-button @click="changeTimeZone()" slot="end" fill="outline" color="dark">{{ translate("Change") }}</ion-button>
          </ion-item>
        </ion-card>

        <LanguageSwitcher />
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { 
  IonAvatar,
  IonButton, 
  IonCard, 
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonContent, 
  IonHeader,
  IonIcon, 
  IonItem, 
  IonLabel, 
  IonMenuButton,
  IonPage, 
  IonSelect, 
  IonSelectOption, 
  IonTitle, 
  IonToolbar,
  modalController
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { codeWorkingOutline, ellipsisVerticalOutline, globeOutline, openOutline, timeOutline } from 'ionicons/icons'
import { mapGetters, useStore } from 'vuex';
import { useRouter } from 'vue-router';
import TimeZoneModal from '@/components/TimeZoneModal.vue'
import { translate } from '@hotwax/dxp-components';
import { Actions, hasPermission } from '@/authorization'
import { DateTime } from 'luxon';
import Image from '@/components/Image.vue';

export default defineComponent({
  name: 'Settings',
  components: {
    IonAvatar,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonMenuButton,
    IonPage,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    Image
  },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_URL,
      appInfo: (process.env.VUE_APP_VERSION_INFO ? JSON.parse(process.env.VUE_APP_VERSION_INFO) : {}) as any,
      appVersion: "",
      locales: process.env.VUE_APP_LOCALES ? JSON.parse(process.env.VUE_APP_LOCALES) : {"en-US": "English"}
    };
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getUserProfile',
      currentFacility: 'user/getCurrentFacility',
      instanceUrl: 'user/getInstanceUrl',
      currentEComStore: 'user/getCurrentEComStore',
      userPreference: 'user/getUserPreference',
      locale: 'user/getLocale'
    })
  },
  mounted() {
    this.appVersion = this.appInfo.branch ? (this.appInfo.branch + "-" + this.appInfo.revision) : this.appInfo.tag;
  },
  methods: {
    logout () {
      this.store.dispatch('user/logout', { isUserUnauthorised: false }).then((redirectionUrl: string) => {
        this.store.dispatch('order/clearOrders')

        // if not having redirection url then redirect the user to launchpad
        if(!redirectionUrl) {
          const redirectUrl = window.location.origin + '/login'
          window.location.href = `${process.env.VUE_APP_LOGIN_URL}?isLoggedOut=true&redirectUrl=${redirectUrl}`
        }
      })
    },
    goToLaunchpad() {
      window.location.href = `${process.env.VUE_APP_LOGIN_URL}`
    },
    async setFacility (event: any) {
      // not updating the facility when the current facility in vuex state and the selected facility are same
      // or when an empty value is given (on logout)
      if (this.currentFacility.facilityId === event.detail.value || !event.detail.value) {
        return;
      }

      if (this.userProfile){
        await this.store.dispatch('user/setFacility', {
          'facility': this.userProfile.facilities.find((fac: any) => fac.facilityId == event.detail.value)
        });
        this.store.dispatch('order/clearOrders')
      }
    },
    async changeTimeZone() {
      const timeZoneModal = await modalController.create({
        component: TimeZoneModal,
      });
      return timeZoneModal.present();
    },
    async setEComStore(event: any) {
      // not updating the ecomstore when the current value in vuex state and selected value are same
      // or when an empty value is given (on logout)
      if (this.currentEComStore.productStoreId === event.detail.value || !event.detail.value) {
        return;
      }

      if(this.userProfile) {
        await this.store.dispatch('user/setEComStore', {
          'eComStore': this.userProfile.stores.find((str: any) => str.productStoreId == event.detail.value)
        })
      }
    },
    getDateTime(time: any) {
      return DateTime.fromMillis(time).toLocaleString(DateTime.DATETIME_MED);
    },
    setLocale(locale: string) {
      this.store.dispatch('user/setLocale',locale)
    }
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    return {
      Actions,
      codeWorkingOutline,
      ellipsisVerticalOutline,
      globeOutline,
      openOutline,
      timeOutline,
      router,
      store,
      hasPermission,
      translate
    }
  }
});
</script>

<style scoped>
ion-card > ion-button {
  margin: var(--spacer-xs);
}
section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  align-items: start;
}
.user-profile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
}
hr {
  border-top: 1px solid var(--ion-color-medium);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacer-xs) 10px 0px;
}
</style>