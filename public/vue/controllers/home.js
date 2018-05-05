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

window.onload = () => {
	window.axios.get('/api/announcement/user')
		.then(({data}) => {
			//Si no establecemos esta propiedad así no lo actualiza cuando carga la página
			for(var i = 0; i < data.length; i++)
				data[i].userName = "";

			for(var i = 0; i < data.length; i++) {
				getUserName(data[i]['idCreator'], data[i]);
			}
			vm.$data.myAnnouns = data;
		})
}

