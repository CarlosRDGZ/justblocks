const announ = require('express').Router()
const bodyParser = require('body-parser')
const Announcement = require('../models/Announcement').Announcement

announ.use(bodyParser.json())
announ.use(bodyParser.urlencoded({extended: true}))

announ.get('/edit/:id', (req, res) => {
	Announcement.count({_id: req.params.id})
		.then(count =>
			count === 1 ?
			res.render('app/announcement/edit', { id: req.params.id }):
			res.status(403).send('Denegado'))
		.catch(err => res.status(500).json(err))
})

announ.get('/admin/:id', (req,res) => {
  Announcement.findById(req.params.id)
    .then(data => res.render('app/announcement/admin', { announ: data }))
    .catch(err => res.status(500).json(err))
})

announ.get('/adminEvaluators/:id', (req, res) => {
	console.log("announcement")
	console.log(req.params.id);
	Announcement.findById(req.params.id)
		.then(announ => {
			console.log(announ);
			if(announ != undefined)
				res.render('app/announcement/admin', {announ: announ});
			else
				res.status(404).send("404 NOT FOUND");
		})
		.catch(err => {
			console.log("Find announcement error");
			console.log(err.message);
			res.status(500).json({err: err.message});
		})
})

module.exports = announ;