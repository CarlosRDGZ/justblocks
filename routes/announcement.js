const announ = require('express').Router()

announ.get('/', (req, res) => res.render('announcement/index.pug'))
announ.get('/create', (req, res) => res.render('announcement/create.pug'))

module.exports = announ;
