import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.VUE_APP_MIX_PANEL_TOKEN as string , {debug: true , track_pageview: true, persistence: 'localStorage'});

const addMixPanelUser = (userId: string, properties: Record<string, any>) => {
    mixpanel.identify(userId);
    mixpanel.people.set(properties);
};


const addMixPanelEvent = (event : string , properties: Record<string, any> = {}) =>{
    mixpanel.track(event , properties);
};

const mixPanelReset = () =>{
    mixpanel.reset();
};

export {
    addMixPanelUser,
    addMixPanelEvent,
    mixPanelReset
}