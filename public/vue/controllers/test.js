import Vue from 'vue'

new Vue({
  el: '#app',
  data: {
    helpper0: false
  },
  methods: {
    helpper(data) { this[data] = !this[data] }
  }
})