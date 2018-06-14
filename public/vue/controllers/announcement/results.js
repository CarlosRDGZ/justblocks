const url = 'http://127.0.0.1:3000/'
Vue.use(VueTables.ClientTable, theme="bulma");
 
let vm = new Vue({ 
  el: "#winners",
  data: {
    columns: ['title', 'mean', 'adjustedMean', 'group', 'creator'],
    data: {
      winners: [],
      rest: []
    },
    options: {
      headings: {
        title: 'Título',
        mean: 'Promedio',
        adjustedMean: 'Promedio ajustado',
        group: "Grupo",
        creator: "Creador"
      },
      sortable: ['title', 'mean', 'adjustedMean', 'group', 'creator'],
      filterable: ['title', 'grade', 'creator'],
      columnsClasses: {mean: 'has-text-centered'},
    	orderBy: {'column': 'group'}
    }
  },
  created: function() {
  	window.axios.get(`${url}api/project/winners/${idAnnoun}`)
  		.then(({data}) => {
        let rows = [];
        let restRows = [];
        for(let i = 0; i < data.length - 1; i++) {
          for(let j = 0; j < data[i].length; j++) { 
            let temp = {};
            temp.title = data[i][j].title;
            temp.mean = this.round(data[i][j].mean, 4);
            temp.adjustedMean = data[i][j].adjustedGrade;
            temp.group = data[i][j].group;
            temp.creator = data[i][j].idCreator.name.first + " " + data[i][j].idCreator.name.last;

            rows.push(temp);
          }
        }

        let rest = data[data.length - 1];
        for(let j = 0; j < rest.length; j++) { 
          let temp = {};
          temp.title = rest[j].title;
          temp.mean = rest[j].mean;
          temp.adjustedMean = rest[j].adjustedGrade;
          temp.group = rest[j].group;
          temp.creator = rest[j].idCreator.name.first + " " + rest[j].idCreator.name.last;

          restRows.push(temp);
        }

        this.data.winners = rows;
        this.data.rest = restRows;
      })  
  		.catch(err => {console.log(err.err);})
  },
  methods: {
    round: function(num, decimals) {
      let toRound = parseFloat(num);
      return Math.round(toRound * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }
  }
});
