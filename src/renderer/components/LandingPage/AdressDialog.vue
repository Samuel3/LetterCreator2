<template>
  <div id="addressDialog">
    <h1 id="title">Adress Dialog</h1>
      !!!{{storedAddresses}}!!!
    <div v-for="(address) in addresses">
        {{address.firstName}}
        {{address.name}}
    </div>
  </div>
</template>

<script>
    import draggable from 'vuedraggable'
    const store = require('data-store')('LetterCreator')
    store.set('address', {'test': 'test'})

    export default {
      name: 'AdressDialog',
      components: {
        draggable
      },
      data: function () {
        return {
          'addresses': [{'name': 'Name', 'firstName': 'firstName'}],
          'storedAddresses': store.get('address')
        }
      }
    }
</script>

<style scoped>

    @media print {
        #title{
            display: none;
        }
    }

    #addressDialog{
        display: block;
        border: 1px solid;
    }

</style>
