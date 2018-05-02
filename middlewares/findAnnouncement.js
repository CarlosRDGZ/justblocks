//Middleware para establecer si un usuario tiene permisos sobre una announcement
var Announcement = require('../models/Announcement').Announcement;

const ownerCheck = function(announcement, req, res) {
	if(typeof announcement == "undefined") return false;
	//Todos pueden verla
	if(req.method === 'GET') {
		//Ver la announcement, cualquier persona puede ver cualquier announcement
		return true;		
	}
	//PUT y DELETE sólo los que la crearon
	if(announcement.idCreator.toString() == res.locals.user._id) {
		//Esta convocatoria la subió el usuario
		return true;
	}
	//Si no pasa la condicón anterior es porque no se tienen los permisos necesarios
	return false;
}

module.exports = function(req, res, next) {
    console.log("FIND announcement middleware");
	Announcement.findById(req.params.id)
		//Algo así como la condicón WHERE de SQL
		.populate("creator")
		.exec(function(err, announcement) {
			//Si la announcement existe y se pasaron los permisos necesarios
			if(announcement != null && ownerCheck(announcement, req, res)) {
				res.locals.announcement = announcement;
				next();
			}
			else {
				res.redirect("/app");
			}
		})
} 
