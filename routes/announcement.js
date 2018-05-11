const announ = require('express').Router()
const sessionMiddleware = require('../middlewares/session');//Para validar los usuarios

announ.use("/create", sessionMiddleware);

announ.get('/', (req, res) => res.render('announcement/index.pug'))
announ.get('/create', (req, res) => res.render('announcement/create.pug'))

announ.get('/view/:id', function(req, res) {
	res.render('announcement/view', { id: req.params.id });
})

module.exports = announ;
