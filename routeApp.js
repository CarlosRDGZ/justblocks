//Rutas modulares para usuarios que ya iniciaron sesión
const express = require('express');
const router = express.Router();
const Announcement = require('./models/Announcement').Announcement;
//*************Para poder acceder a los parámetros del cuerpo de las peticiones
const bodyParser = require('body-parser');
router.use(bodyParser.json()); //Para peticiones aplication/json
router.use(bodyParser.urlencoded({extended: true}));

router.get("/", function(req, res) {
	res.render("app/home");
})

router.get('/announcement/admin/:idAnnoun', (req, res) => {
	Announcement.find({_id: req.params.idAnnoun}, (err, announ) => {
		if(announ[0].idCreator == req.session.user_id) {
			res.render('app/announAdmin', {announ: announ[0]});
		}
		else
			res.status(403).send('Denegado');
	})
})

module.exports = router;
