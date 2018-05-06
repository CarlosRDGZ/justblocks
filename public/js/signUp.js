const formSignUp = document.getElementById('signUp');
const nameInput = document.getElementById('name');
const lastNameInput = document.getElementById('lastName');
const emailSignUp = document.getElementById('email');
const passwordSignUp = document.getElementById('password');
const passwordConfirmationInput = document.getElementById('passwordConfirmation');
const dateInput = document.getElementById('dateOfBirth');
const file = document.getElementById('file');

formSignUp.addEventListener('submit', function(ev) {
	ev.preventDefault();
	window.axios.post("/api/user", { name: nameInput.value, 
						lastName: lastNameInput.value,
						password: md5(passwordSignUp.value),
						passwordConfirmation: md5(passwordConfirmationInput.value),
						dateOfBirth: dateInput.value,
						email: emailSignUp.value
					}).
		then(({data})=> {
			if(!data['err']) {
			    if(file.length != 0)
			    {//Se va a subir una imagen
					let formData = new FormData()
			    	let imagefile = document.querySelector('#file')
				    let id = data['_id'];
				    console.log(data);
				    console.log(id);
				    formData.append('image', imagefile.files[0])

					const config = { headers: { 'content-type': 'multipart/form-data' } }
					window.axios.post('/api/user/image/' + id, formData, config)
					.then(({data}) => {
						console.log("DENTRO");
						console.log(data);
						window.location = "/app";
					})
			    }
			    else
					window.location = "/app";

			}
			else {
				alert(data['err']);
			}
		})
})