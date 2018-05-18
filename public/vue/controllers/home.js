var vm = new Vue({
    el: '#app',
    data: {
			announs: [],
			tabs: {
				announs: true,
				evaluation: false,
				selected: 'announs'
			},
			tableAnnouns: {
				pagination: {
					current: 0,
					pags: 0,
					itemsPerPage: 9,
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
		},
		created: function () {
			window.axios.get(`/api/announcement/user/${id}`)
				.then(({data}) => {
					//Si no establecemos esta propiedad así no lo actualiza cuando carga la página
					for(var i = 0; i < data.length; i++) {
						data[i].partakers = 0;
					}
					data.forEach((announ) => {
						getProjectsByAnnoun(announ._id, data);
						announ.endEnrollmentsDate = announ.endEnrollmentsDate != undefined ? announ.endEnrollmentsDate.substring(0, 10) : 'NA';
						announ.evaluationDate = announ.evaluationDate != undefined ? announ.evaluationDate.substring(0, 10) : 'NA';
						announ.deadlineDate = announ.deadlineDate != undefined ? announ.deadlineDate.substring(0, 10) : 'NA';
					})
					this.announs = data;
					this.tableAnnouns.data = data
					this.tableAnnouns.pagination.pags = Math.ceil(this.announs.length / this.tableAnnouns.pagination.itemsPerPage)
					this.tableAnnouns.pagination.current = this.announs.length > 0 ? 1 : 0
					this.tableAnnouns.data = this.announs.slice(this.tableAnnouns.index.top = 0, this.tableAnnouns.index.bottom = this.tableAnnouns.pagination.itemsPerPage)
					this.tableAnnouns.pagination.shown.first = this.tableAnnouns.pagination.current
					this.tableAnnouns.pagination.shown.last = Math.min(this.tableAnnouns.pagination.pags,10)
					for(let i = this.tableAnnouns.pagination.shown.first; i <= this.tableAnnouns.pagination.shown.last; i++)
						this.tableAnnouns.pagination.shown.pages.push(i)
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
			table: function (self = this) {
				return {
					pagination: function () {
						return {
							previous: function() {
								if (self.tableAnnouns.pagination.current > 1) {
									self.tableAnnouns.pagination.current--
									self.tableAnnouns.data = 
										self.announs.slice(self.tableAnnouns.index.top -= self.tableAnnouns.pagination.itemsPerPage, self.tableAnnouns.index.bottom -= self.tableAnnouns.pagination.itemsPerPage)
										if (self.tableAnnouns.pagination.current < self.tableAnnouns.pagination.shown.first){
											self.tableAnnouns.pagination.shown.pages.unshift(self.tableAnnouns.pagination.current)
											self.tableAnnouns.pagination.shown.pages = self.tableAnnouns.pagination.shown.pages.slice(0,self.tableAnnouns.pagination.shown.pages.length-1)
											self.tableAnnouns.pagination.shown.first--
											self.tableAnnouns.pagination.shown.last--
										}
								}
							},
							next: function() {
								if (self.tableAnnouns.pagination.current < self.tableAnnouns.pagination.pags) {
									self.tableAnnouns.pagination.current++
									self.tableAnnouns.data = 
										self.announs.slice(self.tableAnnouns.index.top += self.tableAnnouns.pagination.itemsPerPage, self.tableAnnouns.index.bottom += self.tableAnnouns.pagination.itemsPerPage)
									if (self.tableAnnouns.pagination.current > self.tableAnnouns.pagination.shown.last){
										self.tableAnnouns.pagination.shown.pages.push(self.tableAnnouns.pagination.current)
										self.tableAnnouns.pagination.shown.pages = self.tableAnnouns.pagination.shown.pages.slice(1)
										self.tableAnnouns.pagination.shown.first++
										self.tableAnnouns.pagination.shown.last++
									}
								}
							},
							goto: function(page) {
								self.tableAnnouns.pagination.current = page
								self.tableAnnouns.index.top = (self.tableAnnouns.pagination.itemsPerPage * page) - self.tableAnnouns.pagination.itemsPerPage
								self.tableAnnouns.index.bottom = self.tableAnnouns.pagination.itemsPerPage * page
								self.tableAnnouns.data =
									self.announs.slice(self.tableAnnouns.index.top, self.tableAnnouns.index.bottom)
							},
							first: function() {
								self.tableAnnouns.pagination.shown.first = 1
								self.tableAnnouns.pagination.shown.last = 10
								self.tableAnnouns.pagination.shown.pages = []
								for (let i = self.tableAnnouns.pagination.shown.first; i <= self.tableAnnouns.pagination.shown.last; i++)
									self.tableAnnouns.pagination.shown.pages.push(i)
									this.goto(1)
							},
							last: function() {
								self.tableAnnouns.pagination.shown.first = self.tableAnnouns.pagination.pags - 9
								self.tableAnnouns.pagination.shown.last = self.tableAnnouns.pagination.pags
								self.tableAnnouns.pagination.shown.pages = []
								for (let i = self.tableAnnouns.pagination.shown.first; i <= self.tableAnnouns.pagination.shown.last; i++)
									self.tableAnnouns.pagination.shown.pages.push(i)
								this.goto(self.tableAnnouns.pagination.pags)
							}
						}
					}
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