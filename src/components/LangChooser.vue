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
  methods: {
    changeLang(lang) {
      this.$i18n.locale = lang
    }
  }
}
</script>

<style scoped>

</style>