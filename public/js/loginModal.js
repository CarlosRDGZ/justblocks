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
	window.location='/signUp';
}


//**********************Axios methods*************************
const loginForm = document.getElementById('login');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
// const signInButton = document.getElementById('signIn');

loginForm.addEventListener('submit', function(ev) {
	ev.preventDefault();

	window.axios.post('signIn', { email: emailInput.value, password: md5(passwordInput.value) })
		.then(({data})=> {
			//Cómo redirigirte
			document.write(data);
		})
})
