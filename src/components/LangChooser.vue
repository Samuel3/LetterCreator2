
<template>
  <v-col cols="6">
    {{$t('menu.language')}}:
    <v-select
        :items="languages"
        :value="this.$i18n.locale"
        :label="$t('menu.language')"
        single-line
        @change="changeLang"

    >
    </v-select>
  </v-col>
</template>

<script>

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "i18n",
  data: () => ({
    languages: ['de', 'en']
  }),
  props: {
    "language": String
  },
  methods: {
    changeLang(lang) {
      this.$i18n.locale = lang;
      window.electronAPI.sendStringMessage("app.language", lang)
    },
    mounted: function () {

    }

  },
  watch: {
    // whenever question changes, this function will run
    language: {
      handler(newVal) {
        this.$i18n.locale = newVal
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>