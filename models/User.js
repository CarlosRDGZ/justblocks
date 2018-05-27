const mongoose = require('mongoose')
var Schema = mongoose.Schema;
const md5 = require('md5')

const emailMatch = [/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, "This text is not an email"]

//Valida que las dos contraseñas enviadas sean iguales, pero no guarda la confirmación de la contraseña sólo la contraseña en sí
var passwordValidation = {
	validator: function(pass) {
        //Se encripta la contraseña
        this.password = md5(pass);
		return this.passwordConfirmation == this.password;	//Todos los validadores deben de regresar un booleano
	},
	message: "The passwords are not equals"
}

const userSchema = new Schema({
    name: {
        first: { type: String, required: true, maxlength: [35, "Name very large"] },
        last: { type: String, required: true, maxlength: [35, "Last name very large"] }
    },
    password: {
    	type: String,
    	required: true,
    	minlength: [ 3, "The password must have at least 8 characters" ],
    	validate: passwordValidation
    },
    dateOfBirth: { type: Date, required: true },
	email: { type: String, required: "The email is required", unique: [true, "This email is already registered"], match: emailMatch },
	ocupation: String,
	education: String,
	bio: String,
	token: String,
  image: {type: Schema.Types.ObjectId, ref: "ImageUser" }
})

userSchema.virtual("passwordConfirmation").get(function() {
	//passConfirm hace referencia a este virtual (passwordConfirmation)
    return this.passConfirm;
}).set(function(password) {
	this.passConfirm = md5(password);
});

var User = mongoose.model('User', userSchema);
module.exports.User = User;
