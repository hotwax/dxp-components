import { onMounted, onBeforeUnmount } from 'vue';
import mixpanel from 'mixpanel-browser';
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
      const button = target.closest('button, ion-button') as HTMLElement;
  
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
  
        mixpanel.track(buttonLabel, {
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
      mixpanel.init('5d1a58b28169000ca197c14274eddf87', { debug: true });
    } catch (error) {
      return;
    }

    const appState = appContext.config.globalProperties.$store;
    const userProfile = appState.getters['user/getUserProfile'];
    const userEmail = userProfile.email;
    const userID = userProfile.userLoginId;

    try {
      mixpanel.identify(userID);
      mixpanel.people.set({
        $email: userEmail,
        $userId: userID,
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
