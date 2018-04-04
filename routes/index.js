const routes = require('express').Router()
const users = require('./users/users')

routes.use('/user', users)

routes.get('/convocatoria', (req, res) => {
  res.status(200).sendFile('convocatoria.html', { root: './public' })
})

routes.get('/faq', (req,res) => {
  res.status(200).render('faq.pug')
})

routes.get('/', (req,res) => res.status(200).render('index.pug'))

module.exports = routes