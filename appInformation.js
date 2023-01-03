(function() {
    const appInformation = {
        version: "1.2.0"
    };
    process.env.VUE_APP_INFORMATION = JSON.stringify(appInformation);
    return appInformation;
})();