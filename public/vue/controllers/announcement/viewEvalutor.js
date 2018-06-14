const url = 'http://127.0.0.1:3000/'
Vue.use(VueTables.ClientTable, theme = 'bulma')
const vm = new Vue({
  el: "#app",
  data: {
    columns: ['title', 'description', 'grade'],
    data: [],
    options: {
      skin: 'table is-striped is-fullwidth is-hoverable',
      headings: {
        title: 'Título',
        description: 'Descripción',
        grade: 'Calificación'
      },
      sortable: ['title', 'grade'],
      filterable: ['title', 'grade'],
    	orderBy: 'grade',
    	preserveState: true,
			perPage: 5,
			perPageValues: [5,10,25],
			pagination: { nav: 'fixed', edge: true }
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
  				temp.grade = project.grade > 0 ? project.grade : "Sin evaluación";
          // temp.projectUri = `${url}api/project/${project.idProject._id}`;
  				temp.projectUri = `${url}announcement/view/qualify/project/${project.idProject._id}`;

  				rows.push(temp);
  			});
  			this.data = rows;
  		})	
  		.catch(err => {console.log(err.err);})
  }
});