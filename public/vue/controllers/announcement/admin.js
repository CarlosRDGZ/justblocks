const url = 'http://127.0.0.1:3000/'

const vm = new Vue({
  el: '#app',
  data: {
    announ: {
      title: undefined,
      author: undefined,
      creationDate: undefined,
      endEnrollmentsDate: undefined,
      evaluationDate: undefined,
      deadlineDate: undefined,
      evaluators: undefined,
      image: undefined,
      projectsPerEvaluator: undefined,
      content: undefined,
      prize: undefined,
    },
    ui: {
      today: new Date().toISOString().split('T')[0],
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
  beforeCreate: function () {
    window.axios.get(`${url}api/announcement/${id}`)
      .then(res => {
        let today = new Date()
        today.setHours(0,0,0,0)
        for (let prop in res.data)
          if (prop.includes('Date')) {
            // ISO String YYYY-MM-DDT00:00:00.000Z"
            res.data[prop] = new Date(res.data[prop]).toISOString().split('T')[0]
          }
        this.announ = res.data
        document.title = res.data.title
        get('content').textContent = res.data.content
        get('prize').textContent = res.data.prize
      })
      .catch(err => console.log(err))
  },
  mounted: function () {
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
    this.mountEditor('content', config)
      .then(res => CKEDITOR.instances.content.editable().setHtml(get('content').textContent))
      .catch(err => console.log(err))
    this.mountEditor('prize', config)
      .then(res => CKEDITOR.instances.content.editable().setHtml(get('prize').textContent))
      .catch(err => console.log(err))

    // Input file upload
  },
  methods: {
    send: function () {
      this.announ.content = CKEDITOR.instances.content.getData()
      this.announ.prize = CKEDITOR.instances.prize.getData()
      let i = 0, empty = false;
      for (let prop in this.announ) {
        if (this.announ[prop] === undefined) {
          this.errors[i] = true
          empty = true
        }i++
      }
      if (!empty && this.errors.indexOf(true) === -1) {
        const url = 'http://127.0.0.1:3000/'
        window.axios
          .put(`${url}api/announcement/`, this.announ)
          .then(res => console.log(res.data))
          .catch(err => console.log(err))
      }
    },
    helpper: function(data) {
      for (let i = 0; i <= 4; i++)
        if (this.ui[`helpper${i}`] === true && data != i)
          this.ui[`helpper${i}`] = false
      this.ui[`helpper${data}`] = !this.ui[`helpper${data}`]
    },
    /** @param {String} editor*/
    mountEditor: function (editor, config) {
      return new Promise((resolve,reject) => {
        CKEDITOR.replace(editor, config)
        if (CKEDITOR.instances[editor].editable !== undefined)
          resolve(true)
        else
          reject(new Error('Error'))
      })
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
        announ.image = e.target.result
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

function get(id) {return document.getElementById(id);}
/*
const creaDate = get('creationDate');
const enrollDate = get('endEnrollmentsDate');
const evaDate = get('evaluationDate');
const deadDate = get('deadlineDate');
const image = get('image');
const today = new Date();
*/

function getImage(announ) {
  window.axios.get('/api/announcement/image/' + announ._id)
    .then(({data}) => {
      announ.image = data;
      let path = '/files/announcement/images/' + data['_id'] + "." + data['extension'];
      image.src = path;
      console.log(data);
      console.log(path);
    })
    .catch(({err}) => { console.log("Err: " + err);})
}
/**
window.onload = () => {
  announcement.endEnrollmentsDate =new Date(announcement.endEnrollmentsDate);
  announcement.creationDate = new Date(announcement.creationDate);
  announcement.evaluationDate = new Date(announcement.evaluationDate);
  announcement.deadlineDate = new Date(announcement.deadlineDate);

  if(announcement.endEnrollmentsDate < today) {
    enrollDate.setAttribute('readonly', true); 
    // enrollDate.readOnly = true; 
  }
  if(announcement.evaluationDate < today) {
    evaDate.setAttribute('readonly', 'true');
  }
  if(announcement.deadlineDate < today) {
    deadDate.setAttribute('readonly', 'true');
  }
  getImage(announcement);

  announcement.creationDate = announcement.creationDate.toISOString().substring(0, 10);
  announcement.endEnrollmentsDate = announcement.endEnrollmentsDate.toISOString().substring(0, 10);
  announcement.evaluationDate = announcement.evaluationDate.toISOString().substring(0, 10);
  announcement.deadlineDate = announcement.deadlineDate.toISOString().substring(0, 10);   

  // CKEDITOR.instances.content.editable().setHtml(announcement.content);
  // CKEDITOR.instances.prize.editable().setHtml(announcement.prize);

  vm.$data.announ = announcement;
}

if (prop.includes('Date')) {
            // ISO String YYYY-MM-DDT00:00:00.000Z"
            res.data[prop] = new Date(res.data[prop]).toISOString().split('T')[0]
          }
*/