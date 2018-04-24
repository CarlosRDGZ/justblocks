const creationDate = document.getElementById("creationDate");
const evaluationDate = document.getElementById("evaluationDate");
const deadlineDate = document.getElementById("deadlineDate");
const content = document.getElementById("content");


window.onload = () => {
	window.axios.get("api/announcement/view/" + id).
		then(({data})=> {
			console.log(data);
			if(!data['err']) {
				creationDate.innerHTML = data.creationDate;
				evaluationDate.innerHTML = data.evaluationDate;
				deadlineDate.innerHTML = data.deadlineDate;
				content.innerHTML = data.content;
			}
			else
			{
				alert(data['err']);
			}
		})
}