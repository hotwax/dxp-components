import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.VUE_APP_MIX_PANEL_TOKEN as string , {debug: true , track_pageview: true, persistence: 'localStorage'});

const identify = (userId : string) =>{
    mixpanel.identify(userId);
};

const setUserProperties = ( properties : Record<string , any>) =>{
    mixpanel.people.set(properties);
};

const trackEvent = (event : string , properties: Record<string, any> = {}) =>{
    mixpanel.track(event , properties);
};

const reset = () =>{
    mixpanel.reset();
};

export {
    identify,
    setUserProperties,
    trackEvent,
    reset
}