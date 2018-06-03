const url = 'http://127.0.0.1:3000/' 
Vue.use(VueTables.ClientTable);
const emailMatch = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const vm = new Vue({
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