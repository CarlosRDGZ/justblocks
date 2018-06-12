const url = 'http://localhost:3000/';
const today = new Date();
const vm = new Vue({
	el: '#app',
	data: {
		possibleK: [],
		possibleR: [],
		projects: 0,
		evaluators: 0,
		kSelected: 0,
		rSelected: 0
	},
	created: function() {
		window.axios.get(`${url}api/announcement/possibleRsAndKs/${idAnnoun}`)
			.then(({data}) => {
				console.log(data);
				console.log(data.possibleR);
				this.possibleK = data.possibleK;
				this.possibleR = data.possibleR;
				this.projects = data.projects;
				this.evaluators = data.evaluators;
			})
			.catch(err => {console.log(err);})
	},
	methods: {
		updateR: function() {
			this.rSelected = this.kSelected;
		},
		setK: function() {
			if(confirm(`¿Estás seguro que quieres que los evaluadores evalúen ${this.possibleK[this.kSelected]} proyectos cada uno?`)) {
				window.axios.post(`${url}api/announcement/setKandR/${idAnnoun}`, {k: this.possibleK[this.kSelected], r: this.possibleR[this.rSelected] })
					.then(({data}) => {
						console.log(data);
						window.location = `${url}app/announcement/projectsPerEvaluator/${idAnnoun}`;
					})
					.catch(err => {console.log(err);})
			}
		},
		traditionalWay: function() {
			window.axios.post(`${url}api/announcement/setTraditionalMethod/${idAnnoun}`)
				.then(({data}) => {
					console.log(data);
					window.location = `${url}app/announcement/projectsPerEvaluator/${idAnnoun}`;
				})
				.catch(err => {console.log(err);})
		}
	}
})