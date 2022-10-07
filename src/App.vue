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
      <LangChooser :language="lang"/>
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
            src="./assets/logo.svg"
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
        <v-card-text>
          <v-row>
            <v-col cols="2" id="buttons">
              <v-spacer style="height: 10px;"></v-spacer>
              <v-btn tile @click="letter.foldingMarks=!letter.foldingMarks">
                <v-checkbox v-model="letter.foldingMarks" @click="letter.foldingMarks=!letter.foldingMarks"></v-checkbox>
                {{ $t('menu.foldingMarks') }}
                <v-icon large color="accent" outlined>mdi-format-page-break</v-icon>
              </v-btn>
              <v-spacer style="height: 10px;"></v-spacer>
              <v-select
                  :items="layouts"
                  :label="$t('menu.layout')"
                  outlined
                  v-model="selectedLayout"
              ></v-select>
              <v-spacer></v-spacer>
              <v-divider class="divider"></v-divider>
              <Import v-on:close="closeImportDialog"/>
              <v-divider class="divider"></v-divider>
              <History v-on:close="closeHistoryDialog"/>
            </v-col>
            <v-col id="letter" cols="9">
              <Sender :sender="letter.sender"/>
              <Address :receiver="letter.receiver"/>
              <div id="date">
                <div id="place" contenteditable="true"> {{ letter.place }}</div>
                <div @click="datepickerActive=true">
                  {{ formattedDate }}
                </div>
              </div>
              <v-dialog v-model="datepickerActive" width="350">
                <v-card>
                  <v-toolbar>
                    <v-spacer></v-spacer>
                    <v-btn
                        icon
                        dark
                        @click="datepickerActive=false"
                    >
                      <v-icon color="primary">mdi-close</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-card-text>
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

                  </v-card-actions>
                </v-card>
              </v-dialog>
              <div id="subject" contenteditable="true" class="font-weight-bold">
                {{ letter.subject }}
              </div>
              <div id="foldingMark1" v-if="letter.foldingMarks" class="foldingMarks"></div>
              <div id="foldingMark2" v-if="letter.foldingMarks" class="foldingMarks"></div>
              <div id="foldingMark3" v-if="letter.foldingMarks" class="foldingMarks"></div>
              <div id="letter-content" contenteditable="true">
                <div v-html="letter.content"></div>
                <br><br>
                <div v-html="letter.greeting"></div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions style="height:5rem">
          <v-row align="center" justify="space-around">
            <v-btn tile @click="print">
              {{ $t('menu.print') }}
              <v-icon large color="accent">mdi-printer</v-icon>
            </v-btn>
            <v-btn tile @click="printToPdf">
              {{ $t('menu.export') }}
              <v-icon large color="accent">mdi-file-pdf-outline</v-icon>
            </v-btn>
          </v-row>
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
                  @click="snackbarVisible = false"
              >
                {{ $t('buttons.close') }}
              </v-btn>
            </template>
          </v-snackbar>

          <v-snackbar
              v-model="errorSnackbar"
              :timeout="timeout"
              color="red"
          >
            {{ errorSnackbarContent }}
            <template v-slot:action="{ attrs }">
              <v-btn
                  color="white"
                  text
                  v-bind="attrs"
                  @click="errorSnackbar = false"
              >
                {{ $t('buttons.close') }}
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
import Sender from "@/components/Sender";

export default {
  name: 'App',

  components: {
    Sender,
    Import,
    History,
    Address,
    LangChooser
  },

  data: vm => ({
    drawer: false,
    foo: false,
    lang: 'ru',
    group: null,
    date: new Date().toISOString().substr(0, 10),
    formattedDate: vm.formatDate(new Date().toISOString().substr(0, 10)),
    "datepickerActive": false,
    "snackbarVisible": false,
    "snackBarContent": "",
    "timeout": 20000,
    "errorSnackbar": false,
    "errorSnackbarContent": "",
    "layouts": ["DIN5008"],
    "selectedLayout": "DIN5008",
    "letter": {
      "sender": "Samuel Mathes - Brucknerstr. 28 - 72766 Reutlingen",
      "receiver": "Doppelklicken, um Empfänger hinzuzufügen<br><br>",
      "place": "Reutlingen, den",
      "date": vm.formatDate(new Date().toISOString().substr(0, 10)),
      "foldingMarks": false,
      "subject": "Betreff: ",
      "content": "Content",
      "greeting": "Grüße <br><br>Samuel Mathes"
    }
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
      console.log("Close History")
    },
    closeImportDialog(file) {
      try {
        if (null != file) {
          let data = window.fs.readFileSync(file.path, {encoding: "utf8", flag: "r"})
          let parsedData = JSON.parse(data)
          this.letter = parsedData
          this.displayInfoMsg(this.$t('import.success'))
          let date = parsedData.date
          let [day, month, year] = date.split(".")
          this.date = new Date(Date.parse(`${year}-${month}-${day}`)).toISOString().substr(0, 10)
          this.formattedDate = this.formatDate(this.date)
        }
      } catch (e) {
        this.displayErrorMsg(this.$t('import.error') + file.path)
      }
    }
  },

  mounted() {
    window.ipcRenderer.send('read', 'app.language')
    window.ipcRenderer.on("print-pdf-path", (event, args) => {
      this.displayInfoMsg(`Printed to ${args}`)
    })
    window.ipcRenderer.on("app.language", (event, args) => {
      console.log("Received response for app.language " + args)
      this.lang = args
    });
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
  color: black;
}

#letter-content {
  margin-top: 2em;
}

#date {
  float: right;
  display: flex;
}

#place {
  padding-right: 0.25em;
}

#subject {
  margin-top: 150px;
  font-weight: bold;
}

.divider {
  margin: 10px 0px
}

#date {
  margin-top: 4rem;
}

.foldingMarks {
  border-top: 1px solid;
  height: 1px;
  width: 50px;
  position: absolute;
}

@media print {
  #app > div > header, .v-card__title, .v-card__actions, .v-app-bar, .v-toolbar__content, #app > div > main > div > div > div.v-card__actions > div.v-snack.v-snack--active.v-snack--bottom.v-snack--has-background > div {
    display: none !important;
  }

  #letter {
    border: 1px solid;
    width: 100%;
    margin-left: 25mm;
    margin-right: 20mm;
    padding: 0px;
    box-shadow: none;
  }

  .v-card, #app > div > main > div > div {
    box-shadow: none !important;
  }

  #buttons {
    display: none;
  }

  #date {
    margin-top: 4rem;
    right: 0px;
    position: absolute;
  }

  #subject {
    margin-top: 9rem;
  }

  .foldingMarks {
    position: absolute;
    left: 0px;
    padding-left: 0px;
    width: 30px;
  }

  #foldingMark1 {
    top: 87mm;
  }

  #foldingMark2 {
    top: 148.5mm;
  }

  #foldingMark3 {
    top: 192mm;
  }
}
</style>
