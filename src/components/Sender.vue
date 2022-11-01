<template>
  <div>
    <div id="sender" @click="dialog=true">
      {{renderedSender}}
    </div>
    <v-dialog
        v-model="dialog"
    >
      <v-card>
        <v-card-title>Title</v-card-title>
        <v-card-text>Text</v-card-text>
        <v-card-actions>
          Actions
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
  data: () => ({
    dialog: false,
    renderedSender: "Samuel Mathes - Brucknerstr. 28 - 72766 Reutlingen"
  }),
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