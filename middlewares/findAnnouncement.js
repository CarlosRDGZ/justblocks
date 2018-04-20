//Middleware para establecer si un usuario tiene permisos sobre una announcement
var Announcement = require('../models/Announcement');

const announcementPermission = function(announcement, req, res) {
	if(typeof announcement == "undefined") return false;
	//TRUE = tienes permisos
	//False = no tiene permisos
	//Si es GET y no tiene edit en la URL
	if(req.method === 'GET' && req.path.indexOf("edit") < 0) {
		//Ver la announcement, cualquier persona puede ver cualquier announcement
		return true;		
	}

	if(announcement.idCreator._id.toString() == res.locals.user._id) {
		//Esta convocatoria la subió el usuario
		return true;
	}
	//Si no pasa la condicón anterior es porque no se tienen los permisos necesarios
	return false;
}

module.exports = function(req, res, next) {
	Announcement.findById(req.params.id)
		//Algo así como la condicón WHERE de SQL
		.populate("creator")
		.exec(function(err, announcement) {
			//Si la announcement existe y se pasaron los permisos necesarios
			if(announcement != null && ownerCheck(announcement, req, res)) {
				console.log("Se encontró la announcement " + announcement.idCreator);
				res.locals.announcement = announcement;
				next();
			}
			else {
				res.redirect("/app");
			}
		})
} 
