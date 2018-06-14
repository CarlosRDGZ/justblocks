const url = 'http://127.0.0.1:3000/' 
Vue.use(VueTables.ClientTable);
const emailMatch = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const vm = new Vue({
	el: '#partakers',
	data: {
		documents: [],
		partakers: [],
		columns: ['name', 'email', 'rol', 'options'],
		tabs: {
			documents: true,
			partakers: false,
			selected: 'documents'
		},
		table: {
			documents: {
				columns: ['type', 'name', 'options'],
				options: {
					skin: 'table is-striped is-fullwidth is-hoverable',
					headings: {
						type: 'Tipo',
						name: 'Nombre',
						email: 'Correo',
						rol: 'Rol',
						options: 'Eliminar'
					},
					filterable: ['name'],
					perPage: 10,
					perPageValues: [10,25],
					pagination: { nav: 'fixed', edge: true }
				}
			},
			partakers: {
				columns: ['name', 'email', 'status', 'options'],
				options: {
					skin: 'table is-striped is-fullwidth is-hoverable',
					headings: {
						name: 'Nombre',
						email: 'Correo',
						rol: 'Rol',
						options: 'Eliminar'
					},
					sortable: ['name', 'rol'],
					filterable: ['name', 'email'],
					orderBy: {'column': 'rol'},
					preserveState: true,
					perPage: 5,
					perPageValues: [5,10,25],
					pagination: { nav: 'fixed', edge: true }
				}
			}
		},
		empty: {
			user: {
				_id: '',
				name: {
					first: '',
					last: ''
				},
				email: '',
				ocupation: '',
				education: '',
				bio: '',
			}
		},
		searchedEmail: '',
		badEmail: false,
		notFound: false,
		searchedUser: {},
		modal: {
			user: false
		},
		text: ['odt','ott','odm','tml','oth','ods','ots','odg','otg','odp','otp','odf','odb','oxt','doc','docm','docx'],
		slide: ['pptx','pptm','ppt','xps','potx','potm','pot','thmx','ppsx','ppsm','pps','ppam','ppa'],
		sheet: ['xlsx','xls','xml','xml','xlam'],
		pdf: 'pdf',
		image: ['bmp','gif','jpg','jpge','png','psd','ai','cdr','dwg','svg','raw','nef'],
		audio: ['mp3','mid','midi','wav','wma','cda','ogg','ogm','aac','ac3','flac','aym'],
		video: ['asf','lsf','asx','bik','smk','div','divx','dvd','wob','ivf','m1v','mp2v','mp4','mpa','mpe','mpeg','mpg','mpv2','mov','qt','qtl','rpm','wm','wmv','avi'],
		compressed: ['7z','7z001','7z002','a00','a01','a02','ace','alz','ar','arc','arj','ark','b1','b64','ba','bh','bndl','boo','bz','bz2','bza','bzip','bzip2','c00','c01','c02','c10','cb7','cba','cbr','cbt','cbz','cmp','cp9','cpgz','czip','dar','deb','dgc','dist','dl_','drz','dwz','dz','ecs','efw','egg','gca','gpk','gz','gz2','gza','gzi','gzip','ha','hbc','hbc2','hbe','hki','hki1','hki2','hki3','ice','ipg','ish','ita','ize','jam','jarpack','jgz','jic','kgb','kz','lbr','lemon','lha','lqr','lz','lzh','lzm','lzma','lzo','lzx','mcp','mint','mls','mou','mpkg','mrt','mv','mzp','oar','oz','packgz','pae','pak','paq6','paq7','paq8','paq8f','par','par2','pax','pbi','pcv','pea','pet','pit','piz','pkg','prp','psz','pup','pwa','qda','r0','r00','r01','r02','r03','r1','r2','r21','r30','rar','rar5','rev','rk','rp9','rpm','rz','s00','s7z','sar','sea','sen','sfs','sfx','shar','shk','shr','sit','sitx','sqx','srep','sy_','targz','targz2','tarlzma','tarxz','taz','tbz','tbz2','tg','tgz','tlz','tlzma','txz','tx_','tz','uc2','ufsuzip','uha','uzip','vem','vsi','w02','war','xef','xez','xmcdz','xx','xz','yz','yz1','z','z01','z02','z03','z04','zfsendtotarget','zi','zip','zipx','zix','zl','zoo','zz']
	},
	created: function() {
		this.searchedUser = this.empty.user
		window.axios.get(`${url}api/partaker/project/${idProject}`)
			.then(({data}) => {
				console.log(data);
				let rows = [];
				for(let i = 0; i < data.length; i++) {
					let temp = {}
					temp.name = data[i].idUser.name.first + " " + data[i].idUser.name.last;
					temp.email = data[i].idUser.email;
					temp.rol = data[i].rol;
					temp.options = "Eliminar";
					temp.id = data[i]._id;
					rows.push(temp);
				}
				console.log(rows);
				this.partakers = rows;
			})

		window.axios.get(`${url}api/project/documents/${idProject}`)
			.then(({data}) => {
				this.documents = data;
				console.log(data);
			})
			.catch(err => {console.log(err.err);})
	},
	methods: {
		changeContent: function (page) {
			if (this.tabs[page] !== true) {
				this.tabs[this.tabs.selected] = false
				this.tabs[page] = true
				this.tabs.selected = page
			}
		},
		get: function(id) {
			return document.getElementById(id);
		},
		searchPartaker: function() {
			if(emailMatch.test(this.searchedEmail)) {
				window.axios.get(`${url}api/user/email/${this.searchedEmail}`)
					.then(({data}) => {
						if (data != null) {
							this.searchedUser = data;
							this.modal.user = true
						} else
							this.notFound = true
					})
					.catch(err => console.log(err))
			}
			else
				this.badEmail = true
		},
		addNewPartaker: function() {
			let partaker = {
				idProject: idProject,
				idUser: this.searchedUser._id,
				rol: 'Contestant'
			};
			window.axios.post(`${url}api/partaker/`, partaker)
				.then(({data}) => {
					let temp = {}
					temp.name = this.searchedUser.name.first + " " + this.searchedUser.name.last;
					temp.email = this.searchedUser.email;
					temp.rol = "Contestant";
					temp.options = "Eliminar";
					this.partakers.push(temp);
					this.modal.user = false				
				})
				.catch(err => console.log(err))
		},
		deletePartaker: function(row) {
			let index = row.index;
			let info = row.row;
			if(confirm(`¿Estás seguro que quieres eliminar a ${info.name} como integrante del proyecto?`)) {
				window.axios.delete(`${url}api/partaker/${info.id}`)
					.then(({data}) => {
						this.partakers = this.partakers.filter(e => e.id != info.id);
						console.log("Eliminado")
					})
					.catch(err => console.log(err))
			}
		},
		uploadFile: function() {
			let docs = this.get('docs');
			console.log("upload");
			if(docs.files.length != 0) {
	        let formData = new FormData()

	        console.log(docs.files);
	        formData.append('document', docs.files[0])

	        const config = { headers: { 'content-type': 'multipart/form-data' } }
	        window.axios.post(`${url}api/project/documents/${idProject}`, formData, config)
	          .then(({data}) => {
	          	this.documents.push(data);
	          	console.log(data);
	          })
	          .catch(err => console.log(err))
		    }
		    else
		    {
		      console.log(res.data); 
		    }
		},
		deleteFile: function(doc) {
			if(confirm(`¿Estás seguro que quieres eliminar el docuemento "${doc.name}" del proyecto?`)) {
				window.axios.delete(`${url}api/project/document/${doc._id}`)
					.then(({data}) => {
						this.documents = this.documents.filter(e => e._id != doc._id);
						console.log("Eliminado");
						console.log(data);
					})
					.catch(err => console.log(err))
			}
		}
	}
})
