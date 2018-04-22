const express = require('express')
const mongoose = require('./database/config')
const api = require('./api')
const path = require('path')
const app = express()
const md5 = require('md5');


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

// *************Use middlewares
app.use("/app", sessionMiddleware);
app.use("/app", routerApp);


app.use('/', api)


app.use(express.static(path.join(__dirname,'/public')))
app.use(express.static(path.join(__dirname,'/views')))
app.use('/bulma', express.static(path.join(__dirname,'/node_modules/bulma/css')))
app.use('/bulma-extensions', express.static(path.join(__dirname,'/node_modules/bulma-extensions/dist/')))
app.use('/bulma-carousel', express.static(path.join(__dirname,'/node_modules/bulma-extensions/bulma-carousel/dist/')))

