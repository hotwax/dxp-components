import { computed, onMounted, onBeforeUnmount } from 'vue';
import mixpanel from 'mixpanel-browser';
import { useAuthStore } from '../index';
import { appContext } from '../index';

interface TrackableMetadata {
  label?: string;
  id?: string;
  [key: string]: any; 
}

function useAnalytics() {
  const handleButtonClick = (event: MouseEvent) => {
    if (event.button === 0) { // Left mouse button
      const target = event.target as HTMLElement;
      const button = target.closest('button, ion-button, ion-item') as HTMLElement;
      const authStore = useAuthStore();
      const oms = computed(() => authStore.getOms);

      if (button && button.hasAttribute('trackable')) {
        const trackableData = button.getAttribute('trackable');
        let metadata: TrackableMetadata = {};

        try {
          metadata = trackableData ? JSON.parse(trackableData) : {};
        } catch (error) {
          console.error('Error parsing trackable attribute:', error);
        }

        const buttonLabel = metadata.label || button.innerText || button.getAttribute('aria-label') || 'Unnamed button';
        const buttonId = button.id || metadata.id || 'no-id';
        console.log('Button clicked:', event);
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
    console.log('Initializing Mixpanel');

    try {
      mixpanel.init('1d60dbd4447efd425c428afe044012e3', { debug: true });
    } catch (error) {
      return;
    }    
    const authStore = useAuthStore();
    const oms = computed(() => authStore.getOms);
    const appState = appContext.config.globalProperties.$store;
    const userProfile = appState.getters['user/getUserProfile'];
    const userEmail = userProfile.email;
    const userID = userProfile.userLoginId;

    try {
      mixpanel.identify(userID);
      mixpanel.people.set({
        $email: userEmail,
        $userId: userID,
        $oms: oms.value
      });
    } catch (error) {
      return;
    }

    document.addEventListener('click', handleButtonClick);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleButtonClick);
  });
}

export default useAnalytics;
