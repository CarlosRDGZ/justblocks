function createAnnoun()
{
	var announ = JSON.parse(JSON.stringify(vm.$data));
	delete announ.ui;
	window.axios.post('/api/announcement', announ).
		then(({data})=> {
			window.location = "/announcement/view/" + data["_id"];
		})
}