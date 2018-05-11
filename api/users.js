const users = require('express').Router()
const User = require('../models/User').User;
const ImageUser = require('../models/ImageUser').ImageUser;
const bodyParser = require('body-parser')
const fs = require('fs');
const formidable = require("express-form-data");

users.use(formidable.parse({keepExtensions: true}));

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
        // res.redirect(307, "/session/signIn");
        res.json(userSaved);
      }).catch(function(err) {
        console.log(err.message);
        if(err.message.includes("E11000 duplicate key error collection"))
          res.json({err: "El correo que tratas de registrar ya existe"});
        else
          res.json({err: err.message/*"Hubo un problema al guardar el usuario"*/});
      })
  })

users.route('/image/:idUser')
  .post((req, res) => {
    console.log("POST image user");
    var extension = req.files.image.name.split(".").pop();
    var image = new ImageUser({
      owner: req.params.idUser,
      extension: extension,
      typeFile: req.files.image.type
    });

    console.log(image);

    image.save(function(err) {
      if(!err) {
        fs.rename(req.files.image.path, "public/files/users/" + image._id + "." + extension );
        res.sendStatus(200);
      }
      else {
        console.log(err);
        res.status(500).json({err: err});
      }
    })
  })
  .get((req, res) => {
    console.log("GET IMAGE users");
    ImageUser.find({owner: req.params.idUser}, function(err, image) {
      if(!err) {
        res.status(200).json(image[0]);
        console.log(image[0]);
      }
      else {
        console.log(err);
        res.sendStatus(500);
      }

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