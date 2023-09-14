import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useNotificationStore } from "../store/notification";
import { DateTime } from 'luxon'

const initialiseFirebaseApp = async (appFirebaseConfig: any, appFirebaseVapidKey: string) => {
  const firebaseConfig = appFirebaseConfig

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: appFirebaseVapidKey
    });
    const notificationStore = useNotificationStore()

    // TODO handle case - if (!token) 
    notificationStore.deviceId = generateDeviceId()
    await notificationStore.storeClientRegistrationToken(token)

    // handle foreground message
    onMessage(messaging, (payload: any) => {
      notificationStore.addNotification(payload);
    });

    // handle background message (service worker)
    const broadcast = new BroadcastChannel('FB_BG_MESSAGES');
    broadcast.onmessage = (event) => {
      notificationStore.addNotification(event.data);
    };
  } else if (permission === "denied") {
    alert("You denied notifications.");
  }
};

const generateDeviceId = () => {
  // device ID: <DDMMYY><timestamp[6]>
  return (DateTime.now().toFormat('ddMMyy') + String(DateTime.now().toMillis()).slice(-6))
}

const generateTopicName = (oms: string, facilityId: string, enumId: string) => {
  // topic name: oms-facilityId-enumId(enumCode)
  return `${oms}-${facilityId}-${enumId}`
}

export {
  generateTopicName,
  initialiseFirebaseApp,
  generateDeviceId
}