<template>
  <div class="text-center">
    <v-btn tile @click="visible=true">
      {{ $t('menu.history') }}
      <v-icon large color="accent">mdi-history</v-icon>
    </v-btn>
    <v-dialog
        v-model="visible"
        @click="close"
        width="500"
    >

      <v-card>
        <v-card-title class="headline grey lighten-2">
          History
        </v-card-title>

        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="close()"
          >
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "History",
  data() {
    return {
      visible: false
    }
  },
  methods: {
    close: function () {
      this.$emit("close")
      this.visible=false
    }
  }
}
</script>

<style scoped>

</style>