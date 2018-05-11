ClassicEditor.create(document.querySelector('#description'), {
	plugins: [ Essentials, Paragraph, Bold, Italic ],
	toolbar: ['heading','|','bold','italic','link','bulletedList','numberedList','blockQuote','undo','redo'],
}).then(editor => window.editor = editor)
const file = document.getElementById('file');

function createAnnoun()
{
	var announ = JSON.parse(JSON.stringify(vm.$data));
	delete announ.ui;
	delete announ.errors;
	console.log(JSON.stringify(announ));
	window.axios.post('/api/announcement', announ).
		then(({data})=> {
			if(!data['err']) {
			    let id = data['_id'];
				if(file.files.length != 0)
				{
					let formData = new FormData()
				    let imagefile = document.querySelector('#file')
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
				else
				{
					window.location = "/announcement/view/" + id;
				}
			}
			else {
				console.log(data['err']);
				alert("Error");
			}
		})
}