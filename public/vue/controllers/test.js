import Vue from 'vue'
import axios from 'axios'

new Vue({
  el: '#app',
  data: {
    helpper0: false
  },
  methods: {
    helpper(data) { this[data] = !this[data] },
    send() {
      axios.post('')
    }
  }
})