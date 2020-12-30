<template>
  <div class="text-center">
    <v-dialog
        v-model="visible"
        width="500"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{ $t('import.title') }}
        </v-card-title>

        <v-card-text>
          <v-spacer></v-spacer>
          {{ $t('import.text') }}
          <v-file-input accept=".let" prepend-icon="mdi-email-outline" v-model="file" show-size></v-file-input>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              text
              @click="abort"
          >
            {{ $t('buttons.abort') }}
          </v-btn>
          <v-btn
              color="primary"
              text
              @click="close"
          >
            {{ $t('buttons.ok') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Import",
  data() {
    return {
      visible: true,
      file: null
    }
  },
  methods: {
    close: function () {
      this.$emit("close", this.file)
      this.file = null
    },
    abort: function () {
      this.$emit("abort")
      this.file = null
    }
  }

}
</script>

<style scoped>

</style>