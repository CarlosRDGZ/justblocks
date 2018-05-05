const formDelete = document.getElementById('announcementDelete');
const idInput = document.getElementById('idDelete');

formDelete.addEventListener('submit', function(ev) {
	ev.preventDefault();
	console.log("AXIOS");
	window.axios.delete("/api/announcement/" + idInput.value).
		then(({data})=> {
			if(!data['err']) {
				alert("Se eliminó correctamente");
				window.location = "/app";
			}
			else
			{
				alert(data['err']);
			}
		})
})