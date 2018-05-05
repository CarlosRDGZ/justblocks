const users = require('express').Router()
const User = require('../models/User').User;
const bodyParser = require('body-parser')

users.use(bodyParser.urlencoded({ extended: true }))
users.use(bodyParser.json())

users.route('/')
  .get((req,res) => {
    User.find({}, (err, users) => {
      if (err)
        res.sendStatus(400)
      else
        res.json(users)
    })
  })
  .post((req,res) => {
      var user = new User({
        name: {first: req.body.name, last: req.body.lastName},
        password: req.body.password,
        dateOfBirth: req.body.dateOfBirth,
        email: req.body.email,
        passwordConfirmation: req.body.passwordConfirmation
      });

      user.save().then(function(userSaved) {
        //Lo logue si sí se pudo guardar el usuario
        res.redirect(307, "/session/signIn");

      }).catch(function(err) {
        console.log(err.message);
        if(err.message.includes("E11000 duplicate key error collection"))
          res.json({err: "El correo que tratas de registrar ya existe"});
        else
          res.json({err: err.message/*"Hubo un problema al guardar el usuario"*/});
      })
  })

users.route('/:id')
  .get((req,res) => {
    User.find({_id: req.params.id}, function (err, user) {
      if(err) {res.sendStatus(500).json({err: err.message});}
      else
        res.status(200).json(user);
    })
  })

users.route('/:id/name')
  .get((req, res) => {
    User.find({_id: req.params.id}, 'name', function (err, user) {
      if(err) {res.sendStatus(500).json({err: err.message});}
      else
        res.status(200).json(user);
    })
  })

//*************Sólo para fines de pruebas
users.get("/deleteAllUsers", function(req, res) {
    console.log("deleteAllUsers");

  User.collection.drop().then(res.send("Usuarios eliminados")).catch(function(err) {console.log(err);});
})

module.exports = users;