const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  routes = require('./routes'),
  app = express()

mongoose.connect('mongodb://localhost/justblocks')
mongoose.connection.on('error',
  console.error.bind(console, 'MongoDB connection error:'));

mongoose.connection.once('open', function() {
  console.log('open')
  app.listen(3000, () => console.log('Runnig...'))
})

app.use(express.static(__dirname + '/public'))
app.use('/bulma', express.static(__dirname + '/node_modules/bulma/css'))
app.use('/bulma-extensions', express.static(__dirname + '/node_modules/bulma-extensions/dist/'))
app.use('/bulma-carousel', express.static(__dirname + '/node_modules/bulma-extensions/bulma-carousel/dist/'))
app.use('/', routes)