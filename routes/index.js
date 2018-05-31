const routes = require('express').Router()
const session = require('./session')
const project = require('./project')
const announ = require('./announcement')
const api = require('../api')
const navBarMiddleware = require('../middlewares/navBarMiddleware');//Para validar los usuarios

routes.use("/", navBarMiddleware);

routes.use('/api', api)
routes.use('/session', session)
routes.use('/announcement', announ)
routes.use('/project', project)

routes.get('/convocatoria', (req, res) => {
  res.status(200).sendFile('convocatoria.html', { root: './public' })
})

routes.get('/faq', (req,res) => {
  res.status(200).render('faq.pug')
})

routes.get('/', (req,res) => res.status(200).render('index.pug'))

module.exports = routes