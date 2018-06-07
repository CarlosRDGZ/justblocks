const url = `http://127.0.0.1:3000/`;
var vm = new Vue({
    el: '#app',
    data: {
        announs: [],
        empty: false,
        i: 0
    }
})

function get (id) {return document.getElementById(id);}

get('search').addEventListener('click', (ev) => {
	let text = get('txtSearch');
	if(text.value.trim() != ""){
		text.classList.remove('is-danger');
		window.location = `${url}api/announcement/search/${text.value}`;
	}
	else {
		text.classList.add('is-danger');
	}
})

function getUserName(id, object) {
	window.axios.get('/api/user/' + id + '/name')
		.then(({data}) => {
			name = "Convoca: " + data[0].name.first + " " + data[0].name.last;
			if(name.length > 36){
				name = name.substring(0, 32) + "...";
			}
			object.userName = name;
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
					if(data[i].title.length > 23)
						data[i].title = data[i].title.substring(0, 19) + "...";
				}
				vm.$data.announs = data;
			}
			else
				alert(data['err']);
		})