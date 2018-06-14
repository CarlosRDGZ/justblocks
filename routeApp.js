//Rutas modulares para usuarios que ya iniciaron sesión
const express = require('express');
const router = express.Router();
const announ = require('./app/announcement')
const project = require('./app/project')
// const Announcement = require('./models/Announcement').Announcement;
// const Project = require('./models/Project').Project
const Announcement = require('./models/Announcement').Announcement; 
const Project = require('./models/Project').Project
const Notification = require('./models/Notification').Notification

//*************Para poder acceder a los parámetros del cuerpo de las peticiones
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.get("/", (req, res) => res.render("app/home", { id: req.session.user_id }))
router.use('/announcement', announ)
router.use('/project', project)

module.exports = router;


//router.get('/announcement/admin/:id', (req, res) => {
router.get('/announcement/edit/:id', (req, res) => {
	Announcement.count({_id: req.params.id}, (err, count) => {
		if (!err)
			if (count === 1)
				res.render('app/announcement/edit', { id: req.params.id })
			else
				res.status(403).send('Denegado')
		else
			res.status(500).json(err)
	})
})

router.get('/announcement/projectsPerEvaluator/:id', (req, res) => {
	Announcement.findById(req.params.id)
		.then(announGot => {
			if(announGot.idCreator == req.session.user_id) {
      	let today = new Date(2018, 4, 8);
      	if(today < announGot.endEnrollmentsDate) //Etapa de registro, redirigir a la vista correspondiente
      		res.sendStatus(404);
      	else if(today >= announGot.deadlineDate) {//Convocatoria cerrada, se redirige a los resultados
      		let body = 'redirect';
      		let url = `http://127.0.0.1:3000/announcement/results/${announGot._id}`;
					res.writeHead(302, {
							'Content-Type': 'text/plain',
							'Location': url,
							'Content-Length': body.length
						});
					res.end(body);					
				}	
				else
					res.render('app/announcement/projectsPerEvaluator.pug', {announ: announGot});
			}
			else
				res.sendStatus(403);
		})
		.catch(err => {console.log('FindAnnouncement error ', err.message); res.status(500).json({err: err.message});})
})

router.get('/announcement/adminEvaluators/:id', (req, res) => {
	console.log("ANNNOUNCEMt")
	console.log(req.params.id);
	Announcement.findById(req.params.id)
		.then(announ => {
			console.log(announ);
			if(announ != undefined) {
				res.render('app/announcement/admin.pug', {announ: announ});
			}
			else
				res.status(404).send("404 NOT FOUND");
		})
		.catch(err => {
			console.log("Find announcement error");
			console.log(err.message);
			res.status(500).json({err: err.message});
		})
})
               
router.get('/project/admin/:id', (req,res) => {
	Project.count({_id: req.params.id}, (err, count) => {
		if (count === 1)
			res.render('app/project/edit', { id: req.params.id });
		else
			res.status(403).send('Denegado');
	})
})


router.get('/notifications', (req, res) => {
	res.render('app/notifications', {idUser: req.session.user_id});
})