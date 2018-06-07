const url = 'http://127.0.0.1:3000/'

const vm = new Vue({
  el: '#app',
  data: {
    project: { },
    owner: { }
  },
  created: function () {
    window.axios.get(`${url}api/project/${id}`)
      .then(({data}) => {
        this.project = data
        window.axios.get(`${url}api/user/${this.project.idCreator}`)
          .then(({data}) => this.owner = data)
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }
})