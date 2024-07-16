// composables/useAnalytics.ts

import { onMounted, onBeforeUnmount } from 'vue';
import mixpanel from 'mixpanel-browser';
import { appContext } from '../index';

interface TrackableMetadata {
  label?: string;
  id?: string;
  [key: string]: any; // Allow other properties as well
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
  
        console.log('Trackable Button Clicked:', { label: buttonLabel, id: buttonId });
  
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
      console.log('Mixpanel initialized');
    } catch (error) {
      console.error('Error initializing Mixpanel:', error);
      return;
    }

    const appState = appContext.config.globalProperties.$store;

    if (!appState) {
      console.error('appState is not defined');
      return;
    }

    const userProfile = appState.getters['user/getUserProfile'];

    if (!userProfile) {
      console.error('userProfile is not defined');
      return;
    }

    const userEmail = userProfile.email;
    const userID = userProfile.userLoginId;

    console.log('User Profile:', { userID, userEmail });

    try {
      mixpanel.identify(userID);
      mixpanel.people.set({
        $email: userEmail,
        $userId: userID,
      });
    } catch (error) {
      console.error('Error identifying user in Mixpanel:', error);
      return;
    }

    document.addEventListener('click', handleButtonClick);
    console.log('Event listener added for button clicks');
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleButtonClick);
    console.log('Event listener removed for button clicks');
  });
}

export default useAnalytics;
