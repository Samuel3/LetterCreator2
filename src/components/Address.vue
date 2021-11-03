<template>
  <div>
    <div>
      <div id="receivingBlock">
        <div id="receiver" @click="application=!application">
          <div v-html="renderedReceiver"></div>
        </div>
      </div>
    </div>
    <div v-if="application">
      <v-dialog v-model="application">
        <v-card>
          <v-card-text>
            <v-data-table
                show-select
                :single-select="true"
                :headers="headers"
                :items="addresses"
                :search="search"
                :footer-props="{
                   'items-per-page-text': $t('address.texts.addressPerPage'),
                   'items-per-page-options': [-1,5,10],
                   'options': {
                     'itemsPerPage': -1
                   },
                   'items-per-page-all-text': $t('address.texts.all')
                }"
            >
              <template v-slot:top>
                <v-toolbar
                    flat
                >
                  <v-toolbar-title>{{ $t('address.title') }}</v-toolbar-title>
                  <v-divider
                      class="mx-4"
                      inset
                      vertical
                  ></v-divider>
                  <v-spacer></v-spacer>
                  <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      :label="$t('address.texts.search')"
                      single-line
                      hide-details
                  ></v-text-field>
                  <v-dialog
                      v-model="dialog"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          color="primary"
                          dark
                          class="mb-2"
                          v-bind="attrs"
                          v-on="on"
                      >
                        {{ $t('address.texts.new') }}
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12"
                                   sm="6"
                                   md="3"
                                   v-for="header in getNameParts"
                                   :key="header.value"
                            >
                              <v-text-field
                                  :label="header.text"
                                  v-model="editedItem[header.value]"
                              >
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12"
                                   sm="6"
                                   md="3"
                                   v-for="header in getCompanyDetails"
                                   :key="header.value"
                            >
                              <v-text-field
                                  :label="header.text"
                                  v-model="editedItem[header.value]"
                              >
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12"
                                   sm="6"
                                   md="3"
                                   v-for="header in getCityDetails"
                                   :key="header.value"
                            >
                              <v-text-field
                                  :label="header.text"
                                  v-model="editedItem[header.value]"
                              >
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="close"
                        >
                          {{ $t('buttons.abort') }}
                        </v-btn>
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="save"
                        >
                          {{ $t('address.buttons.save') }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-card-title class="headline">{{ $t('address.buttons.delete') }}</v-card-title>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete">{{ $t('buttons.abort') }}</v-btn>
                        <v-btn color="blue darken-1" text @click="deleteItemConfirm">{{ $t('buttons.ok') }}</v-btn>
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                    small
                    @click="deleteItem(item)"
                >
                  mdi-delete
                </v-icon>
              </template>
              <template v-slot:no-data>
                <v-btn
                    color="primary"
                    @click="initialize"
                >
                  Reset
                </v-btn>
              </template>
              <template v-slot:body="{ items, headers }">
                <tbody>
                <tr v-for="(item,idx) in items" :key="idx" @click="selectItem(idx)">
                  <td v-for="(header,key) in headers" :key="key">
                    <div v-if="!(key==0||key==11)">
                      <v-edit-dialog
                          :return-value.sync="item[header.value]"
                          @save="save"
                          @cancel="cancel"
                          @open="open"
                          @close="close"
                          large
                          :save-text="$t('address.buttons.save')"
                          :cancel-text="$t('buttons.abort')"
                      > {{ item[header.value] }}
                        <template v-slot:input>
                          <v-text-field
                              v-model="item[header.value]"
                              :label="$t('address.buttons.edit')"
                              single-line
                          ></v-text-field>
                        </template>
                      </v-edit-dialog>
                    </div>
                    <div v-if="key==0">
                      <v-checkbox
                          v-model="item.checked"
                          @click="selectItem(idx)"
                      ></v-checkbox>
                    </div>
                    <div v-if="key==11">
                      <v-icon
                          small
                          class="mr-2"
                          @click="editItem(item)"
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon
                          small
                          @click="deleteItem(item)"
                      >
                        mdi-delete
                      </v-icon>

                    </div>
                  </td>
                </tr>
                </tbody>
              </template>

            </v-data-table>
            <v-snackbar
                v-model="snackbar"
            >
              {{ $t('address.texts.noEntrySelected') }}
              <template v-slot:action="{ attrs }">
                <v-btn
                    color="pink"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                >
                  {{ $t('buttons.close') }}
                </v-btn>
              </template>
            </v-snackbar>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                text
                @click="application=false"
            >
              {{ $t('buttons.abort') }}
            </v-btn>
            <v-btn
                color="primary"
                text
                @click="closeAndApply"
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
  data: vm => ({
    renderedReceiver: "Samuel Mathes <br>Brucknerstr. 28 <br>72766 Reutlingen",
    application: false,
    snackbar: false,
    dialog: false,
    search: "",
    headers: [
      {text: vm.$t('address.header.salutation'), value: 'salutation'},
      {text: vm.$t('address.header.title'), value: 'title'},
      {text: vm.$t('address.header.name'), value: 'name'},
      {text: vm.$t('address.header.surname'), value: 'surname'},
      {text: vm.$t('address.header.company'), value: 'company'},
      {text: vm.$t('address.header.department'), value: 'department'},
      {text: vm.$t('address.header.street'), value: 'street'},
      {text: vm.$t('address.header.zip'), value: 'zip'},
      {text: vm.$t('address.header.city'), value: 'city'},
      {text: vm.$t('address.header.country'), value: 'country'},
      {text: 'Actions', value: 'actions', sortable: false}
    ],
    addresses: [{
      "salutation": "Herr",
      "title": "",
      "name": "Max",
      "surname": "Mustermann",
      "company": "Musterfirma",
      "department": "Musterabteilung",
      "street": "Musterstraße",
      "city": "Musterstadt",
      "zip": "12345",
      "country": "Musterland",
      "checked": false
    }, {
      "salutation": "Frau",
      "title": "",
      "name": "Maxime",
      "surname": "Musterfrau",
      "company": "Musterfirma",
      "department": "Musterabteilung",
      "street": "Musterstraße",
      "city": "Musterstadt",
      "zip": "12345",
      "country": "Musterland",
      "checked": false
    }],
    editedIndex: -1,
    editedItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    defaultItem: {
      name: '',
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    dialogDelete: false,
    max25chars: v => v.length <= 25 || 'Input too long!',
  }),
  props: ['receiver'],
  methods: {

    cancel() {
      console.log("Cancel")
    },

    open() {
      console.log("Open")
    },
    editItem(item) {
      this.editedIndex = this.addresses.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.addresses.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.addresses.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeAndApply() {
      let checkedItem = this.addresses.filter((it) => it.checked)
      if (checkedItem.length != 0) {
        this.application = false
        this.renderedReceiver = this.getFormattedAddress(checkedItem[0])
      } else {
        this.snackbar = true
      }
    },

    save() {
      this.addresses.forEach((it) => {
        it.checked = false
      })
      if (this.editedIndex > -1) {
        Object.assign(this.addresses[this.editedIndex], this.editedItem)
        this.addresses[this.editedIndex].checked = true
      } else {
        this.addresses.push(this.editedItem)
        this.addresses[this.addresses.length -1].checked = true
      }
      this.close()
    },

    selectItem(index) {
      let oldState = this.addresses[index].checked
      this.addresses.forEach((it) => {
        it.checked = false
      })
      if (oldState) {
        this.addresses[index].checked = true
      }
    },

    getFormattedAddress(item) {
      let name = item.salutation + " "
      if (item.title && item.title.length > 0) {
        name += item.title + " "
      }
      name += item.name + " " + item.surname + "<br>";
      let formattedAdress = ""
      if (name.length && name.length > 0) {
        formattedAdress += name
      }
      if (item.department && item.department.length > 0) {
        formattedAdress += `${item.department}<br>`
      }
      if (item.company && item.company.length > 0) {
        formattedAdress += `${item.company}<br>`
      }
      if (item.street && item.street.length > 0) {
        formattedAdress += `${item.street}<br>`
      }
      formattedAdress += `${item.zip || ""} ${item.city || ""}<br>`;
      if (item.country && item.country.length > 0) {
        formattedAdress += item.country
      }
      return formattedAdress
    },
    updateReceiver(newReiver) {
      this.renderedReceiver = newReiver
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? this.$t('address.texts.new') : 'Edit Item'
    },
    getNameParts() {
      return this.headers.slice(0, 4)
    },
    getCompanyDetails() {
      return this.headers.slice(4, 6)
    },
    getCityDetails() {
      return this.headers.slice(6, 10)
    }
  },
  watch: {
    'receiver': function (newReceiver) {
      this.updateReceiver(newReceiver)
    }
  }

}
</script>

<style scoped>

</style>