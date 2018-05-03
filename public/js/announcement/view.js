const creationDate = document.getElementById("creationDate");
const evaluationDate = document.getElementById("evaluationDate");
const deadlineDate = document.getElementById("deadlineDate");
const content = document.getElementById("content");

window.onload = () => {
			console.log("announ");
	window.axios.get("http://127.0.0.1:3000/api/announcement/view/" + id).
		then(({data})=> {
			var announ = data[0];
			console.log(announ);
			if(!announ['err']) {
				creationDate.innerHTML = announ["creationDate"];
				evaluationDate.innerHTML = announ["evaluationDate"];
				deadlineDate.innerHTML = announ["deadlineDate"];
				content.innerHTML = announ["content"];
			}
			else
			{
				alert(data['err']);
			}
		})
}