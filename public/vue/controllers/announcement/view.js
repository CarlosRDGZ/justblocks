// import Vue from "vue";
const url = 'http://127.0.0.1:3000/'

const vm = new Vue({ 
  el: '#app',
  data: {
    announ: { },
    ui: {
      today: new Date(),
      timeline: [],
      content: {
        overview: true,
        contestant: false,
        evaluator: false,
        selected: 'overview'
      },
      evaluatorsFull: false,
      session: false,
      enrolled: false,
    }
  },
  created: function() {
    window.axios.get(`${url}api/announcement/${id}`)
      .then(res => {
        let today = new Date()
        today.setHours(0,0,0,0)
        for (let prop in res.data)
          if (prop.includes('Date')) {
            res.data[prop] = new Date(res.data[prop])
            this.ui.timeline.push(today >= res.data[prop])
            this.ui.timeline.push(today > res.data[prop])
          }
        this.announ = res.data
        document.title = res.data.title
      })
    window.axios.get(`${url}api/partaker/count/Evaluator`)
      .then(res => {
        if (res.data === this.announ.evaluators)
          this.ui.evaluatorsFull = true
      })
  },
  beforeMount: function () {
    this.ui.session = document.cookie.indexOf('session') !== -1 ? true : false
  },
  mounted: function () {
    if (this.ui.session) {
      let start = document.cookie.indexOf('session')
      let indexSemicolon = document.cookie.indexOf(';')
      let length = indexSemicolon === -1 ? document.cookie.length : indexSemicolon - start
      let id = document.cookie.slice(start,length).split('=')[1]
      window.axios.get(`${url}api/partaker/user/${id}`)
        .then(res => this.ui.enrolled = res.data == null ? false : true)
    }
  },
  methods: {
    changeContent: function (page) {
      if (this.ui.content[page] !== true) {
        this.ui.content[this.ui.content.selected] = false
        this.ui.content[page] = true
        this.ui.content.selected = page
      }
    },
    enrollAsContestant: function () {
      if (this.ui.session) {
        let start = document.cookie.indexOf('session')
        let indexSemicolon = document.cookie.indexOf(';')
        let length = indexSemicolon === -1 ? document.cookie.length : indexSemicolon - start
        let user = document.cookie.slice(start,length).split('=')[1]
        let project = {
          idAnnouncement: window.id,
          idCreator: user,
        }
        window.axios.post(`${url}api/project`, project)
          .then(res => {
            project = res.data
            console.log('project', project)
            let contestant = {
              idUser: user,
              idProject: project._id,
              rol: 'Contestant'
            }
            console.log(contestant)
            window.axios.post(`${url}api/partaker`, contestant)
              .then(res => location.href = `${url}app`)
              .catch(err => {
                console.log(err)
                window.axios.delete(`${url}api/delete/${project._id}`)
                  .then(res => console.log(res.data))
                  .catch(err => console.log(err))
              })
          })
      } else {
        window.launchSignInModal()
      }
    },
    enrollAsEvaluator: function () {
      if (this.ui.session) {
        
        window.axios.post(`${url}api/partaker`,)
      } else {
        window.launchSignInModal()
      }
    }
  }
})