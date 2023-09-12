import { defineStore } from "pinia";
import { noitificationContext } from "../index";
import { generateTopicName } from "../firebase-utils"

export const useNotificationStore = defineStore('notification', {
  state: () => {
    return {
      notifications: [] as any,
      deviceId: ''
    }
  },
  getters: {
    getNotifications: (state) => state.notifications,
    getDeviceId: (state) => state.deviceId
  },
  actions: {
    addNotification(notification: any) {
      this.notifications.push(notification)
    },
    async fetchNotificationPreferences(oms: string, productStoreId: string) {
      try {
        const enumerationResp = await noitificationContext.getNotificationEnumIds(noitificationContext.notificationEnumTypeId)
        const userPrefResp = await noitificationContext.getNotificationUserPrefTypeIds(noitificationContext.notificationApplicationId)
        const userPrefIds = userPrefResp?.map((userPref: any) => userPref.userPrefTypeId)

        const notificationPreferences = enumerationResp.reduce((notifactionPref: any, pref: any) => {
          const userPrefTypeIdToSearch = generateTopicName(oms, productStoreId, pref.enumId)
          notifactionPref.push({ ...pref, isEnabled: userPrefIds.includes(userPrefTypeIdToSearch) })
          return notifactionPref
        }, [])

        return notificationPreferences
      } catch (error) {
        console.error(error)
      }
    },
    async handleTopicSubscription(notificationPrefToUpate: any, oms: string, productStoreId: string) {
      const subscribeRequests = [] as any
      notificationPrefToUpate.subscribe.map((enumId: string) => {
        const topicName = generateTopicName(oms, productStoreId, enumId)
        subscribeRequests.push(noitificationContext.subscribeTopic(topicName, noitificationContext.notificationApplicationId).catch((err: any) => {
          return err;
        }))
      })

      const unsubscribeRequests = [] as any
      notificationPrefToUpate.unsubscribe.map((enumId: string) => {
        const topicName = generateTopicName(oms, productStoreId, enumId)
        unsubscribeRequests.push(noitificationContext.unsubscribeTopic(topicName, noitificationContext.notificationApplicationId).catch((err: any) => {
          return err;
        }))
      })

      const responses = await Promise.all([...subscribeRequests, ...unsubscribeRequests])
      const successCount = responses.reduce((successCount: number, response: any) => {
        if (response.data.successMessage) {
          successCount++
        }
        return successCount
      }, 0)
      
      // returning successfull updation count here to handle toast message
      // accordingly in the app
      return successCount
    },
    async storeClientRegistrationToken(registrationToken: string) {
      try {
        await noitificationContext.storeClientRegistrationToken(registrationToken, this.deviceId, noitificationContext.notificationApplicationId)
      } catch (error) {
        console.error(error)
      }
    },
    async removeClientRegistrationToken() {
      try {
        await noitificationContext.removeClientRegistrationToken(this.deviceId, noitificationContext.notificationApplicationId)
      } catch (error) {
        console.error(error)
      }
    }
  },
  persist: true
})
