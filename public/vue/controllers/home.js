var vm = new Vue({
    el: '#app',
    data: {
        title: 'Mis convocatorias',
        myAnnouns: [],
    }
})

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
		.catch(({err}) => { console.log(err);})
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
			vm.$data.myAnnouns = data;
		})
}

