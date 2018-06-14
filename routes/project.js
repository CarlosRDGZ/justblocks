const project = require('express').Router()
const sessionMiddleware = require('../middlewares/session');//Para validar los usuarios
const navBarMiddleware = require('../middlewares/navBarMiddleware');//Para validar los usuarios

const Announcement = require('../models/Announcement').Announcement;
const Evaluator = require('../models/Evaluator').Evaluator;
const Project = require('../models/Project').Project;
const ProjectsEvaluator = require('../models/projectsEvaluator').ProjectsEvaluator;

project.get('/admin/:idProject', (req, res) => {
	Project.findById(req.params.idProject)
		.populate('idAnnouncement')
		.exec()
		.then(proj => {
			if (proj) {
				console.log(proj)
				if(proj.idCreator == req.session.user_id)
					res.render('project/adminView.pug', {project: proj});
				else
					res.sendStatus(403);
			} else
				res.send("404 Not found");
		})
		.catch(err => {
			console.log('Project error');
			console.log(err.message);
			res.status(500).json({err: err.message});
		})
})

project.use("/", navBarMiddleware);
module.exports = project;