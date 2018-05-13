const express = require('express')
const mongoose = require('./database/config')
const routes = require('./routes')
const path = require('path')
const md5 = require('md5');
const app = express()
global.gUrl = 'http://127.0.0.1:3000/'
// global.openSession = false
// global.userSession = { _id: '5ad7b0e28380150835d775bf' }

//*************Manejo de sesiones
//MongoStore connect-mongo
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const sessionRedisMiddleware = session({
	//se envían como parámetros el puerto y el password para conectarse con Redis
	//Pero como se manejan valores por default no se pasa nada
	store: new RedisStore({}),
	//Para encriptar la información
	secret: "super ultra secret word",
	resave: false,
	saveUninitialized: true
})
app.use(sessionRedisMiddleware)

// Add headers
app.use(function (req, res, next) {
	//A veces el servidor tenía problemas con los recursos y no te dejaba entrar, éste middleware es la solución
	//Documentación: https://developer.mozilla.org/es/docs/Web/HTTP/Access_control_CORS
	//Solución: https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

//*************Middlewares
const routerApp = require("./routeApp");
const sessionMiddleware = require('./middlewares/session');//Para validar los usuarios
const navBarMiddleware = require('./middlewares/navBarMiddleware');//Para validar los usuarios

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
  app.listen(3000, () => console.log('Listening...'))
})

app.get('/convocatoria', (req, res) => {
  res.status(200).sendFile('convocatoria.html', { root: './public' })
})

//Pruebas de R
app.get('/R', (req, res) => {
  const { spawn } = require('child_process');
  let trt = 10
  let b = 5
  let k = 4
  const child = spawn('Rscript', ['projectsAssign.R',String(trt),String(b),String(k)])

  let out = ''
  let err = ''
  child.stdout.on('data', (chunk) => {
    out += chunk
  });

  child.stderr.on('data', (chunk) => {
    err += chunk
  })

  child.on('close', (code) => {
    if (err) console.log('STDERR:\n', err)
    res.json(JSON.parse(out.toString()))
    // res.send(out.toString())
    console.log(out.toString())
    console.log(`child process exited with code ${code}`);
  })
})
//Pruebas de R

// *************Use middlewares
app.use("/app", sessionMiddleware);
app.use("/app", navBarMiddleware);
app.use("/app", routerApp);

app.use(express.static(path.join(__dirname,'/public')))
app.use(express.static(path.join(__dirname,'/views')))
app.use('/bulma', express.static(path.join(__dirname,'/node_modules/bulma/css')))
app.use('/bulma-extensions', express.static(path.join(__dirname,'/node_modules/bulma-extensions/dist/')))
app.use('/bulma-carousel', express.static(path.join(__dirname,'/node_modules/bulma-extensions/bulma-carousel/dist')))

app.use('/vue', express.static(path.join(__dirname, '/node_modules/vue/dist/')))
app.use('/axios', express.static(path.join(__dirname, '/node_modules/axios/dist/')))
app.use('/', routes)