// import Vue from "vue";
const url = 'http://127.0.0.1:3000'
Date.prototype.toCostumeString = function () {
	const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
	return `${this.getDate()}/${months[this.getMonth()]}/${this.getFullYear()}`
}

const vm = new Vue({ 
  el: '#app',
  data: {
    announ: { },
    image: { },
    user: '',
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
      send: false,
      success: true
    },
    info: {
      evaluators: -1
    }
  },
  created: function() {
    window.axios.get(`${url}/api/announcement/${id}`)
      .then(res => {
        let today = new Date()
        today.setHours(0,0,0,0)
        for (let prop in res.data) {
          if (prop.includes('Date'))
            res.data[prop] = new Date(res.data[prop])
            this.ui.timeline.push(today >= res.data[prop])
            this.ui.timeline.push(today > res.data[prop])
          }
        this.announ = res.data
        document.title = res.data.title
      })
      .catch(err => console.log(err))

    window.axios.get(`${url}/api/evaluator/announcement/count/${window.id}`)
      .then(res => {
        if (res.data === this.announ.evaluators)
          this.ui.evaluatorsFull = true
        this.info.evaluators = res.data
      })
      .catch(err => console.log(err))
    
    window.axios.get(`${url}/api/announcement/image/${id}`)
      .then(({data}) => {
        this.image = data;
        this.image.src = `${url}/files/announcement/images/${data._id}.${data.extension}`
      })
      .catch(err => console.log(err))
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
      window.axios.get(`${url}/api/partaker/announcement/${window.id}/user/${id}`)
        .then(res => this.ui.enrolled = res.data !== null)
        .catch(err => console.log(err))
      window.axios.get(`${url}/api/evaluator/announcement/${window.id}/user/${id}`)
        .then(res => this.ui.enrolled = res.data !== null)
        .catch(err => console.log(err))
      this.user = id
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
        const vm = this
        let project = {
          idAnnouncement: window.id,
          idCreator: this.user,
        }
        window.axios.post(`${url}/api/project`, project)
          .then(res => {
            project = res.data
            console.log('project', project)
            const contestant = {
              idUser: project.idCreator,
              idProject: project._id,
              rol: 'Owner'
            }
            window.axios.post(`${url}/api/partaker/`, contestant)
              .then(res => {
                const user = res.data.idUser
                const notification = {
                  title: `${user.name.first + ' ' + user.name.last} envió solicitud de projecto para participar en ${vm.announ.title}.`,
                  url: `${url}/app/announcement/admin/${vm.announ._id}`
                }
                window.axios.post(`${url}/api/notification/${vm.announ.idCreator}`, notification)
                  .then(res => window.location.href = `${url}/app`)
                  .catch(err => console.log(err))
              })
              .catch(err => {
                console.log(err)
                window.axios.delete(`${url}/api/project/${project._id}`)
                  .then(res => {
                    console.log(res.data)
                    vm.ui.success = false
                    vm.ui.send = true
                  })
                  .catch(err => {
                    console.log(err)
                    vm.ui.success = false
                    vm.ui.send = true
                  })
              })
          })
          .catch(err  => {
            console.log(err)
            vm.ui.success = false
            vm.ui.send = true
          })
      } else {
        window.launchSignInModal()
      }
    },
    enrollAsEvaluator: function () {
      if (this.ui.session) {
        const evaluator = {
          idAnnouncement: window.id,
          idUser: this.user,
        }
        window.axios.post(`${url}/api/evaluator`,evaluator)
          .then(res => window.location.href = `${url}/app`)
          .catch(err => {
            console.log(err)
            vm.ui.success = false
            vm.ui.send = true
          })
      } else {
        window.launchSignInModal()
      }
    }
  }
})