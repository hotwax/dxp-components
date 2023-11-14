export default interface UserState {
    token: string;
    current: object | null;
    permissions: any;
    currentFacility: object;
    instanceUrl: string;
    currentEComStore: object;
    preference: object;
    pwaState: any;
}