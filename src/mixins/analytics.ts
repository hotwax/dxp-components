import { computed, onMounted, onBeforeUnmount } from 'vue';
import mixpanel from 'mixpanel-browser';
import { useAuthStore } from '../index';
import { appContext } from '../index';
declare var process: any;

interface TrackableMetadata {       //defining the interface for trackable metadata
  label?: string;
  id?: string;
  [key: string]: any; 
}

function useAnalytics() {
  const handleButtonClick = (event: MouseEvent) => {
    event.stopPropagation(); //method to stop the click event from propagating up the DOM tree
    if (event.button === 0) { // Left mouse button
      const target = event.target as HTMLElement;
      const button = target.closest('ion-button, ion-item') as HTMLElement;  //finds the closest parent element that matches the selectors ion-button or ion-item
      const authStore = useAuthStore();
      const oms = computed(() => authStore.getOms);

      if (button && button.hasAttribute('trackable')) {
        const trackableData = button.getAttribute('trackable');
        let metadata: TrackableMetadata = {}; //object initialization for trackable metadata

        try {
          metadata = trackableData ? JSON.parse(trackableData) : {};
        } catch (error) {
          console.error('Error parsing trackable attribute:', error);
        }

        const buttonLabel = metadata.label || button.innerText || button.getAttribute('aria-label') || 'Unnamed button';
        const buttonId = button.id || metadata.id || 'no-id';
        mixpanel.track(buttonLabel, {
          oms: oms.value,
          label: buttonLabel,
          id: buttonId,
          ...metadata,
        });
      }
    }
  };

  onMounted(() => {
    try {
      mixpanel.init( process.env.VUE_APP_MIXPANEL_TOKEN , { debug: true });
    } catch (error) {
      console.log(error);
      return;
    }    
    const authStore = useAuthStore();
    const oms = computed(() => authStore.getOms);
    const appState = appContext.config.globalProperties.$store;
    const userProfile = appState.getters['user/getUserProfile']; //retrieves the user profile using a Vuex getter.
    const userEmail = userProfile.email; //fetch user email from userProfile
    const userID = userProfile.userLoginId; // fetch user ID from userProfile

    try {
      mixpanel.identify(userID);
      mixpanel.people.set({
        $email: userEmail,
        $userId: userID,
        $oms: oms.value
      });
    } catch (error) {
      console.log(error);
      return;
    }

    document.addEventListener('click', handleButtonClick); //adds the event listener
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleButtonClick);  //removes the event listener , to prevent memory leaks
  });
}

export default useAnalytics;
