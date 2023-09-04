import { defineStore } from "pinia";
import { noitificationContext } from "../index";

export const useNotificationStore = defineStore('notification', {
  state: () => {
    return {
      notifications: [] as any,
      notificationPref: [] as any,
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
    async getNotificationPreferences(enumTypeId: string) {
      try {
        this.notificationPref = await noitificationContext.getNotificationPreferences(enumTypeId)
      } catch (error) {
        console.error(error)
      }
    },
    async subscribeTopic(topicName: string, applicationId: string) {
      try {
        await noitificationContext.subscribeTopic(topicName, applicationId)
      } catch (error) {
        console.error(error)
      }
    },
    async unsubscribeTopic(topicName: string, applicationId: string) {
      try {
        await noitificationContext.unsubscribeTopic(topicName, applicationId)
      } catch (error) {
        console.error(error)
      }
    },
    async storeClientRegistrationToken(registrationToken: string, applicationId: string) {
      try {
        await noitificationContext.storeClientRegistrationToken(registrationToken, this.deviceId, applicationId)
      } catch (error) {
        console.error(error)
      }
    },
    async removeClientRegistrationToken(applicationId: string) {
      try {
        await noitificationContext.removeClientRegistrationToken(this.deviceId, applicationId)
      } catch (error) {
        console.error(error)
      }
    }
  },
  persist: true
})
