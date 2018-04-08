const express = require('express')
const mongoose = require('./database/config')
const routes = require('./routes')
const path = require('path')
const app = express()
const md5 = require('md5');


//Manejo de sesiones
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const sessionRedisMiddleware = session({
	//se envían como parámetros el puerto y el password para conectarse con Redis
	//Pero como se manejan valores por default no se pasa nada
	store: new RedisStore({}),
	//Para encriptar la información
	secret: "super ultra secret word"
})
app.use(sessionRedisMiddleware)


//middlewares
const routerApp = require("./routeApp");
const sessionMiddleware = require('./middlewares/session');//Para validar los usuarios

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


app.post("/signIn", function(req, res) {
	User.findOne({email: req.body.email}, function(err, user) {
		if(user && !err) {
			if(user.password == md5(req.body.password)) {
				req.session.user_id = user._id;
				res.redirect("/app");
			} 
			else {
				console.log("Las contraseñas no coinciden");
				res.render("index");
			}
		}
		else {
			console.log("El correo enviado todavía no está registrado");
			res.render("index");		
		}
	})
})


//Sólo para fines de pruebas
app.get("/allUsers", function(req, res) {
	User.find({}, function(err, users) {
		if(err) res.send("No se pueden ver todos los usuarios");

		res.send(users);
	})
})

app.use("/app", sessionMiddleware);
app.use("/app", routerApp);

app.use(express.static(path.join(__dirname,'/public')))
app.use(express.static(path.join(__dirname,'/views')))
app.use('/bulma', express.static(path.join(__dirname,'/node_modules/bulma/css')))
app.use('/bulma-extensions', express.static(path.join(__dirname,'/node_modules/bulma-extensions/dist/')))
app.use('/bulma-carousel', express.static(path.join(__dirname,'/node_modules/bulma-extensions/bulma-carousel/dist/')))
app.use('/', routes)

