const url = 'http://localhost:3000/';

const vm = new Vue({
	el: "#app2",
	data: {
		evaluators: [],
		projectsPerEvaluator: [],
		isComplete: true, //Todos los proyectos ya fueron evaluados, ya se pueden calcular los promedios y las calificaciones ajustadas
		isNormalMean: false,	//Ya se calificaron los promedios normales
		isAdjustedGrades: false,	//Ya se calificaron las califiacaciones ajustadas con el modelo
	},
	created() {
		window.axios.get(`${url}api/evaluator/announcement/asignedProject/${idAnnoun}`)
			.then(({data}) => {	
				console.log(data);
				if(data.allEvaluatorProjects[0].length == 0)
					this.isComplete = false;

				for (var i = data.allEvaluatorProjects.length - 1; i >= 0; i--) {
					for (var j = data.allEvaluatorProjects[i].length - 1; j >= 0; j--) {
						if(data.allEvaluatorProjects[i][j].grade < 0) { //Falta por lo menos una proyecto por evaluar
							// this.isComplete = false;
							break;
						}
						else if(data.allEvaluatorProjects[i][j].idProject.mean > -1) {
							this.isNormalMean = true;
							if(data.allEvaluatorProjects[i][j].idProject.adjustedGrade > -1) {
								this.isAdjustedGrade = true;
								window.location = `${url}announcement/results/${idAnnoun}`; //Ya están listos los resultados
							}
							break;
						}
					}
					if(!this.isComplete || this.isNormalMean)
						break;		
				}

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
		},
		calculateAdjustedGrades: function() {
			window.axios.get(`${url}api/project/adjustedGrades/${idAnnoun}`)
				.then(({data}) => {
					console.log(data);
					window.location = `${url}app/announcement/projectsPerEvaluator/${idAnnoun}`;
				})
				.catch(err => {console.log(err);})
		},
		calculateNormalMeans: function() {
			window.axios.get(`${url}api/project/calculateNormalMean/${idAnnoun}`)
				.then(({data}) => {
					console.log(data);
					window.location = `${url}app/announcement/projectsPerEvaluator/${idAnnoun}`;
				})
				.catch(err => {console.log(err);})
		}
	}
})