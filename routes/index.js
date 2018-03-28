const routes = require('express').Router(),
  users = require('./users/users')

routes.use('/user', users)

routes.get('/convocatoria', (req, res) => {
  res.status(200).sendFile('convocatoria.html', { root: './public' })
})

routes.get('/faq', (req,res) => {
  res.status(200).render('faq.pug')
})
/*
routes.get('/otro', (req, res) => {
  res.status(200).sendFile('convocatoria.html')
})
*/
module.exports = routes