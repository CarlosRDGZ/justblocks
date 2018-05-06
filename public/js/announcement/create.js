function createAnnoun()
{
	const files = document.getElementById('files');
	var announ = JSON.parse(JSON.stringify(vm.$data));
	delete announ.ui;
	delete announ.errors;
	console.log(JSON.stringify(announ));
	window.axios.post('/api/announcement', announ).
		then(({data})=> {
			if(!data['err']) {
				let formData = new FormData()
			    let imagefile = document.querySelector('#file')
			    let id = data['_id'];
			    console.log("ID: " + id);
			    formData.append('image', imagefile.files[0])

				const config = { headers: { 'content-type': 'multipart/form-data' } }
				window.axios.post('/api/announcement/image/' + id, formData, config)
					.then(({data}) => {
						console.log("DENTRO");
						console.log(data);
						window.location = "/announcement/view/" + id;
					})
			}
			else {
				console.log(data['err']);
				alert("Error");
			}
		})
}