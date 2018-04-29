const vm = new Vue({
  el: '#app',
  data: {
    announ: {
      title: undefined,
      creationDate: undefined,
      endEnrollmentsDate: undefined,
      evaluationDate: undefined,
      deadlineDate: undefined,
      evaluators: undefined,
      projectsPerEvaluator: undefined,
      content: undefined
    },
    ui: {
      helpper0: false,
      helpper1: false,
      helpper2: false,
      helpper3: false,
      helpper4: false,
    },
    errors: [
      false, // 0 title
      false, // 1 creation date
      false, // 2 end of enrollments
      false, // 3 evaluation date
      false, // 4 dead line
      false, // 5 evaluator
      false, // 6 projects per evaluator
      false  // 7 content
    ]
  },
  methods: {
    send: function() {
      let i = 0, empty = false;
      for (let prop in this.announ) {
        if (this.announ[prop] === undefined) {
          this.errors[i] = true
          empty = true
        }i++
      }
      console.log(this)
      console.log(this.errors)
      if (!empty && this.errors.indexOf(true) === -1) {
        const url = 'http://127.0.0.1:3000/'
        window.axios
          .post(`${url}api/announcement/`, this.announ)
          .then(data => console.log(data))
          .catch(err => console.log(err))
      }
    },
    helpper: function(data) {
      for (let i = 0; i <= 4; i++)
        if (this.ui[`helpper${i}`] === true && data != i)
          this.ui[`helpper${i}`] = false
      this.ui[`helpper${data}`] = !this.ui[`helpper${data}`]
    }
  },
  watch: {
    'announ.evaluators': function(val) {
      if (!/^[0-9]+$/.test(val)) { this.errors[5] = true; return }
      this.errors[5] = val <= 1 || val <= this.announ.projectsPerEvaluator ? true : false
      this.errors[6] = this.errors[5] && this.announ.projectsPerEvaluator !== undefined
    },
    'announ.projectsPerEvaluator': function(val) {
      if (!/^[0-9]+$/.test(val)) { this.errors[6] = true; return }
      this.errors[6] = val >= this.announ.evaluators ? true : false
    },
    'announ.title': function(val) {
      this.errors[0] = val === "" ? true : false
    },
    'announ.creationDate': function(val) {
      this.errors[1] = false
      let props = ['endEnrollmentsDate','evaluationDate','deadlineDate']
      props.forEach((prop) => {
        if (this.announ[prop] !== undefined) {
          if (new Date(val) >= new Date(this.announ[prop])) {
            this.errors[1] = true
            return;
          }
        }
      })
    },
    'announ.endEnrollmentsDate': function(val) {
      this.errors[2] = false
      if (this.announ['creationDate'] !== undefined) {
        if (new Date(val) <= new Date(this.announ['creationDate'])) {
          this.errors[2] = true
          return;
        }
      }
      let props = ['evaluationDate','deadlineDate']
      props.forEach((prop) => {
        if (this.announ[prop] !== undefined) {
          if (new Date(val) >= new Date(this.announ[prop])) {
            this.errors[2] = true
            return;
          }
        }
      })
    },
    'announ.evaluationDate': function(val) {
      this.errors[3] = false
      if (this.announ['deadlineDate'] !== undefined) {
        if (new Date(val) >= new Date(this.announ['deadlineDate'])) {
          this.errors[3] = true
          return;
        }
      }
      let props = ['creationDate','endEnrollmentsDate']
      props.forEach((prop) => {
        if (this.announ[prop] !== undefined) {
          if (new Date(val) <= new Date(this.announ[prop])) {
            this.errors[3] = true
            return;
          }
        }
      })
    },
    'announ.deadlineDate': function(val) {
      this.errors[4] = false
      let props = ['creationDate','endEnrollmentsDate','evaluationDate']
      props.forEach((prop) => {
        if (this.announ[prop] !== undefined) {
          if (new Date(val) <= new Date(this.announ[prop])) {
            this.errors[4] = true
            return;
          }
        }
      })
    },
    'announ.content': function(val) {
      this.errors[7] = val === "" ? true : false
    }
  }
})