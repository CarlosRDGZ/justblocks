//Rutas modulares para usuarios que ya iniciaron sesión
const express = require('express');
const session = express.Router();
const User = require('../models/User').User;
const md5 = require('md5');

session.get("/signUp", function(req, res) {
	res.render("signUp.pug");
})

session.post("/signIn", function(req, res) {
	//El email es único
	User.findOne({email: req.body.email}, function(err, user) {
		if(!err) {
			console.log(req.body.email);
			console.log(user);
			if(user) {
				if(user.password == md5(req.body.password)) {
					req.session.user_id = user._id;
					res.json({success: "success"});
				} 
				else {
					console.log("Las contraseñas no coinciden");
					res.json({err: "Las contraseñas no coinciden"});
				}
			}
			else {
				console.log("El correo enviado todavía no está registrado");
				res.json({err: "El correo enviado todavía no está registrado"}).status(404);		
			}
		}
		else {
			console.log(err);
			res.json({err: "Ocurrió un error al conectarse con la base de datos"});
		}
	})
})

session.route("/logout").get(function(req, res){
    req.session.destroy();
    res.redirect("/");
});	

module.exports = session;