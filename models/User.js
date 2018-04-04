const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    age:  Number,
    email: String
})

const User = mongoose.model('User', userSchema)
module.exports = User
