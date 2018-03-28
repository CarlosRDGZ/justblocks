const express = require('express')
const mongoose = require('./database/config')
const routes = require('./routes')
const path = require('path')
const app = express()

mongoose.connection.once('open', function() {
  console.log('open')
  app.listen(3000, () => console.log('Runnig...'))
})

app.use(express.static(path.join(__dirname,'/public')))
app.use(express.static(path.join(__dirname,'/views')))
app.use('/bulma', express.static(path.join(__dirname,'/node_modules/bulma/css')))
app.use('/bulma-extensions', express.static(path.join(__dirname,'/node_modules/bulma-extensions/dist/')))
app.use('/bulma-carousel', express.static(path.join(__dirname,'/node_modules/bulma-extensions/bulma-carousel/dist/')))
app.use('/', routes)