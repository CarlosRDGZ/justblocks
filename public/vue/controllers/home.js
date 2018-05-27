let getDate = date => date != undefined ? date.substring(0,10) : 'NA'

let Table = () => {
	return {
			pagination: {
			current: 0,
			pags: 0,
			itemsPerPage: 10,
			shown: {
				first: -1,
				last: -1,
				pages: []
			}
		},
		data: [],
		index: {
			top: -1,
			bottom: -1
		}
	}
}

let pagination = (table,data) => {
	return {
		previous: function() {
			if (table.pagination.current > 1) {
				table.pagination.current--
				table.data = 
					data.slice(table.index.top -= table.pagination.itemsPerPage, table.index.bottom -= table.pagination.itemsPerPage)
				if (table.pagination.current < table.pagination.shown.first){
					table.pagination.shown.pages.unshift(table.pagination.current)
					table.pagination.shown.pages = table.pagination.shown.pages.slice(0,table.pagination.shown.pages.length-1)
					table.pagination.shown.first--
					table.pagination.shown.last--
				}
			}
		},
		next: function() {
			if (table.pagination.current < table.pagination.pags) {
				table.pagination.current++
				table.data = 
					data.slice(table.index.top += table.pagination.itemsPerPage, table.index.bottom += table.pagination.itemsPerPage)
				if (table.pagination.current > table.pagination.shown.last){
					table.pagination.shown.pages.push(table.pagination.current)
					table.pagination.shown.pages = table.pagination.shown.pages.slice(1)
					table.pagination.shown.first++
					table.pagination.shown.last++
				}
			}
		},
		goto: function(page) {
			table.pagination.current = page
			table.index.top = (table.pagination.itemsPerPage * page) - table.pagination.itemsPerPage
			table.index.bottom = table.pagination.itemsPerPage * page
			table.data =
				data.slice(table.index.top, table.index.bottom)
		},
		first: function() {
			table.pagination.shown.first = 1
			table.pagination.shown.last = 5
			table.pagination.shown.pages = []
			for (let i = table.pagination.shown.first; i <= table.pagination.shown.last; i++)
				table.pagination.shown.pages.push(i)
				this.goto(1)
		},
		last: function() {
			table.pagination.shown.first = table.pagination.pags - 4
			table.pagination.shown.last = table.pagination.pags
			table.pagination.shown.pages = []
			for (let i = table.pagination.shown.first; i <= table.pagination.shown.last; i++)
				table.pagination.shown.pages.push(i)
			this.goto(table.pagination.pags)
		}
	}
}

let init = (table,data) => {
	table.data = data
	table.pagination.pags = Math.ceil(data.length / table.pagination.itemsPerPage)
	table.pagination.current = data.length > 0 ? 1 : 0
	table.data = data.slice(table.index.top = 0, table.index.bottom = table.pagination.itemsPerPage)
	table.pagination.shown.first = table.pagination.current
	table.pagination.shown.last = Math.min(table.pagination.pags,5)
	for(let i = table.pagination.shown.first; i <= table.pagination.shown.last; i++)
		table.pagination.shown.pages.push(i)
}

var vm = new Vue({
    el: '#app',
    data: {
			announs: [],
			projects: [],
			tabs: {
				announs: true,
				projects: false,
				selected: 'announs'
			},
			table: {
				announs: {},
				projects: {}
			}
		},
		created: function () {
			this.table.announs = Table()
			this.table.projects = Table()
			window.axios.get(`/api/announcement/user/${id}`)
				.then(({data}) => {
					data.forEach(e => {
						e.partakers = 0
						getProjectsByAnnoun(e._id, data);
						e.endEnrollmentsDate = getDate(e.endEnrollmentsDate)
						e.evaluationDate = getDate(e.evaluationDate)
						e.deadlineDate = getDate(e.deadlineDate)
					})
					this.announs = data;
					init(this.table.announs, data)
				})
				window.axios.get(`/api/project/user/${id}`)
				.then(({ data }) => {
					console.log(0/0)
					this.projects = data
					init(this.table.projects, data)
				})
				
		},
		methods: {
			changeContent: function (page) {
				if (this.tabs[page] !== true) {
					this.tabs[this.tabs.selected] = false
					this.tabs[page] = true
					this.tabs.selected = page
				}
			},
			table_: function (table,data) {
				return {
					announs: pagination(table,data),
					projects: pagination(table,data)
				}
			}
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
		.catch((err) => { console.log(err);})
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
/*
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
			vm.$data.announs = data;
		})
}
*/