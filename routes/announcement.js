const announ = require('express').Router()
const sessionMiddleware = require('../middlewares/session');//Para validar los usuarios
const navBarMiddleware = require('../middlewares/navBarMiddleware');//Para validar los usuarios
const Announcement = require('../models/Announcement').Announcement;

announ.use("/", navBarMiddleware);
announ.use("/create", sessionMiddleware);

announ.get('/', (req, res) => res.render('announcement/index.pug'))
announ.get('/create', (req, res) => res.render('announcement/create.pug'))
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

///*****Debugg
announ.get('/', (req, res) => res.render('announcements.pug'))
announ.get('/opcions', (req, res) => {res.render("announcements.pug");})
announ.get('/delete', (req, res) => {res.render("announcementDelete.pug");})

module.exports = announ;
