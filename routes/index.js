const routes = require('express').Router(),
  users = require('./users/users')

routes.use('/user', users)

routes.get('/', (req, res) => {
  res.status(200).sendFile('index.html')
})

module.exports = routes