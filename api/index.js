const api = require('express').Router()
const users = require('./users')
const session = require('./session')

api.use('/user', users)
api.use('/session', session)

api.get('/convocatoria', (req, res) => {
  res.status(200).sendFile('convocatoria.html', { root: './public' })
})

api.get('/faq', (req,res) => {
  res.status(200).render('faq.pug')
})

api.get('/', (req,res) => res.status(200).render('index.pug'))

module.exports = api