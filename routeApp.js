//Rutas modulares para usuarios que ya iniciaron sesión
const express = require('express');
const router = express.Router();
const Announcement = require('./models/Announcement').Announcement; 
const Project = require('./models/Project').Project
//*************Para poder acceder a los parámetros del cuerpo de las peticiones
const bodyParser = require('body-parser');
router.use(bodyParser.json()); //Para peticiones aplication/json
router.use(bodyParser.urlencoded({extended: true}));

router.get("/", function(req, res) {
	res.render("app/home", { id: req.session.user_id });
})

router.get('/announcement/admin/:id', (req, res) => {
	Announcement.count({_id: req.params.id}, (err, count) => {
		if (count === 1)
			res.render('app/announcement/edit', { id: req.params.id });
		else
			res.status(403).send('Denegado');
	})
})

router.get('/announcement/adminEvaluators/:id', (req, res) => {
	console.log("ANNNOUNCEMt")
	console.log(req.params.id);
	Announcement.findById(req.params.id)
		.then(announ => {
			console.log(announ);
			if(announ != undefined) {
				res.render('app/announcement/adminEvaluators', {announ: announ});
			}
			else
				res.status(404).send("404 NOT FOUND");
		})
		.catch(err => {
			console.log("Find announcement error"); 
			console.log(err.message); 
			res.status(500).json({err: err.message})
		});
})		
                   
router.get('/project/admin/:id', (req,res) => {
	Project.count({_id: req.params.id}, (err, count) => {
		if (count === 1)
			res.render('app/project/edit', { id: req.params.id });
		else
			res.status(403).send('Denegado');
	})
})

module.exports = router;