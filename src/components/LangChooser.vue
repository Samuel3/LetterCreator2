
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
      window.electronAPI.send("write","app.language", lang)
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