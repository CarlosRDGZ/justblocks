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
  const child = spawn('Rscript', ['todo.R'/*,String(trt),String(b),String(k)*/])

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


//Pruebas de scripts para generar usuario etc
function getRandomInt(min, max) {return Math.floor(Math.random() * (max - min)) + min;}

let idAnnoun = '5b01d16ffc5ae925acfbce0f';
let t = 10, b = 5, k = 4

const Project = require('./models/project').Project;
const Evaluator = require('./models/evaluator').Evaluator;
let falseNames = [{"name":"Oliver","surname":"Teichmann","gender":"male","region":"Germany"},{"name":"Maila","surname":"Schulze","gender":"female","region":"Germany"},{"name":"Michael","surname":"Richter","gender":"male","region":"Germany"},{"name":"Annika","surname":"Schulze","gender":"female","region":"Germany"},{"name":"Linus","surname":"Bergmann","gender":"male","region":"Germany"},{"name":"Ben","surname":"Albrecht","gender":"male","region":"Germany"},{"name":"Oliver","surname":"Thiele","gender":"male","region":"Germany"},{"name":"Oliver","surname":"Heinrich","gender":"male","region":"Germany"},{"name":"John","surname":"Hartmann","gender":"male","region":"Germany"},{"name":"Lena","surname":"Schmidt","gender":"female","region":"Germany"},{"name":"Robert","surname":"Martin","gender":"male","region":"Germany"},{"name":"John","surname":"Schneider","gender":"male","region":"Germany"},{"name":"Ben","surname":"Friedrichs","gender":"male","region":"Germany"},{"name":"Ida","surname":"Kühn","gender":"female","region":"Germany"},{"name":"Ingo","surname":"Sommer","gender":"male","region":"Germany"},{"name":"Luise","surname":"Günther","gender":"female","region":"Germany"},{"name":"Mia","surname":"Berger","gender":"female","region":"Germany"},{"name":"Pia","surname":"Weiß","gender":"female","region":"Germany"},{"name":"Annabell","surname":"Beck","gender":"female","region":"Germany"},{"name":"Ann-Julie","surname":"Engel","gender":"female","region":"Germany"}];

app.get('/PRUEBAS/USER', (req, res) => {
  result = [];
  for (var i = 0; i < (b + t); i++) {
    console.log(falseNames[i]);
    var user = new User({
        name: {first: falseNames[i].name, last: falseNames[i].surname},
        password: "74b87337454200d4d33f80c4663dc5e5",//aaaa
        passwordConfirmation: "74b87337454200d4d33f80c4663dc5e5",
        dateOfBirth: new Date(1998, 2, 29),
        email: falseNames[i].name + falseNames[i].surname + "@ucol.mx",
      });

      user.save().then(function(userSaved) {
        result.push(userSaved);
      }).catch(function(err) {
        console.log(err.message);
        if(err.message.includes("E11000 duplicate key error collection"))
          res.json({err: "El correo que tratas de registrar ya existe"});
        else
          res.json({err: err.message/*"Hubo un problema al guardar el usuario"*/});
      })
  }
  res.json(result);
})

app.get('/PRUEBAS/EVALUATOR', (req, res) => {
  User.count({}, function(err, c) {
      if(err){console.log("USER ERROR"); console.log(err); res.status(500).json({err: err});}
      else
      {
        User.find({}, null, {skip: 1})
          .then(users => {
            users.forEach(current => {
              let evaluador = new Evaluator({
                idAnnouncement: idAnnoun,
                idUser: current._id,
                status: 1
              })
              //localhost:3000/api/evaluator/announcement/qualified/5afcffe37a3a6d36b4204a4e
              evaluador.save()
              .then(data => console.log("Evaluator create"))
              .catch(err => {console.log("EVALUATOR ERROR"); console.log(err); res.status(500).json({err: err});})
            })
          })
      }
      res.send('OK');
    })
})

app.get('/PRUEBAS/PROJECT', (req, res) => {
  User.find({}, null, {skip: 6, limit: 10}, (err, usersGot) => {
    usersGot.forEach((user, index) => {
      console.log(user);
      let project = new Project({
        idAnnouncement: idAnnoun,
        idCreator: user._id,
        description: "Éste es el proyecto no." + index,
        title: "Proyecto No. " + index,
      })
      project.save()
      .then(data => console.log(data))
      .catch(err => res.status(400).json(err))
    })
    res.send("OK");
  })
})
//Pruebas de scripts para generar usuario etc

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