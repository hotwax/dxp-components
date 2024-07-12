import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel with the token from app environment variables.
// Debug mode is enabled, page views are tracked, and persistence is set to localStorage.
mixpanel.init(process.env.VUE_APP_MIX_PANEL_TOKEN as string, {
    debug: true,
    track_pageview: true,
    persistence: 'localStorage'
});

/**
 * Identifies a user in Mixpanel and sets their properties.
 * 
 * @param {string} userId - The unique identifier for the user.
 * @param {Record<string, any>} properties - The properties associated with the user.
 */
const addMixPanelUser = (userId: string, properties: Record<string, any>) => {
    mixpanel.identify(userId); // Identify the user with the provided userId.
    mixpanel.people.set(properties); // Set the user's properties in Mixpanel.
};

/**
 * Tracks an event in Mixpanel with optional properties.
 * 
 * @param {string} event - The name of the event to track.
 * @param {Record<string, any>} [properties={}]
 */
const addMixPanelEvent = (event: string, properties: Record<string, any> = {}) => {
    mixpanel.track(event, properties); // Track the event with its associated properties.
};

/**
 * Resets the Mixpanel state, clearing any stored data.
 */
const mixPanelReset = () => {
    mixpanel.reset(); // Reset Mixpanel, clearing the current user and any stored data.
};

// Export the functions for use in other parts of the application.
export {
    addMixPanelUser,
    addMixPanelEvent,
    mixPanelReset
};
