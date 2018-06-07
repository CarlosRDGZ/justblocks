const announ = require('express').Router()
const sessionMiddleware = require('../middlewares/session');//Para validar los usuarios
const navBarMiddleware = require('../middlewares/navBarMiddleware');//Para validar los usuarios
const Announcement = require('../models/Announcement').Announcement;

const Project = require('../models/Project').Project;
const ProjectsEvaluator = require('../models/projectsEvaluator').ProjectsEvaluator;
const Evaluator = require('../models/Evaluator').Evaluator;

announ.use("/", navBarMiddleware);
// announ.use("/create", sessionMiddleware);

announ.get('/', (req, res) => res.render('announcement/index.pug'))

announ.get('/closed', (req, res) => res.render('announcement/closed.pug'))

announ.get('/results/:id', (req, res) => {
	Announcement.findById(req.params.id)
		.then(announGot => {
			let today = new Date();
			if(today >= announGot.deadlineDate) {
				res.render('announcement/results.pug', {announ: announGot});
			}
			else {
				console.log('La convocatoria todavía no ha terminado');
				res.status(500).json({err: "La convocatoria todavía no ha terminado"});
			}
		})
		.catch(err => {console.log('Find announcement error'); console.log(err.message); res.status(500).json({err: err.message});})
})

announ.get('/create', (req, res) => res.render('announcement/create.pug'))
announ.get('/view/:id', function(req, res) {
	res.render('announcement/view', {id: req.params.id});
})


announ.get('/view/:id', function(req, res) {
	Announcement.find({_id: req.params.id})
		.then((announcementGot) => {
			console.log("THEN");
			//Por alguna razón es un array
			res.render('announcement/view', announcementGot[0]);
		})
		.catch((err) => {
			console.log("Err getAnnoun: " + err.message);
		})
})

module.exports = announ;
announ.get('/view/evaluator/:idAnnoun', (req, res) => {
	console.log('View announcement evaluator');
	let idAnnoun = req.params.idAnnoun;

	Evaluator.find({idUser: req.session.user_id, idAnnouncement: idAnnoun})
		.populate('idAnnouncement')
		.exec()
		.then(evaluator => {
			console.log(evaluator[0])
			if(evaluator[0]) {
				res.render('announcement/evaluator/view.pug', {evaluator: evaluator[0]});
			}
			else
				res.send("404 not found");
		})
		.catch(err =>{console.log('Evaluator announ error'); console.log(err.message); res.status(500).json({err: err.message});})
})

announ.get('/view/qualify/project/:idProject', (req, res) => {
	let idProj = req.params.idProject;
	Evaluator.find({idUser: req.session.user_id})
		.then(evaluator =>{
			if(evaluator[0]) {
				let idEval = evaluator[0]._id;
				ProjectsEvaluator.find({idEvaluator: idEval, idProject: idProj})
					.populate('idProject')
					.exec()
					.then(project => {
						console.log(project[0])
						if(project[0]) {
							res.render('project/evaluate.pug', {project: project[0]});
						}
						else
							res.send("404 not found");
					})
					.catch(err =>{console.log('ProjectsEvaluator error'); console.log(err.message); res.status(500).json({err: err.message});})
			}
			else
				res.send("404 not found");
		})
		.catch(err =>{console.log('Evaluator error'); console.log(err.message); res.status(500).json({err: err.message});})
})

///*****Debugg
announ.get('/', (req, res) => res.render('announcements.pug'))
announ.get('/opcions', (req, res) => {res.render("announcements.pug");})
announ.get('/delete', (req, res) => {res.render("announcementDelete.pug");})