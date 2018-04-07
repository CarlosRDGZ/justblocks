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