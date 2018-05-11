const creationDate = document.getElementById("creationDate");
const evaluationDate = document.getElementById("evaluationDate");
const deadlineDate = document.getElementById("deadlineDate");
const content = document.getElementById("content");

window.onload = () => {
	console.log("announ");
	window.axios.get("/api/announcement/" + id).
		then(({data})=> {
			console.log(data[0]);
			if(!data['err']) {
				creationDate.innerHTML = data[0]["creationDate"];
				evaluationDate.innerHTML = data[0]["evaluationDate"];
				deadlineDate.innerHTML = data[0]["deadlineDate"];
				content.innerHTML = data[0]["content"];
			}
			else
			{
				alert(data['err']);
			}
		})
}