const url = 'http://localhost:3000/';

const vm = new Vue({
	el: "#app2",
	data: {
		evaluators: [],
		projectsPerEvaluator: []
	},
	created() {
		window.axios.get(`${url}api/evaluator/announcement/asignedProject/${idAnnoun}`)
			.then(({data}) => {	
				console.log(data);
				this.evaluators = data.evaluators;
				this.projectsPerEvaluator = data.allEvaluatorProjects;
			})
			.catch(err => {console.log(err);})
	},
	methods: {
		get: function(id){
			return document.getElementById(id);
		},
		sendReminder: function(index) {
			window.axios.post(`${url}api/notification/${this.evaluators[index].idUser._id}`, 
				{title: `Recuerda evaluar los proyectos para la convocatoria "${announTitle}"`, url: `${url}announcement/view/evaluator/${idAnnoun}`})
				.then(({data}) => {
					console.log(data);
					alert('Recordatorio enviado');
					this.get(this.evaluators[index]._id).style.visibility = 'hidden';
				})
				.catch(err => {console.log(err);})
		}
	}
})