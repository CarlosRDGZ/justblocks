const routes = require('express').Router()
const announ = require('./announcement')
const api = require('../api')

routes.use('/api', api)
routes.use('/announcement', announ)

routes.get('/convocatoria', (req, res) => {
  res.status(200).sendFile('convocatoria.html', { root: './public' })
})

routes.get('/faq', (req,res) => {
  res.status(200).render('faq.pug')
})

routes.get('/', (req,res) => res.status(200).render('index.pug'))

module.exports = routes