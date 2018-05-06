var User = require("../models/User").User;
var ImageUser = require("../models/ImageUser").ImageUser;

module.exports = function(req, res, next) {
	console.log("navbar middleware");
	console.log("Session id: " + req.session.user_id);
	if(req.session.user_id) {
		User.findById(req.session.user_id, function(err, user) {
			var userGot = user;
			if(err) {
				console.log("NavBar middleware: " + err);
			}
			else {
				ImageUser.find({owner: req.session.user_id}, function(err, image) {
					if(!err) {
						console.log("NavBar middleware image: ");
						userGot.image = image[0];
					}
					else
						console.log(err);
					console.log(userGot);
					res.locals = {user: userGot};
					next();
				})
			}
		})
	}
	else
	{
		next();
	}
}