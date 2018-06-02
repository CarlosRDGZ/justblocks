const project = require('express').Router()
const sessionMiddleware = require('../middlewares/session');//Para validar los usuarios
const navBarMiddleware = require('../middlewares/navBarMiddleware');//Para validar los usuarios
const Project = require('../models/Announcement').Project;

project.use("/", navBarMiddleware);

project.get('/edit/:id', function(req, res) {
	res.render('project/edit', {id: req.params.id});
})

module.exports = project;
