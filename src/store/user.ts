import { defineStore } from "pinia";
import { i18n, translate, userContext, useAuthStore } from "../../src";
import { DateTime } from "luxon";
import { showToast } from "src/utils";
import { facilityContext } from "../index";

declare let process: any;

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      localeOptions: process.env.VUE_APP_LOCALES ? JSON.parse(process.env.VUE_APP_LOCALES) : { "en-US": "English" },
      locale: 'en-US',
      currentTimeZoneId: '',
      timeZones: [],
      facilities: {} as any,
      currentFacility: {} as any
    }
  },
  getters: {
    getLocale: (state) => state.locale,
    getLocaleOptions: (state) => state.localeOptions,
    getTimeZones: (state) => state.timeZones,
    getCurrentTimeZone: (state) => state.currentTimeZoneId,
    getFacilites: (state) => state.facilities.itemList,
    getCurrentFacility: (state) => state.currentFacility
  },
  actions: {
    async setLocale(locale: string) {
      let newLocale, matchingLocale
      newLocale = this.locale
      // handling if locale is not coming from userProfile
      try {
        if (locale) {
          matchingLocale = Object.keys(this.localeOptions).find((option: string) => option === locale)
          // If exact locale is not found, try to match the first two characters i.e primary code
          matchingLocale = matchingLocale || Object.keys(this.localeOptions).find((option: string) => option.slice(0, 2) === locale.slice(0, 2))
          newLocale = matchingLocale || this.locale
          // update locale in state and globally
          if(userContext.setUserLocale) await userContext.setUserLocale({ newLocale })
        }
      } catch (error) {
        console.error(error)
      } finally {
        i18n.global.locale.value = newLocale
        this.locale = newLocale
      }
    },
    async setUserTimeZone(tzId: string) {
      // Do not make any api call if the user clicks the same timeZone again that is already selected
      if(this.currentTimeZoneId === tzId) {
        return;
      }

      try {
        await userContext.setUserTimeZone({ tzId })
        this.currentTimeZoneId = tzId

        showToast(translate("Time zone updated successfully"));
        return Promise.resolve(tzId)
      } catch(err) {
        console.error('Error', err)
        return Promise.reject('')
      }
    },
    async getAvailableTimeZones() {
      // Do not fetch timeZones information, if already available
      if(this.timeZones.length) {
        return;
      }

      try {
        const resp = await userContext.getAvailableTimeZones()
        this.timeZones = resp.filter((timeZone: any) => DateTime.local().setZone(timeZone.id).isValid);
      } catch(err) {
        console.error('Error', err)
      }
    },
    updateTimeZone(tzId: string) {
      this.currentTimeZoneId = tzId
    },

    async getUserFacilities(partyId: any, facilityGroupId: any, isAdminUser: boolean) {
      const authStore = useAuthStore();

      try {
        const response = await facilityContext.getUserFacilities(authStore.getToken.value, authStore.getBaseUrl, partyId, facilityGroupId, isAdminUser);
        this.facilities.itemList = response;
      } catch (error) {
        console.error(error);
      }
      return this.facilities.itemList
    },

    async setFacility(payload: any) {

      try {
        await facilityContext.setUserPreference({
          userPrefTypeId: 'SELECTED_FACILITY',
          userPrefValue: payload.facilityId
        }) 
        this.currentFacility = payload;
        return true;
      } catch (error) {
        console.error('error', error)
      }
      return false;
    },

    async getPreferredFacility(userPrefTypeId: any) {
      const authStore = useAuthStore();
      let preferredFacility = {} as any;
      preferredFacility = this.facilities.itemList[0];

      try {
        let preferredFacilityId = '';
        preferredFacilityId = await facilityContext.getUserPreference(authStore.getToken.value, authStore.getBaseUrl, userPrefTypeId);
        if(preferredFacility) {
          const facility = this.facilities.itemList.find((facility: any) => facility.facilityId === preferredFacilityId);
          facility && (preferredFacility = facility)
        }
      } catch (error) {
        console.error(error);
      }
      this.currentFacility = preferredFacility;
    },
  },
  persist: true
})
