const express = require('express')
const mongoose = require('./database/config')
const routes = require('./routes')
const path = require('path')
const md5 = require('md5');
const app = express()
global.gUrl = 'http://127.0.0.1:3000/'
global.gRootDir = path.resolve(__dirname)
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
const projectsEvaluator = require('./models/projectsEvaluator').ProjectsEvaluator;


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
let t = 10, b = 5, k = 3

const Project = require('./models/Project').Project;
const Evaluator = require('./models/Evaluator').Evaluator
//const Evaluator = require('./models/evaluator').Evaluator;
let falseNames = [{"first": "Lana", "last": "Julien", }, {"first": "Alexandre", "last": "Brunet", }, {"first": "Elsa", "last": "Poirier", }, {"first": "Marc", "last": "Lamy", }, {"first": "Mila", "last": "Simon", }, {"first": "Florentin", "last": "Robert", }, {"first": "Adrian", "last": "Baron", }, {"first": "Anna", "last": "Menard", }, {"first": "Dylan", "last": "Roy", }, {"first": "Robin", "last": "Dupuy", }, {"first": "Colin", "last": "Bailly", }, {"first": "Alexandre", "last": "Antoine", }, {"first": "Pauline", "last": "Gaillard", }, {"first": "Clément", "last": "Andre", }, {"first": "Mateo Le", "last": "gall", }, {"first": "Brandon", "last": "Germain", }, {"first": "Clara", "last": "Hamon", }, {"first": "Florian", "last": "Bertin", }, {"first": "Jasmine", "last": "Baron", }, {"first": "Martin", "last": "Bertrand", }, {"first": "Manon", "last": "Renaud", }, {"first": "Jeanne", "last": "Boyer", }, {"first": "Florentin", "last": "Lamy", }, {"first": "Amandine", "last": "Jacquet", }, {"first": "Yüna", "last": "Monnier", }, {"first": "Arthur", "last": "Gilbert", }, {"first": "Lamia", "last": "Besson", }, {"first": "Ambre", "last": "Roussel", }, {"first": "Antoine", "last": "Antoine", }, {"first": "Julie", "last": "Giraud", }, {"first": "Marion", "last": "Philippe", }, {"first": "Loevan", "last": "Gilbert", }, {"first": "Florian", "last": "Mercier", }, {"first": "Mathilde", "last": "Garcia", }, {"first": "Françoise", "last": "Denis", }, {"first": "Zacharis", "last": "Besson", }, {"first": "Ethan", "last": "Garcia", }, {"first": "Yohan", "last": "Fleury", }, {"first": "Candice", "last": "Denis", }, {"first": "Loevan Le", "last": "roux", }, {"first": "Adam", "last": "Rousseau", }, {"first": "Lamia Le", "last": "gall", }, {"first": "Lilian", "last": "Etienne", }, {"first": "Léane", "last": "Antoine", }, {"first": "Titouan", "last": "Giraud", }, {"first": "Zoé", "last": "Petit", }, {"first": "Mathilde", "last": "Bébert", }, {"first": "Guillaume Le", "last": "goff", }, {"first": "Julia", "last": "Leclerc", }, {"first": "Léa", "last": "Jean", }, {"first": "Lou", "last": "Hubert", }, {"first": "Timothée", "last": "Marchal", }, {"first": "Françoise", "last": "Gilbert", }, {"first": "Léonard", "last": "Lemoine", }, {"first": "Alexandre", "last": "Guerin", }, {"first": "Marie-léontine", "last": "Hamon", }, {"first": "Amélie", "last": "Martin", }, {"first": "Jade", "last": "Marie", }, {"first": "Gabin", "last": "Girard", }, {"first": "Salomé", "last": "Rodriguez", }, {"first": "Loevan", "last": "Noel", }, {"first": "Antonin", "last": "Carpentier", }, {"first": "Gilbert", "last": "Deschamps", }, {"first": "Alexis", "last": "Millet", }, {"first": "Martin", "last": "Andre", }, {"first": "Antonin", "last": "Gauthier", }, {"first": "Capucine", "last": "Hamon", }, {"first": "Lauriane", "last": "Clement", }, {"first": "Amandine", "last": "Deschamps", }, {"first": "Edwige", "last": "Deschamps", }, {"first": "Clémence", "last": "Tessier", }, {"first": "Jérémy", "last": "Andre", }, {"first": "Chaïma", "last": "Fleury", }, {"first": "Ambre", "last": "Jacquet", }, {"first": "Maïwenn", "last": "Lecomte", }, {"first": "Pierre", "last": "Rousseau", }, {"first": "Clémence", "last": "Leveque", }, {"first": "Jérémy", "last": "Laporte", }, {"first": "Félix", "last": "Tessier", }, {"first": "Romane", "last": "Leclercq", }, {"first": "Cloé", "last": "Leclerc", }, {"first": "Mohamed", "last": "Lopez", }, {"first": "Titouan", "last": "Lambert", }, {"first": "Yüna", "last": "Lamy", }, {"first": "Maïwenn", "last": "Poulain", }, {"first": "Éléna", "last": "Leclerc", }, {"first": "Inès", "last": "Lemoine", }, {"first": "Paul", "last": "Fontaine", }, {"first": "Lucie", "last": "Nicolas", }, {"first": "Marie-léontine", "last": "Daniel", }, {"first": "Yohan", "last": "Legrand", }, {"first": "Nolan", "last": "Robert", }, {"first": "Titouan", "last": "Berger", }, {"first": "Mélissa", "last": "Leveque", }, {"first": "Louise", "last": "Rousseau", }, {"first": "Lamia", "last": "Leclerc", }, {"first": "Thibault", "last": "Mercier", }, {"first": "Marie-léontine", "last": "Rey", }, {"first": "Lina", "last": "Carpentier", }, {"first": "Lilou", "last": "Caron", } ];

app.get('/PRUEBAS/USER', (req, res) => {
  generateUsers(t + b + 1);
  res.send(200);
})

function generateUsers(amount) {
  for (var i = 0; i < amount; i++) {
    var user = new User({
        name: falseNames[i],
        password: "74b87337454200d4d33f80c4663dc5e5",//aaaa
        passwordConfirmation: "74b87337454200d4d33f80c4663dc5e5",
        dateOfBirth: new Date(1998, getRandomInt(0, 11), 29),
        email: `${falseNames[i].first}-${getRandomInt(0, 100)}@ucol.mx`
      });

      user.save().then(function(userSaved) {
        console.log("User ", i);
      }).catch(function(err) {
        console.log(err.message);
        console.log(`${falseNames[i].first}-${getRandomInt(0, 100)}@ucol.mx`);
      })
  }
}

app.get('/PRUEBAS/EVALUATOR', (req, res) => {
  User.count({}, function(err, c) {
      if(err){console.log("USER ERROR"); console.log(err); res.status(500).json({err: err});}
      else
      {//Agarra de los últimos usuarios
        User.find({}, null, {skip: 11})
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
  User.find({}, null, {skip: 1, limit: 10}, (err, usersGot) => {
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

app.get('/PRUEBAS/QUALIFY/:idAnnoun', (req, res) => {
  projectsEvaluator.find({idAnnouncement: req.params.idAnnoun})
    .then(projs => {
      projs.forEach(pro => {
        pro.grade = getRandomInt(0, 11);
        // pro.grade = -1;
        pro.save()
          .then(res => {
            console.log("Calificado");
          })
          .catch(err => res.json({err: err.message}))
      })
    })
    .catch(err => {console.log(err.message); res.json({err: err.message});})
})

app.get('/deleteAllUSer', (req, res) => {
  User.deleteMany({_id: {$not: {$eq: '5b01d106fc5ae925acfbce0d'}}})
    .then(result => {
      res.json(result);
    })
    .catch(err => {console.log(err); res.json({err: err.message});})
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
app.use('/tables', express.static(path.join(__dirname, '/node_modules/vue-tables-2/dist/')))
app.use('/pagination', express.static(path.join(__dirname, '/node_modules/vue-pagination-2/dist/')))
app.use('/axios', express.static(path.join(__dirname, '/node_modules/axios/dist/')))
app.use('/', routes)