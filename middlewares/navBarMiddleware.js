var User = require("../models/User").User;
var ImageUser = require("../models/ImageUser").ImageUser;
var Notification = require("../models/Notification").Notification;

module.exports = function(req, res, next) {
	console.log("navbar middleware");
	console.log("Session id: " + req.session.user_id);
	if(req.session.user_id) {
		User.findById(req.session.user_id)
			.then(user => {
				let userGot = user;
				ImageUser.find({owner: req.session.user_id})
					.then(image => {
						userGot.image = image[0];
						Notification.find({owner: req.session.user_id, checked: false}).limit(10)
							.then(notis => {
								res.locals = {user: userGot, notis: notis};
								next();
							})
							.catch(err => {console.log('NavBar findNotification error'); console.log(err.message); next();})
					})
					.catch(err => {console.log('NavBar findImage error'); console.log(err.message); next();})
			})
			.catch(err => {console.log('NavBar findUser error'); console.log(err.message); next();})
	}
	else
		next();
}