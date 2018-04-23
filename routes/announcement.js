const announ = require('express').Router()

announ.get('/create', (req, res) => res.render('announcement/create.pug'))

module.exports = announ;
