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
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title>{{ $t('address.title') }}
            <v-spacer></v-spacer>
            <v-btn
                icon
                dark
                @click="dialog=false"
            >
              <v-icon color="primary">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>Text</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                text
                @click="dialog=false"
            >
              {{ $t('buttons.abort') }}
            </v-btn>
            <v-btn
                color="primary"
                text
                @click="dialog=false"
            >
              {{ $t('buttons.ok') }}
            </v-btn>
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