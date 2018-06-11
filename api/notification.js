const notis = require('express').Router()
const Notification = require('../models/Notification').Notification
const bodyParser = require('body-parser')

notis.use(bodyParser.urlencoded({ extended: true }))
notis.use(bodyParser.json())

notis.route('/:idUser')
	.get((req, res) => {
		Notification.find({owner: req.params.idUser})
			.then(notifis => {
				res.json(notifis);
			})
			.catch(err => {console.log('findNotification error;'); console.log(err.message); res.status(500).json({err: err.message});})
	})
	.post((req, res) => {
		let notification = new Notification({
			owner: req.params.idUser,
			title: req.body.title,
			url: req.body.url
		});	

		notification.save()
			.then(result => {
				res.json(result);
			})	
			.catch(err => {console.log('saveNotification error;'); console.log(err.message); res.status(500).json({err: err.message});})
	})

notis.route('/checked/:idUser')
	.get((req, res) => {
		Notification.find({owner: req.params.idUser, checked: false})
			.then(notifis => {
				res.json(notifis);
			})
			.catch(err => {console.log('findNotification error;'); console.log(err.message); res.status(500).json({err: err.message});})
	})

notis.route('/check/:id')
	.put((req, res) => {
		Notification.findByIdAndUpdate(req.params.id, {$set: {checked: true}})
			.then(result => {
				res.json(result);
			})
			.catch(err => {console.log('updateChecked error;'); console.log(err.message); res.status(500).json({err: err.message});})
	})

notis.route('/:id')
	.get((req, res) => {
		Notification.findById(req.params.id)
			.then(result => {
				res.json(result);
			})
			.catch(err => {console.log('findByIdNotification error;'); console.log(err.message); res.status(500).json({err: err.message});})
	})
	.delete((req, res) => {
		Notification.findByIdAndDelete(req.params.id)
			.then(result => {
				res.json(result);
			})
			.catch(err => {console.log('findByIdNotification error;'); console.log(err.message); res.status(500).json({err: err.message});})
	})
	.put((req, res) => {
		Notification.findByIdAndUpdate(req.params.id, {$set: req.body})
			.then(result => {
				res.json(result);
			})
			.catch(err => {console.log('updateChecked error;'); console.log(err.message); res.status(500).json({err: err.message});})
	})

//*********Debuggin methods
notis.route('/discheckedAll/:idUser')
	.put((req, res) => {
		Notification.update({owner: req.params.idUser, checked: true}, {checked: false}, {multi: true})
			.then(result => {	
				res.json(result);
			})
			.catch(err => {console.log('updateChecked error;'); console.log(err.message); res.status(500).json({err: err.message});})
	})

module.exports = notis;