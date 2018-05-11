function launchSignInModal()
{
	var modal = document.getElementById("signIn");
	modal.classList.add("is-active");
}

function closeSignInModal()
{
	var modal = document.getElementById("signIn");
	modal.classList.remove("is-active");
}

function toSignUp()
{
	//Tiene que llevarte a la página de registro
	closeSignInModal();
	openSignUp();
}

function openSignUp()
{
	window.location='/session/signUp';
}


//**********************Axios methods*************************
const loginForm = document.getElementById('login');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', function(ev) {
	ev.preventDefault();

	window.axios.post('/session/signIn', { email: emailInput.value, password: md5(passwordInput.value) })
		.then(({data})=>{
			if(data['err'])
			{
				alert(data['err']);

				/*switch(data['err']) {
					case 'Las contraseñas no coinciden':
						passwordInput.focus();
						break;
					case 'El correo enviado todavía no está registrado':
						emailInput.focus();
						break;
					default:
						break;
				}*/
			}
			else if(data['success']) {
				location.reload()
			}
		})
})
