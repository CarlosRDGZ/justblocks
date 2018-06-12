const url = 'http://127.0.0.1:3000'
Date.prototype.toCostumeString = function () {
	const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
	return `${this.getDate()}/${months[this.getMonth()]}/${this.getFullYear()}`
}

Vue.use(VueTables.ClientTable, theme = 'bulma')
var vm = new Vue({
  el: '#app',
  data: {
		announs: [],
		projects: [],
		tabs: {
			announs: true,
			projects: false,
			selected: 'announs'
		},
		table: {
			announs: {
				columns: ['title', 'creationDate', 'deadlineDate', 'options'],
				options: {
					headings: {
						title: 'Título',
						creationDate: 'Inicio',
						deadlineDate: 'Fin',
						options: 'Opciones'
					},
					skin: 'table is-striped is-fullwidth is-hoverable',
					sortable: ['title', 'creationDate', 'deadlineDate'],
					filterable: ['title', 'creationDate', 'deadlineDate'],
					orderBy: {'column': 'deadlineDate'},
					perPage: 5,
					perPageValues: [5,10,25],
					preserveState: true,
					pagination: {
						nav: 'fixed',
						edge: true
					}
				}
			},
			projects: {
				columns: ['title', 'description', 'options'],
				options: {
					headings: {
						title: 'Título',
						description: 'Descripción',
						options: 'Opciones'
					},
					skin: 'table is-striped is-fullwidth is-hoverable',
					sortable: ['title', 'description'],
					filterable: ['title', 'description'],
					orderBy: {'column': 'title'},
					perPage: 5,
					perPageValues: [5,10,25],
					preserveState: true,
					pagination: {
						nav: 'fixed',
						edge: true
					}
				}
			}
		}
	},
	created: function () {
		const vm = this
		window.axios.get(`${url}/api/announcement/user/${id}`)
			.then(({data}) => setAnnounDates(data).then(res => vm.announs = res))
			.catch(err => console.log(err))
		window.axios.get(`${url}/api/project/user/${id}`)
		.then(({ data }) => this.projects = data)
	},
	methods: {
		changeContent: function (page) {
			if (this.tabs[page] !== true) {
				this.tabs[this.tabs.selected] = false
				this.tabs[page] = true
				this.tabs.selected = page
			}
		}
	}
})

const setAnnounDates = (data) => {
	return new Promise(resolve => {
		data.forEach(e => {
			e.partakers = 0
			getProjectsByAnnoun(e._id, data);
			e.creationDate = new Date(e.creationDate)
			e.endEnrollmentsDate = new Date(e.endEnrollmentsDate)
			e.evaluationDate = new Date(e.evaluationDate)
			e.deadlineDate = new Date(e.deadlineDate)
			window.date = new Date(e.creationDate)
		})
		resolve(data)
	})
}

function getUserName(id, object) {
	window.axios.get('/api/user/' + id + '/name')
		.then(({data}) => {
			name = data[0].name.first + " " + data[0].name.last;
			object.userName = "Convoca: " + name;
		})
		.catch(({err}) => { console.log(err);})
}

function getProjectsByAnnoun(id, object) {
	window.axios.get('/api/project/countProjects/' + id)
		.then(({data}) => {
			object.partakers = data.projects;
		})
		.catch((err) => { console.log(err);})
}

/*
Como ahora se muestran en tablas ya no se necesitan las imágenes en esta vista
function getImage(id, object) {
	window.axios.get('/api/announcement/image/' + id)
		.then(({data}) => {
			object.image = data;
			console.log(data);
		})
		.catch(({err}) => { console.log(err);})
}*/
/*
window.onload = () => {
	window.axios.get('/api/announcement/user')
		.then(({data}) => {
			//Si no establecemos esta propiedad así no lo actualiza cuando carga la página
			for(var i = 0; i < data.length; i++) {
				// data[i].userName = "";
				// data[i].image = "";
				data[i].partakers = 0;
			}

			data.forEach((announ) => {
				getProjectsByAnnoun(announ._id, data);
				announ.endEnrollmentsDate = announ.endEnrollmentsDate != undefined ? announ.endEnrollmentsDate.substring(0, 10) : 'NA';
				announ.evaluationDate = announ.evaluationDate != undefined ? announ.evaluationDate.substring(0, 10) : 'NA';
				announ.deadlineDate = announ.deadlineDate != undefined ? announ.deadlineDate.substring(0, 10) : 'NA';
			})
			vm.$data.announs = data;
		})
}
*/