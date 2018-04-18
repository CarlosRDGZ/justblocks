var User = require("../models/User").User;

module.exports = function(req, res, next) {
	//Si no se ha logueado se regresa al index
	if(!req.session.user_id) {
		res.redirect("/");
	}
	else {
		//Cada vez que pase por aquí una petición buscará la información del usuario y la agregará a la petición
		User.findById(req.session.user_id, function(err, user) {
			if(err) {
				console.log("Session middleware: " + err);
				res.redirect("/");
			}
			else {
				res.locals = {user: user};
				next();
			}
		})
	}
}