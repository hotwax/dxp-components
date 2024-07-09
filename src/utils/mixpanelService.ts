import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.VUE_APP_MIX_PANEL_TOKEN as string , {debug: true , track_pageview: true, persistence: 'localStorage'});

const mixPanelIdentifyUser = (userId : string) =>{
    mixpanel.identify(userId);
};

const mixPanelSetUserProperties = ( properties : Record<string , any>) =>{
    mixpanel.people.set(properties);
};

const mixPanelTrackEvent = (event : string , properties: Record<string, any> = {}) =>{
    mixpanel.track(event , properties);
};

const mixPanelReset = () =>{
    mixpanel.reset();
};

export {
    mixPanelIdentifyUser,
    mixPanelSetUserProperties,
    mixPanelTrackEvent,
    mixPanelReset
}