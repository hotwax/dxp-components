require('./appInformation');

// const AppVersionWebpackPlugin = function() {
//   this.apply = function(compiler) {
//     process.env.VUE_APP_INFORMATION = appInformation;
//   };
// };
module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableLegacy: true,
      runtimeOnly: true,
      compositionOnly: false,
      fullInstall: true,
      enableInSFC: true
    }
  },
  // configureWebpack: {
  //   plugins: [
  //     new AppVersionWebpackPlugin()
  //   ]
  // }
}
