<template>
  <div>
    <div id="sender" @click="open(this)">
      {{ renderedSender }}
    </div>
    <v-dialog
        v-model="dialog"
    >
      <v-card>
        <v-card-title>{{ $t("sender.title") }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="textField"></v-text-field>
        </v-card-text>
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
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Sender",
  props: ['sender'],
  data() {
    return {
      dialog: false,
      renderedSender: "Samuel Mathes - Brucknerstr. 28 - 72766 Reutlingen",
      textField: ""
    }
  },
  methods: {
    open() {
      this.dialog = true
      this.textField = this.renderedSender
    },
    close() {
      this.dialog = false;
      this.renderedSender = this.textField
    },
    abort() {
        this.dialog = false;
    }
  },
  watch: {
    'sender': function (newSender) {
      this.renderedSender = newSender
    }
  }
}


</script>

<style scoped>
#sender {
  text-decoration: underline;
  font-size: 10px;
}
</style>