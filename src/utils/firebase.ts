import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { defineStore } from "pinia";
let app;

const initialiseFirebaseApp = async (
  appFirebaseConfig: any,
  appFirebaseVapidKey: string,
  storeClientRegistrationToken: Function,
  addNotification: Function
) => {
  const firebaseConfig = appFirebaseConfig

  app = initializeApp(firebaseConfig);

  // Check for notifications required only in bopis app.
  if(addNotification) {
    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();
  
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: appFirebaseVapidKey
      });
      await storeClientRegistrationToken(token)
  
      // handle foreground message
      onMessage(messaging, (payload: any) => {
        addNotification({ notification: payload, isForeground: true });
      });
  
      // handle background message (service worker)
      const broadcast = new BroadcastChannel('FB_BG_MESSAGES');
      broadcast.onmessage = (event) => {
        addNotification({ notification: event.data, isForeground: false });
      };
    } else {
      alert("You denied notifications.");
    }
  }
  console.log(app);
  
};

export {
  initialiseFirebaseApp,
}