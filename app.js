const express = require('express')
const mongoose = require('./database/config')
const routes = require('./routes')
const path = require('path')
const app = express()

const User = require('./models/User').User;

//Para poder acceder a los parámetros del cuerpo de las peticiones
const bodyParser = require('body-parser');
app.use(bodyParser.json()); //Para peticiones aplication/json
app.use(bodyParser.urlencoded({extended: true}));

//Usaremos pug para el renderizado de las vistas
app.set("view engine", "pug");

mongoose.connection.once('open', function() {
  console.log('open')
  app.listen(3000, () => console.log('Runnig...'))
})


app.get("/", function(req, res) {
	res.render("index.pug");
})

app.get("/signUp", function(req, res) {
	res.render("signUp.pug");
})

app.post("/newUser", function(req, res) {
	var user = new User({
		name: {first: req.body.name, last: req.body.lastName},
		password: req.body.password,
		dateOfBirth: req.body.dateOfBirth,
		email: req.body.email,
		passwordConfirmation: req.body.passwordConfirmation
	});

	user.save().then(function(userSaved) {
		res.send(userSaved);
	}).catch(function(err) {
		console.log(err.message);
		if(err.message.includes("E11000 duplicate key error collection"))
			res.send("El correo que tratas de registrar ya existe");
		else
			res.send("Hubo un problema al guardar el usuario");
	})
})

//Sólo para fines de pruebas
app.get("/allUsers", function(req, res) {
	User.find({}, function(err, users) {
		if(err) res.send("No se pueden ver todos los usuarios");

		res.send(users);
	})
})

app.use(express.static(path.join(__dirname,'/public')))
app.use(express.static(path.join(__dirname,'/views')))
app.use('/bulma', express.static(path.join(__dirname,'/node_modules/bulma/css')))
app.use('/bulma-extensions', express.static(path.join(__dirname,'/node_modules/bulma-extensions/dist/')))
app.use('/bulma-carousel', express.static(path.join(__dirname,'/node_modules/bulma-extensions/bulma-carousel/dist/')))
app.use('/', routes)