function createAnnoun()
{
	var announ = JSON.parse(JSON.stringify(vm.$data));
	delete announ.ui;
	delete announ.errors;
	console.log(JSON.stringify(announ));
	window.axios.post('/api/announcement', announ).
		then(({data})=> {
			if(!data['err'])
				window.location = "/announcement/view/" + data["_id"];
			else
				console.log(data['err']);
		})
}