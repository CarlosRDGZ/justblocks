const url = 'http://127.0.0.1:3000'
const emailMatch = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
Vue.use(VueTables.ClientTable, theme = 'bulma');

const vm = new Vue({
	el: '#app',
	data: {
		evaluators: [],
		projects: [],
		empty: {
			project: {
				_id: '',
				__v: '',
				mean: '',
				title: '',
				group: '',
				status: '',
				description:'',
				adjustedGrade: '',
				idAnnouncement: '',
				idCreator: {
					_id:'',
					email:'',
					name: {
						first:'',
						last:''
					},
					fullName: () => ''
				}
			}
		},
		tabs: {
			projects: true,
			evaluators: false,
			selected: 'projects'
		},
		modal: {
			project: {
				active: false,
				info: { }
			}
		},
		table: {
			evaluators: {
				columns: ['name', 'email', 'status', 'options'],
				options: {
					skin: 'table is-striped is-fullwidth is-hoverable',
					headings: {
						name: 'Nombre',
						email: 'Correo',
						status: 'Estatus',
						options: 'Opciones'
					},
					sortable: ['name', 'email', 'status'],
					filterable: ['name', 'email'],
					orderBy: {'column': 'status'},
					preserveState: true,
					perPage: 5,
					perPageValues: [5,10,25],
					pagination: { nav: 'fixed', edge: true }
				}
			},
			projects: {
				columns: ['title', 'idCreator', 'status', 'options'],
				options: {
					headings: {
						title: 'Título',
						idCreator: 'Creador',
						status: 'Estatus',
						options: 'Opciones'
					},
					sortable: ['title', 'idCreator', 'status'],
					filterable: ['title'],
					orderBy: {'column': 'status'},
					skin: 'table is-striped is-fullwidth is-hoverable',
					preserveState: true,
					perPage: 5,
					perPageValues: [5,10,25],
					pagination: { nav: 'fixed', edge: true }
				}
			}
		}
	},
	methods: {
		changeContent: function (page) {
			if (this.tabs[page] !== true) {
				this.tabs[this.tabs.selected] = false
				this.tabs[page] = true
				this.tabs.selected = page
			}
		},
		updateStatus: function (id, status, target) {
			window.axios.put(`${url}/api/${target}/status/${id}`, { status: status })
				.then(({data}) => {
					let index = this[`${target}s`].findIndex(e => e._id === data._id)
					data[target === 'project' ? 'idCreator' : 'idUser'].fullName = function () { return this.name.first + ' ' + this.name.last }
					if (status === 1)
						this[`${target}s`].splice(index,1,data)
					else 
						this[`${target}s`].splice(index,1)
					console.log(data)
				})
				.catch(err => console.log(err))
		},
		modalProject: function (project, show) {
			this.modal.project.active = show
			this.modal.project.info = project
		}
	},
	created: function () {
		this.modal.project.info = this.empty.project
		window.axios.get(`${url}/api/project/announcement/${idAnnoun}`)
			.then(({data}) => {
				this.projects = data.map(p => {
					p.idCreator.fullName = function () { return this.name.first + ' ' + this.name.last }
					return p
				})
			})
			.catch(err => console.log(err))
		window.axios.get(`${url}/api/evaluator/announcement/${idAnnoun}`)
			.then(res => {
				this.evaluators = res.data.map(e => {
					e.idUser.fullName = function() { return this.name.first + ' ' + this.name.last }
					return e
				})
			})
	}
})

/*
const vm2 = new Vue({
	el: '#evaluators',
	data: {
		columns: ['name', 'email', 'status', 'education'],
		evaluators: [],
		url: 'http://127.0.0.1:3000/', 
		options: {
			headings: {
				name: 'Nombre',
				email: 'Correo',
				status: 'Estatus',
				education: 'Educación'
			},
			sortable: ['name', 'email', 'status'],
			filterable: ['name', 'email'],
			orderBy: {'column': 'status'}
		},
	},
	created: function() {
		window.axios.get(`${url}api/evaluator/announcement/${idAnnoun}`)
			.then(({data}) => {
				console.log(data);
				data.forEach((eval) => {
					let temp = {}
					temp.idEval = eval._id;
					temp.idUser = eval.idUser._id;
					temp.name = `${eval.idUser.name.first} ${eval.idUser.name.last}`;
					temp.email = eval.idUser.email;
					temp.education = eval.idUser.education;
					temp.status = eval.status;
					console.log(temp);

					this.evaluators.push(temp);
				})
			})
			.catch(err => console.log(err))
	}
})

const vm2 = new Vue({
	el: '#projects',
	data: {
		columns: ['title', 'status'],
		projects: [],
		url: 'http://127.0.0.1:3000/', 
		options: {
			headings: {
				title: 'Título',
				status: 'Estatus'
			},
			sortable: ['title', 'status'],
			filterable: ['title'],
			orderBy: {'column': 'status'}
		},
	},
	created: function() {
		window.axios.get(`${url}api/project/announcement/${idAnnoun}`)
			.then(({data}) => {
				console.log(data);
				this.projects = data;
			})
			.catch(err => console.log(err))
	}
})
*/