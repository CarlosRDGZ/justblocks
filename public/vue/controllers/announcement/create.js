const vm = new Vue({
  el: '#app',
  data: {
    title: '',
    dateLaunching: Date,
    dateEndEnrollments: Date,
    dateEvaluations: Date,
    dateResults: Date,
    evaluators: 0,
    projectsPerEvaluator: 0,
    ui: {
      helpper0: false,
      helpper1: false,
      helpper2: false,
      helpper3: false,
      helpper4: false,
      error0: false,
      error1: false
    }
  },
  methods: {
    helpper(data) {
      for (let i = 0; i <= 4; i++)
        if (this.ui[`helpper${i}`] === true && data != i)
          this.ui[`helpper${i}`] = false
      this.ui[`helpper${data}`] = !this.ui[`helpper${data}`]
    }
  },
  watch: {
    evaluators: function(val) {
      this.ui.error0 = val <= 0 ? true : false
    },
    projectsPerEvaluator: function(val) {
      this.ui.error1 = val > this.evaluators ? true : false
    }
  }
})