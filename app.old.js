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

app.use(express.static(__dirname + '/public'))
app.use('/bulma', express.static(__dirname + '/node_modules/bulma/css'))
app.use('/bulma-extensions', express.static(__dirname + '/node_modules/bulma-extensions/dist/'))
app.use('/bulma-carousel', express.static(__dirname + '/node_modules/bulma-extensions/bulma-carousel/dist/'))
app.get('/', (req, res) => {
  res.sendFile('index.html')
})

app.route('/user')
  .get((req, res) => {
    User.find({}, function(err, users) {
      if (err)
        res.sendStatus(500)
      else
        res.json(users)
    })
  })
  .post((req, res) => {
    let user = new User(req.body);
    user.save(function(err, user) {
      if (req.body._id)
        res.status(409).send('Cannot Send User With Id')
      else if (err)
        res.sendStatus(500)
      else
        res.json(user)
    })
  })

app.route('/user/:id')
  .get((req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err)
        if (err.name == 'CastError' && err.kind == 'ObjectId')
          res.status(404).send('User Not Found')
        else
          res.sendStatus(500)
      else
        res.json(user)
    })
  })
  .put((req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
      if (err)
        if (err.name == 'CastError' && err.kind == 'ObjectId')
          res.status(404).send('User Not Found')
        else
          res.sendStatus(500)
      else if (req.body._id)
        res.status(409).send('Cannot Send User With Id')
      else
        res.json(user)
    })
  })
  .delete((req, res) => {
    User.findByIdAndRemove(req.params.id, (err, user) => {
      if (err)
        if (err.name == 'CastError' && err.kind == 'ObjectId')
          res.status(404).send('User Not Found')
        else
          res.sendStatus(500)
      else
        res.json(user)
    })
  })