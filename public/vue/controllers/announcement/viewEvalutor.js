const url = 'http://127.0.0.1:3000/'
Vue.use(VueTables.ClientTable);

let vm = new Vue({
  el: "#app",
  data: {
    columns: ['title', 'description', 'grade'],
    data: [],
    options: {
      headings: {
        title: 'Título',
        description: 'Descripción',
        grade: 'Calificación'
      },
      sortable: ['title', 'grade'],
      filterable: ['title', 'grade'],
    	orderBy: 'grade',
    	perPage: 10
    }
  },
  created: function() {
  	window.axios.get(`${url}api/evaluator/${idEvaluator}/projects`)
  		.then(({data}) => {
  			let rows = []
  			console.log(data);
  			data.forEach( function(project) {
  				let temp = {};
  				temp.title = project.idProject.title;
  				temp.description = project.idProject.description;
  				temp.grade = project.grade;
  				temp.projectUri = `${url}api/project/${project.idProject._id}`

  				rows.push(temp);
  			});
  			this.data = rows;
  		})	
  		.catch(err => {console.log(err.err);})
  }
});