const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  User = require('./models/User'),
  app = express()

mongoose.connect('mongodb://localhost/justblocks')
mongoose.connection.on('error',
  console.error.bind(console, 'MongoDB connection error:'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connection.once('open', function() {
  console.log('open')
  app.listen(3000, () => console.log('Runnig...'))
})

app.route('/user')
  .get((req, res) => {
    User.find({}, function(err, users) {
      if (err) throw err
      res.json(users)
    })
  })
  .post((req, res) => {
    let user = new User(req.body);
    user.save(function(err) {
      if (err) throw err
      res.json(req.body)
    })
  })

app.route('/user/:id')
  .get((req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) throw err
      res.json(user)
    })
  })
  .put((req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
      if (err) throw err
      res.json(user)
    })
  })
  .delete((req, res) => {
    User.findByIdAndRemove(req.params.id, (err, user) => {
      if (err) throw err
      res.json(user)
    })
  })