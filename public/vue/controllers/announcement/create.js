const url = 'http://127.0.0.1:3000/'
const get = id => document.getElementById(id)
const vm = new Vue({
  el: '#app',
  data: {
    announ: {
      // title: undefined,
      title: 'Puppy Bowl',
      //creationDate: undefined,
      creationDate: '2018-05-27',
      // endEnrollmentsDate: undefined,
      endEnrollmentsDate: '2018-05-28',
      // evaluationDate: undefined,
      evaluationDate: '2018-05-29',
      // deadlineDate: undefined,
      deadlineDate: '2018-05-30',
      // evaluators: undefined,
      evaluators: '2',
      // projectsPerEvaluator: undefined,
      projectsPerEvaluator: '1',
      author: undefined,

      image: undefined,
      _image: undefined,
      content: undefined,
      prize: undefined,
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
      false, // 7 author
    ]
  },
  mounted: function() { 
    let config = {
      language: 'es',
      extraplugins: '',
      toolbar: [
        ['Undo', 'Redo'],
        ['Cut', 'Copy', 'Paste'],
        ['Scayt'],
        ['Link', 'Unlink'],
        ['Bold', 'Italic', 'Strike'],
        ['NumberedList', 'BulletedList','-','Outdent','Indent','-','Blockquote'],
        ['Styles', 'Format']
      ]
    }
    this.announ._image = `${url}images/Porg.png`
    CKEDITOR.replace('content', config)
    CKEDITOR.replace('prize', config)
  },
  methods: {
    send: function() {
      this.announ.content = CKEDITOR.instances.content.getData()
      // console.log("DATA: " + CKEDITOR.instances.content.getData());
      this.announ.prize = CKEDITOR.instances.prize.getData()
      let i = 0, empty = false;
      for (let prop in this.announ) {
        console.log(prop)
        if (this.announ[prop] === undefined) {
          console.log(i)
          this.errors[i] = true
          empty = true
        }i++
        if (i === 8) break;
      }
      console.log('empty',empty)
      console.log('errors',this.errors.indexOf(true))
      if (!empty && this.errors.indexOf(true) === -1) {
        const url = 'http://127.0.0.1:3000/'
        console.log(this.announ);
        window.axios
          .post(`${url}api/announcement/`, this.announ)
          .then(res => {
              let id = res.data['_id'];
              if(file.files.length != 0) {
                let formData = new FormData()
                let image = get('file').files[0]
                formData.append('image', image, image.name)
                window.axios.post(`/api/announcement/image/${id}`, formData, { headers: { 'content-type': 'multipart/form-data' } })
                  .then(({data}) => {
                    console.log("DENTRO");
                    console.log(data);
                    window.location = `/announcement/view/${id}`
                  })
                  .catch(err => console.log(err))
              } else {
                console.log(res.data); 
                window.location = `/announcement/view/${id}`
              }
            })
          .catch(err => console.log(err))
      }
    },
    helpper: function(data) {
      for (let i = 0; i <= 4; i++)
        if (this.ui[`helpper${i}`] === true && data != i)
          this.ui[`helpper${i}`] = false
      this.ui[`helpper${data}`] = !this.ui[`helpper${data}`]
    },
    updateImage: function () {
      let fileUpload = get('file')
      fileUpload.multiple = false
      fileUpload.click()
    },
    readURL: function () {
      let input = get('file')
      let reader = new FileReader()
      let announ = this.announ
      reader.onload = function (e) {
        announ._image = e.target.result
      }
      reader.readAsDataURL(input.files[0])
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
    'announ.author': function(val) {
      this.errors[7] = val === "" ? true : false
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
  }
})