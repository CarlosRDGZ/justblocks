const express = require('express')
const mongoose = require('./database/config')
const api = require('./api')
const path = require('path')
const app = express()
const md5 = require('md5');

const URL = 'http://localhost:3000/'


//*************Manejo de sesiones
//MongoStore connect-mongo
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


//*************Middlewares
const routerApp = require("./routeApp");
const sessionMiddleware = require('./middlewares/session');//Para validar los usuarios

//*************Modelos
const User = require('./models/User').User;

//*************Para poder acceder a los parámetros del cuerpo de las peticiones
const bodyParser = require('body-parser');
app.use(bodyParser.json()); //Para peticiones aplication/json
app.use(bodyParser.urlencoded({extended: true}));

//*************Usaremos pug para el renderizado de las vistas
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
	const userReq = req.body
	const user = new User({userReq});

	user.save().then(function(userSaved) {
		//Lo logue si sí se pudo guardar el usuario
		// res.redirect(307, "/signIn");
		console.log(userSaved)
		req.session.user_id = userSaved.id
		res.redirect('/app')

	}).catch(function(err) {
		console.log(err.message);
		if(err.message.includes("E11000 duplicate key error collection"))
			res.json({err: "El correo que tratas de registrar ya existe"});
		else
			res.json({err: err.message/*"Hubo un problema al guardar el usuario"*/});
	})
})


app.post("/signIn", function(req, res) {
	//El email es único
	User.findOne({email: req.body.email}, function(err, user) {
		if(!err) {
			if(user) {
				if(user.password == md5(req.body.password)) {
					req.session.user_id = user._id;
					res.json({success: "success"});
				} 
				else {
					console.log("Las contraseñas no coinciden");
					res.json({err: "Las contraseñas no coinciden"});
				}
			}
			else {
				console.log("El correo enviado todavía no está registrado");
				res.json({err: "El correo enviado todavía no está registrado"}).status(404);		
			}
		}
		else {
			console.log(err);
			res.json({err: "Ocurrió un error al conectarse con la base de datos"});
		}
	})
})

//*************Sólo para fines de pruebas
app.get("/allUsers", function(req, res) {
	User.find({}, function(err, users) {
		if(err) res.send("No se pueden ver todos los usuarios");

		res.send(users);
	})
})
app.get("/deleteAllUsers", function(req, res) {
	User.collection.drop().then(res.send("Usuarios eliminados")).catch(function(err) {console.log(err);});
})

// *************Use middlewares
app.use("/app", sessionMiddleware);
app.use("/app", routerApp);

app.use(express.static(path.join(__dirname,'/public')))
app.use(express.static(path.join(__dirname,'/views')))
app.use('/bulma', express.static(path.join(__dirname,'/node_modules/bulma/css')))
app.use('/bulma-extensions', express.static(path.join(__dirname,'/node_modules/bulma-extensions/dist/')))
app.use('/bulma-carousel', express.static(path.join(__dirname,'/node_modules/bulma-extensions/bulma-carousel/dist/')))
app.use('/', api)

