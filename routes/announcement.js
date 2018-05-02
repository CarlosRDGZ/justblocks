const announ = require('express').Router()
const sessionMiddleware = require('../middlewares/session');//Para validar los usuarios

announ.use("/create", sessionMiddleware);

announ.get('/create', (req, res) => res.render('announcement/create.pug'))

announ.get('/view/:id', function(req, res) {
	res.render('announcement/view', {id: req.params.id});
})

///*****Debugg
announ.get('/', (req, res) => res.render('announcements.pug'))
announ.get('/opcions', (req, res) => {res.render("announcements.pug");})
announ.get('/delete', (req, res) => {res.render("announcementDelete.pug");})

module.exports = announ;
