var User = require("../models/User").User;

module.exports = function(req, res, next) {
	if(!req.session.user_id) {
		res.redirect("/index");
	}
	else {
		//Cada vez que pase por aquí una petición buscará la información del usuario y la agregará a la petición
		User.findById(req.session.user_id, function(err, user) {
			if(err) {
				console.log("Session middleware: " + err);
				res.redirect("/index");
			}
			else {
				res.locals = {user: user};
				next();
			}
		})
	}
}