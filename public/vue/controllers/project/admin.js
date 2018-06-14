const url = 'http://127.0.0.1:3000/' 
Vue.use(VueTables.ClientTable);
const emailMatch = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const vm = new Vue({
	el: '#partakers',
	data: {
		documents: [],
		partakers: [],
		columns: ['name', 'email', 'rol', 'options'],
		tabs: {
			projects: true,
			partakers: false,
			selected: 'projects'
		},
		table: {
			partakers: {
				columns: ['name', 'email', 'status', 'options'],
				options: {
					skin: 'table is-striped is-fullwidth is-hoverable',
					headings: {
						name: 'Nombre',
						email: 'Correo',
						rol: 'Rol',
						options: 'Eliminar'
					},
					sortable: ['name', 'rol'],
					filterable: ['name', 'email'],
					orderBy: {'column': 'rol'},
					preserveState: true,
					perPage: 5,
					perPageValues: [5,10,25],
					pagination: { nav: 'fixed', edge: true }
				}
			},
		},
		empty: {
			user: {
				_id: '',
				name: {
					first: '',
					last: ''
				},
				email: '',
				ocupation: '',
				education: '',
				bio: '',
			}
		},
		searchedEmail: '',
		badEmail: false,
		notFound: false,
		searchedUser: {},
		modal: {
			user: false
		},
	},
	created: function() {
		this.searchedUser = this.empty.user
		window.axios.get(`${url}api/partaker/project/${idProject}`)
			.then(({data}) => {
				console.log(data);
				let rows = [];
				for(let i = 0; i < data.length; i++) {
					let temp = {}
					temp.name = data[i].idUser.name.first + " " + data[i].idUser.name.last;
					temp.email = data[i].idUser.email;
					temp.rol = data[i].rol;
					temp.options = "Eliminar";
					temp.id = data[i]._id;
					rows.push(temp);
				}
				console.log(rows);
				this.partakers = rows;
			})

		window.axios.get(`${url}api/project/documents/${idProject}`)
			.then(({data}) => {
				this.documents = data;
				console.log(data);
			})
			.catch(err => {console.log(err.err);})
	},
	methods: {
		changeContent: function (page) {
			if (this.tabs[page] !== true) {
				this.tabs[this.tabs.selected] = false
				this.tabs[page] = true
				this.tabs.selected = page
			}
		},
		get: function(id) {
			return document.getElementById(id);
		},
		searchPartaker: function() {
			if(emailMatch.test(this.searchedEmail)) {
				window.axios.get(`${url}api/user/email/${this.searchedEmail}`)
					.then(({data}) => {
						if (data != null) {
							this.searchedUser = data;
							this.modal.user = true
						} else
							this.notFound = true
					})
					.catch(err => console.log(err))
			}
			else
				this.badEmail = true
		},
		addNewPartaker: function() {
			let id = this.get('btnAddPartaker').value;
			let partaker = {
				idProject: idProject,
				idUser: this.searchedUser._id,
				rol: 'Contestant'
			};
			window.axios.post(`${url}api/partaker/`, partaker)
				.then(({data}) => {
					let temp = {}
					temp.name = this.searchedUser.name.first + " " + this.searchedUser.name.last;
					temp.email = this.searchedUser.email;
					temp.rol = "Contestant";
					temp.options = "Eliminar";
					this.partakers.push(temp);
					this.modal.user = false				
				})
				.catch(err => console.log(err))
		},
		deletePartaker: function(row) {
			let index = row.index;
			let info = row.row;
			if(confirm(`¿Estás seguro que quieres eliminar a ${info.name} como integrante del proyecto?`)) {
				window.axios.delete(`${url}api/partaker/${info.id}`)
					.then(({data}) => {
						this.partakers = this.partakers.filter(e => e.id != info.id);
						console.log("Eliminado")
					})
					.catch(err => console.log(err))
			}
		},
		uploadFile: function() {
			let docs = this.get('docs');
			console.log("upload");
			if(docs.files.length != 0) {
	        let formData = new FormData()

	        console.log(docs.files);
	        formData.append('document', docs.files[0])

	        const config = { headers: { 'content-type': 'multipart/form-data' } }
	        window.axios.post(`${url}api/project/documents/${idProject}`, formData, config)
	          .then(({data}) => {
	          	this.documents.push(data);
	          	console.log(data);
	          })
	          .catch(err => console.log(err))
		    }
		    else
		    {
		      console.log(res.data); 
		    }
		},
		deleteFile: function(doc) {
			if(confirm(`¿Estás seguro que quieres eliminar el docuemento "${doc.name}" del proyecto?`)) {
				window.axios.delete(`${url}api/project/document/${doc._id}`)
					.then(({data}) => {
						this.documents = this.documents.filter(e => e._id != doc._id);
						console.log("Eliminado");
						console.log(data);
					})
					.catch(err => console.log(err))
			}
		}
	}
})
