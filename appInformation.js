const { execSync } = require('child_process');
const package = require('./package.json');

(function() {
    const appVersionInfo = {
        version: "",
        branch: "",
        tag: "",
        revision: "",
        builtTime: ""
    };

    try {
        // Extract package version
        appVersionInfo.version = package.version;
    
        // Extract build time
        appVersionInfo.builtTime = Date.now();

        // Extract branch
        let output = executeCommand('git symbolic-ref --short -q HEAD');
        appVersionInfo.branch = output;

        // Extract tag
        // 2> /dev/null
        // 2> redirects stderr to file
        // /dev/null null device takes any input and throws away
        output = executeCommand('git describe --tags --exact-match 2> /dev/null');
        appVersionInfo.tag = output;

        // Extract revision
        output = executeCommand('git rev-parse --short HEAD');
        appVersionInfo.revision = output;
    } catch (err){ 
        console.warn("App version info package error: ", err.toString())
    }
    // TODO make it a generic plugin and separate out Vue specific environment variable setup
    process.env.VUE_APP_VERSION_INFO = JSON.stringify(appVersionInfo);

    function executeCommand(command) {
      // TODO Handle error cases
      // Check if should use spawn instead 
      return execSync(command).toString();
    }
})();