const announ = require('express').Router()

announ.get('/create', (req, res) => res.render('announcement/create.pug'))

announ.get('/view/:id', function(req, res) {
	res.render('announcement/view', {id: req.params.id});
})

module.exports = announ;
