var vm = new Vue({
    el: '#app',
    data: {
			announs: [],
			tabs: {
				announs: true,
				evaluation: false,
				selected: 'announs'
			},
			table: {
				announs: Table
			}
		},
		created: function () {
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
					this.table.data = data
					this.table.pagination.pags = Math.ceil(this.announs.length / this.table.pagination.itemsPerPage)
					this.table.pagination.current = this.announs.length > 0 ? 1 : 0
					this.table.data = this.announs.slice(this.table.index.top = 0, this.table.index.bottom = this.table.pagination.itemsPerPage)
					this.table.pagination.shown.first = this.table.pagination.current
					this.table.pagination.shown.last = Math.min(this.table.pagination.pags,5)
					for(let i = this.table.pagination.shown.first; i <= this.table.pagination.shown.last; i++)
						this.table.pagination.shown.pages.push(i)
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
			table_: function (self = this) {
				return {
					pagination: function () {
						return {
							previous: function() {
								if (self.table.pagination.current > 1) {
									self.table.pagination.current--
									self.table.data = 
										self.announs.slice(self.table.index.top -= self.table.pagination.itemsPerPage, self.table.index.bottom -= self.table.pagination.itemsPerPage)
										if (self.table.pagination.current < self.table.pagination.shown.first){
											self.table.pagination.shown.pages.unshift(self.table.pagination.current)
											self.table.pagination.shown.pages = self.table.pagination.shown.pages.slice(0,self.table.pagination.shown.pages.length-1)
											self.table.pagination.shown.first--
											self.table.pagination.shown.last--
										}
								}
							},
							next: function() {
								if (self.table.pagination.current < self.table.pagination.pags) {
									self.table.pagination.current++
									self.table.data = 
										self.announs.slice(self.table.index.top += self.table.pagination.itemsPerPage, self.table.index.bottom += self.table.pagination.itemsPerPage)
									if (self.table.pagination.current > self.table.pagination.shown.last){
										self.table.pagination.shown.pages.push(self.table.pagination.current)
										self.table.pagination.shown.pages = self.table.pagination.shown.pages.slice(1)
										self.table.pagination.shown.first++
										self.table.pagination.shown.last++
									}
								}
							},
							goto: function(page) {
								self.table.pagination.current = page
								self.table.index.top = (self.table.pagination.itemsPerPage * page) - self.table.pagination.itemsPerPage
								self.table.index.bottom = self.table.pagination.itemsPerPage * page
								self.table.data =
									self.announs.slice(self.table.index.top, self.table.index.bottom)
							},
							first: function() {
								self.table.pagination.shown.first = 1
								self.table.pagination.shown.last = 5
								self.table.pagination.shown.pages = []
								for (let i = self.table.pagination.shown.first; i <= self.table.pagination.shown.last; i++)
									self.table.pagination.shown.pages.push(i)
									this.goto(1)
							},
							last: function() {
								self.table.pagination.shown.first = self.table.pagination.pags - 4
								self.table.pagination.shown.last = self.table.pagination.pags
								self.table.pagination.shown.pages = []
								for (let i = self.table.pagination.shown.first; i <= self.table.pagination.shown.last; i++)
									self.table.pagination.shown.pages.push(i)
								this.goto(self.table.pagination.pags)
							}
						}
					}
				}
			}
		}
})

let getDate = date => date != undefined ? date.substring(0,10) : 'NA'

let Table = () => new {
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
let TableMethods ()

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