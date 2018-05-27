const url = 'http://127.0.0.1:3000/';
function get (id) {return document.getElementById(id);}
let docs = {};
let documents = get("documents");
let evaluate = get("evaluate");

window.onload = function() {
	console.log('onload');
	window.axios.get(`${url}api/project/document/${idProject}`)
		.then(({data}) => {
			docs = data;
			console.log(data);
			data.forEach( function(doc) {
				let a = document.createElement("a");
				let row = document.createElement("tr");
				a.setAttribute("href", `${url}/files/projects/${doc._id}.${doc.extension}`);
				a.download = `${doc.name}.${doc.extension}`;
				a.text = doc.name;

				row.appendChild(a);
				documents.appendChild(row);
			});
		})
		.catch(err => {console.log(err.err);})	
}

evaluate.addEventListener('click', (ev) => {
	ev.preventDefault();
	window.axios.put(`${url}api/project/qualify/${idProject}`, {grade: grade.value})
		.then(({data}) => {
			console.log(data);
			window.location = `${url}announcement/view/evaluator/${data.idAnnouncement}`
		})
		.catch(err => {console.log(err.err);})
})