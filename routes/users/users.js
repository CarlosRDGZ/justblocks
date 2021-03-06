const users = require('express').Router()
const User = require('../../models/User')
const bodyParser = require('body-parser')

users.use(bodyParser.urlencoded({ extended: true }))
users.use(bodyParser.json())

users.route('/')
  .get((req,res) => {
    User.find({}, (err, users) => {
      if (err)
        res.sendStatus(500)
      else
        res.status(200).json(users)
    })
  })
  .post((req,res) => {
    let user = new User(req.body);
    user.save((err, user) => {
      if (req.body._id)
        res.status(409).send('Cannot Send User With Id')
      else if (err)
        res.sendStatus(500)
      else
        res.json(user)
    })
  })

users.route('/:id')
  .get((req,res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) res.sendStatus(500)
      else res.json(user)
    })
  })

module.exports = users