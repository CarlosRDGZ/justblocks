var User = require("../models/User").User;

module.exports = function(req, res, next) {
	console.log("navbar middleware");
	console.log("Session id: " + req.session.user_id);
	if(req.session.user_id) {
		User.findById(req.session.user_id, function(err, user) {
			if(err) {
				console.log("NavBar middleware: " + err);
			}
			else {
				res.locals = {user: user};
				next();
			}
		})
	}
	else
	{
		next();
	}
}