const formSignUp = document.getElementById('signUp');
const nameInput = document.getElementById('name');
const lastNameInput = document.getElementById('lastName');
const emailSignUp = document.getElementById('email');
const passwordSignUp = document.getElementById('password');
const passwordConfirmationInput = document.getElementById('passwordConfirmation');
const dateInput = document.getElementById('dateOfBirth');

formSignUp.addEventListener('submit', function(ev) {
	ev.preventDefault();
	window.axios.post("newUser", { name: nameInput.value, 
						lastName: lastNameInput.value,
						password: md5(passwordSignUp.value),
						passwordConfirmation: md5(passwordConfirmationInput.value),
						dateOfBirth: dateInput.value,
						email: emailSignUp.value
					}).
		then(({data})=> {
			//Si el registro es exitoso lo loguea
			window.axios.post('signIn', { email: emailSignUp.value, password: md5(passwordSignUp.value) })
				.then(({data})=> {
					//Cómo redirigirte
					console.log(data);
					document.write(data);
				})
		})
})