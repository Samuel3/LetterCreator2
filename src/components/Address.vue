<template>
  <div>
    <div @click="dialog=!dialog">
      <div id="receivingBlock">

        <div id="sender">
          {{ sender }}
        </div>
        <div id="receiver">
          <div v-html="receiver"></div>
        </div>
      </div>
    </div>
    <div v-if="dialog">
      Test
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title>Title</v-card-title>
          <v-card-text>Text</v-card-text>
          <v-card-actions>
            <v-btn @click="dialog=false">Button</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

  </div>
</template>

<script>
export default {
  name: "Address",
  data: () => ({
    dialog: false
  }),
  props: ['sender', 'receiver']
}
</script>

<style scoped>
#receivingBlock {

}

#sender {
  text-decoration: underline;
  font-size: 10px;
}
</style>