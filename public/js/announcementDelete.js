const formDelete = document.getElementById('announcementDelete');
const idInput = document.getElementById('idDelete');

formDelete.addEventListener('submit', function(ev) {
	ev.preventDefault();
	window.axios.delete("announcement/" + idInput.value).
		then(({data})=> {
			if(!data['err']) {
				//Problemas
				window.location = "/app";
			}
			else
			{
				alert(data['err']);
			}
		})
})