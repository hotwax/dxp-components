// composables/useAnalytics.ts

import { onMounted, onBeforeUnmount } from 'vue';
import mixpanel from 'mixpanel-browser';
import { appContext } from '../index';

function useAnalytics() {
  const handleButtonClick = (event: MouseEvent) => {
    if (event.button === 0) { // Left mouse button
      const target = event.target as HTMLElement;
      const button = target.closest('button, ion-button') as HTMLElement;

      if (button && button.hasAttribute('trackable')) {
        const buttonLabel = (button.innerText || button.getAttribute('aria-label') || 'Unnamed button') as string;

        mixpanel.track(buttonLabel, {
          label: buttonLabel,
          id: button.id || 'no-id',
        });
      }
    }
  };
  onMounted(() => {
    console.log('Initializing Mixpanel');

    try {
      mixpanel.init('5d1a58b28169000ca197c14274eddf87', { debug: true });
    } catch (error) {
      console.error('Error initializing Mixpanel:', error);
      return;
    }

    const appState = appContext.config.globalProperties.$store;

    if (!appState) {
      return;
    }

    const userProfile = appState.getters['user/getUserProfile'];

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
      return;
    }

    document.addEventListener('click', handleButtonClick);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleButtonClick);
  });
}

export default useAnalytics;
