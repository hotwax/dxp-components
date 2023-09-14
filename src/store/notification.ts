import { defineStore } from "pinia";
import { noitificationContext } from "../index";
import { generateTopicName } from "../utils/firebase"
import { DateTime } from "luxon"

export const useNotificationStore = defineStore('notification', {
  state: () => {
    return {
      notifications: [] as any,
      deviceId: ''
    }
  },
  getters: {
    // sorting notifications by descending time
    getNotifications: (state) => state.notifications.sort((a: any, b: any) => b.time - a.time),
    getDeviceId: (state) => state.deviceId
  },
  actions: {
    addNotification(notification: any) {
      this.notifications.push({ ...notification, time: DateTime.now().toMillis() })
      // toast when new notifications are added
      noitificationContext.showNewNotificationToast()
    },
    async fetchNotificationPreferences(oms: string, facilityId: string) {
      try {
        const enumerationResp = await noitificationContext.getNotificationEnumIds(noitificationContext.notificationEnumTypeId)
        const userPrefResp = await noitificationContext.getNotificationUserPrefTypeIds(noitificationContext.notificationApplicationId)
        const userPrefIds = userPrefResp?.map((userPref: any) => userPref.userPrefTypeId)

        const notificationPreferences = enumerationResp.reduce((notifactionPref: any, pref: any) => {
          const userPrefTypeIdToSearch = generateTopicName(oms, facilityId, pref.enumId)
          notifactionPref.push({ ...pref, isEnabled: userPrefIds.includes(userPrefTypeIdToSearch) })
          return notifactionPref
        }, [])

        return notificationPreferences
      } catch (error) {
        console.error(error)
      }
    },
    async handleTopicSubscription(notificationPrefToUpate: any, oms: string, facilityId: string) {
      const subscribeRequests = [] as any
      notificationPrefToUpate.subscribe.map((enumId: string) => {
        const topicName = generateTopicName(oms, facilityId, enumId)
        subscribeRequests.push(noitificationContext.subscribeTopic(topicName, noitificationContext.notificationApplicationId).catch((err: any) => {
          return err;
        }))
      })

      const unsubscribeRequests = [] as any
      notificationPrefToUpate.unsubscribe.map((enumId: string) => {
        const topicName = generateTopicName(oms, facilityId, enumId)
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