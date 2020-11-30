<template>
  <v-app>
    <v-navigation-drawer
        v-model="drawer"
        absolute
        bottom
        temporary
    >
      <v-list nav dense>
        <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-title @click="foo=!foo">Foo</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Bar</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Fizz</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Buzz</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <LangChooser/>
    </v-navigation-drawer>

    <v-app-bar
        app
        color="primary"
        dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
            transition="scale-transition"
            width="40"
        />

        <v-img
            alt="Vuetify Name"
            class="shrink mt-1 hidden-sm-and-down"
            contain
            min-width="100"
            src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
            width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
          href="https://github.com/vuetifyjs/vuetify/releases/latest"
          target="_blank"
          text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-card>
        <v-card-title>{{ $t('menu.heading') }}</v-card-title>
        <v-card-text id="letter">
          <Address/>
          <div @click="datepickerActive=true" id="date">
            Reutlingen, den {{ formattedDate }}
          </div>
          <div id="subject" contenteditable="true" class="font-weight-bold">
            Betreff:
          </div>
          <div id="letter-content" contenteditable="true">
            Content
            <br><br>
            Greetings
            <br><br>
            Samuel Mathes
          </div>
          <v-date-picker
              v-if="datepickerActive"
              v-model="date"
              locale="de-de"
              @input="formattedDate=formatDate(date);datepickerActive=false"
              :first-day-of-week="1"
              @blur="formattedDate=formatDate(date)"
          >

          </v-date-picker>
        </v-card-text>
        <v-card-actions>
          <v-row align="center" justify="space-around">
            <v-btn tile @click="foldingMarks=!foldingMarks">
              <v-checkbox v-model="foldingMarks" @click="foldingMarks=!foldingMarks"></v-checkbox>
              {{ $t('menu.foldingMarks') }}
              <v-icon large color="accent" outlined>mdi-format-page-break</v-icon>
            </v-btn>
            <v-btn tile @click="print">
              {{ $t('menu.print') }}
              <v-icon large color="accent">mdi-printer</v-icon>
            </v-btn>
            <v-btn tile @click="printToPdf">
              {{ $t('menu.export') }}
              <v-icon large color="accent">mdi-file-pdf-outline</v-icon>
            </v-btn>
            <v-btn tile @click="historyVisible=true">
              {{ $t('menu.history') }}
              <v-icon large color="accent">mdi-history</v-icon>
            </v-btn>
            <v-btn tile @click="importVisible=true">
              {{ $t('menu.import') }}
              <v-icon large color="accent">mdi-import</v-icon>
            </v-btn>
          </v-row>
          <History v-if="historyVisible" v-on:close="closeHistoryDialog"/>
          <Import v-if="importVisible" v-on:close="closeImportDialog"/>
          <v-snackbar
              v-model="snackbarVisible"
              :timeout="timeout"
          >
            {{ snackBarContent }}
            <template v-slot:action="{ attrs }">
              <v-btn
                  color="pink"
                  text
                  v-bind="attrs"
                  @click="snackbar = false"
              >
                Close
              </v-btn>
            </template>
          </v-snackbar>

          <v-snackbar
              v-model="errorSnackbar"
              :timeout="timeout"
              color="red"
          >
            {{ errorSnackbar }}
            <template v-slot:action="{ attrs }">
              <v-btn
                  color="white"
                  text
                  v-bind="attrs"
                  @click="snackbar = false"
              >
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </v-card-actions>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import LangChooser from './components/LangChooser';
import Address from "@/components/Address";
import History from "@/components/History";
import Import from "@/components/Import";

export default {
  name: 'App',

  components: {
    Import,
    History,
    Address,
    LangChooser
  },

  data: vm => ({
    drawer: false,
    foo: false,
    group: null,
    foldingMarks: false,
    date: new Date().toISOString().substr(0, 10),
    formattedDate: vm.formatDate(new Date().toISOString().substr(0, 10)),
    "datepickerActive": false,
    "snackbarVisible": false,
    "snackBarContent": "",
    "timeout": 20000,
    "errorSnackbar": false,
    "errorSnackbarContent": "",
    "historyVisible": false,
    "importVisible": false
  }),

  methods: {
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}.${month}.${year}`
    },
    printToPdf() {
      window.ipcRenderer.send("print-pdf")
    },
    print() {
      window.ipcRenderer.send("print")
    },
    displayInfoMsg(msg) {
      this.snackbarVisible = true
      this.snackBarContent = msg
    },
    displayErrorMsg(msg) {
      this.errorSnackbar = true
      this.errorSnackbarContent = msg
    },
    closeHistoryDialog() {
      this.historyVisible = false
    },
    closeImportDialog() {
      this.importVisible = false
    }
  },

  mounted() {
    window.ipcRenderer.on("print-pdf-path", (event, args) => {
      this.displayInfoMsg(`Printed to ${args}`)
    })
    window.ipcRenderer.on("print-succes", () => {
      this.displayInfoMsg("Printed successfully")
    });
    window.ipcRenderer.on("error", (event, args) => {
      this.displayErrorMsg(args)
    });
  }
};
</script>

<style>
#letter {
  border: 1px solid;
  margin: 25px;
  width: 98%;
}

#letter-content {
  margin-top: 2em;

}

#date {
  float: right;
}

#subject {
  margin-top: 150px;
  font-weight: bold;
}

@media print {
  #app > div > header, .v-card__title, .v-card__actions, .v-app-bar, .v-toolbar__content, #app > div > main > div > div > div.v-card__actions > div.v-snack.v-snack--active.v-snack--bottom.v-snack--has-background > div {
    display: none !important;
  }

  #letter {
    border: none;
    box-shadow: none;
  }

  .v-card, #app > div > main > div > div {
    box-shadow: none !important;
  }

}
</style>
