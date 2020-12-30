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
      preload: 'src/preload.js',
      files: ["src/preload.js"],
      win: {
        icon: "src/assets/logo.png"
      }
    }
  }
}
