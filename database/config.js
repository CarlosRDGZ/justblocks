const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/justblocks')
mongoose.connection.on('error',
  console.error.bind(console, 'MongoDB connection error:'));

module.exports = mongoose;