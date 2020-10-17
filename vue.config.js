module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],

  pluginOptions: {
    i18n: {
      locale: 'de',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    },
    electronBuilder: {
      builderOptions: {
        preload: 'src/preload.js'
        // options placed here will be merged with default configuration and passed to electron-builder
      }
    }
  }
}
