var vm = new Vue({
    el: '#app',
    data: {
        announs: [],
        i: 0
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

function getImage(id, object) {
	window.axios.get('/api/announcement/image/' + id)
		.then(({data}) => {
			object.image = data;
			console.log(data);
		})
		.catch(({err}) => { console.log(err);})
}

window.onload = 
	window.axios.get('/api/announcement/newest').
		then(({data}) => {
			console.log("ONLOAD");
			if(!data['err'])
			{
				console.log("announcements");
				console.log(data);
				//Si no establecemos esta propiedad así no lo actualiza cuando carga la página
				for(var i = 0; i < data.length; i++) {
					data[i].userName = "";
					data[i].image = "";
				}

				for(var i = 0; i < data.length; i++) {
					getUserName(data[i]['idCreator'], data[i]);
					getImage(data[i]['_id'], data[i]);
				}
				vm.$data.announs = data;
			}
			else
				alert(data['err']);
		})