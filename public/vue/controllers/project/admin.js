const url = 'http://127.0.0.1:3000/'
Vue.use(VueTables.ClientTable);
const emailMatch = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const vm = new Vue({
	el: '#partakers',
	data: {
		columns: ['name', 'email', 'rol', 'options'],
		data: {
			partakers: []
		},
		options: {
			headings: {
				name: 'Nombre',
				email: 'Correo',
				rol: 'Rol',
				options: 'Opciones'
			},
			sortable: ['name', 'rol'],
			filterable: ['name', 'email'],
			orderBy: {'column': 'rol'}
		},
		searchedUser: {}
	},
	created: function() {
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
					rows.push(temp);
				}
				console.log(rows);
				this.data.partakers = rows;
			})

		window.axios.get(`${url}api/project/documents/${idProject}`)
			.then(({data}) => {
				let documents = document.getElementById('documents');
				docs = data;
				console.log(data);
				data.forEach( function(doc) {
					let a = document.createElement("a");
					let row = document.createElement("tr");
					a.setAttribute("href", `${url}/files/projects/${doc._id}.${doc.extension}`);
					a.download = `${doc.name}.${doc.extension}`;
					a.text = doc.name;

					row.appendChild(a);
					documents.appendChild(row);
				});
			})
			.catch(err => {console.log(err.err);})
	},
	methods: {
		get: function(id) {
			return document.getElementById(id);
		},
		searchPartaker: function() {
			let txtSearch = this.get('searchMail');
			if(emailMatch.test(txtSearch.value)) {
				window.axios.get(`${url}api/user/email/${txtSearch.value}`)
					.then(({data}) => {
						this.searchedUser = data;
						console.log(data);
						this.get('result').removeAttribute('hidden');
						this.get('result').innerHTML = data.name.first + " " + data.name.last;
						this.get('question').removeAttribute('hidden');
						this.get('btnAddPartaker').removeAttribute('hidden');						
						this.get('btnAddPartaker').value = data._id;
					})
					.catch(err => console.log(err))
			}
			else {
				console.log("Correo incorrecto");
				txtSearch.style.border = 'background:red;'
			}
		},
		addNewPartaker: function() {
			let id = this.get('btnAddPartaker').value;
			let partaker = {
				idProject: idProject,
				idUser: id,
				rol: 'Contestant'
			};
			window.axios.post(`${url}api/partaker/`, partaker)
				.then(({data}) => {
					console.log(data);
					console.log(this.searchedUser);
					let temp = {}
					temp.name = this.searchedUser.name.first + " " + this.searchedUser.name.last;
					temp.email = this.searchedUser.email;
					temp.rol = "Contestant";
					temp.options = "Eliminar";

					this.data.partakers.push(temp);
				})
				.catch(err => console.log(err))
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
            console.log(data);
            let documents = this.get('documents');
            console.log(documents)
          	let a = document.createElement("a");
          	let row = document.createElement("tr");
          	a.setAttribute("href", `${url}/files/projects/${data._id}.${data.extension}`);
          	a.download = `${data.name}.${data.extension}`;
          	a.text = data.name;

          	row.appendChild(a);
          	documents.appendChild(row);
          })
          .catch(err => console.log(err))
      }
      else
      {
        console.log(res.data); 
      }
		}
	}
})