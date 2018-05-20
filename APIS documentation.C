/************************APIS documentation****************************/
//Nota: Para acceder a todas las rutas hay que acceder como /api/[Nombre de la api]
//En caso de error todas las apis devuelve un objecto {err: errMessage}
//+++++++Evaluator 
'/evaluator' //Funcionando bien
	POST: Registrar un evaluator
		params: idAnnoun, idUser, [status (inicia en 0 (enviado))]
	GET: Devuelve todos los evaluadores en el sistema
			{
		        status: 1,
		        _id: "5afd00f37ae72934f88294ba",
		        idAnnouncement: "5afcffe37a3a6d36b4204a4e",
		        idUser: {
		            name: {
		                first: "Oliver",
		                last: "Thiele"
		            },
		            _id: "5af8fe28b3a4a5373494fa8c",
		            email: "Oliver@ucol.mx"
		        },
		        __v: 0
		    }
'/evaluator/:id' //Funcionando bien
	PUT: Editar el estado de un evaluadores
		params: id (en la url), status en el body de la petición//0: Enviado, 1: Aceptado, 2: Rechazado, 3: De reserva (pero ya aceptado)
	GET: Devuelve el evaluador con ese id
		{
	        status: 1,
	        _id: "5afd00f37ae72934f88294ba",
	        idAnnouncement: "5afcffe37a3a6d36b4204a4e",
	        idUser: {
	            name: {
	                first: "Oliver",
	                last: "Thiele"
	            },
	            _id: "5af8fe28b3a4a5373494fa8c",
	            email: "Oliver@ucol.mx"
	        },
	        __v: 0
	    }
	DELETE: Elimina el evaludador con el id enviado
'/evaluator/announcement/:idAnnoun' //Funcionando bien
	GET: Devuelve todos los evaluadores de la convocatoria con ese id (incluido su status) y la 
	información del usuario (nombre, id y email)
		{
	        status: 1,
	        _id: "5afd00f37ae72934f88294ba",
	        idAnnouncement: "5afcffe37a3a6d36b4204a4e",
	        idUser: {
	            name: {
	                first: "Oliver",
	                last: "Thiele"
	            },
	            _id: "5af8fe28b3a4a5373494fa8c",
	            email: "Oliver@ucol.mx"
	        },
	        __v: 0
	    }
'/announcement/qualified/:idAnnoun' //Funcionando bien
	GET: Devuelve un array de los evaluadores de la convocatoria y otro array de la misma longitud con la
			cantidad de proyectos totales asignados a ese evaluador y los que lleva calificados
			projects (el número de proyectos asignados)
			qualified (el número de proyectos calificados). Ejemplo de json que devuelve
			{"allEvaluators":{
				status:	1
				_id: "5afa3b5382cfc102e8b8f672"
				idAnnouncement: "5af8fdd8b3a4a5373494fa7d"
				idUser: {
					name: {
						first:	"Oliver"
						last_	"Thiele"
					}	
					_id:	"5af8fe28b3a4a5373494fa8c"
					email:	"Oliver@ucol.mx"
				}
				__v: 0},
			"allEvaluatorProjects":{
				projects: 4,//La cantidad de proyectos que le tocan evaluar
				qualified: 4}}	//La cantidad de proyectos que ya evaluó
'/announcement/count/:idAnnoun' //Funcionando bien
	GET: Devuelve el número de evaluadores en esa convocatoria
		Ejemplo:
		{"evaluatorsAmount": 15}
'/announcement/asignedProject/:idAnnoun' //Funcionando bien
	GET: Devulve todos los evaluadores de la convocatoria con sus respectivos proyectos asignados,
		en un array devuelve los evaluadores, en otros sus respectivos proyectos ya ordenados
		{"evaluators": [
			{"status":1,"_id":"5afd00f37ae72934f88294ba","idAnnouncement":"5afcffe37a3a6d36b4204a4e",
				"idUser":{"name":{"first":"Oliver","last":"Thiele"},"_id":"5af8fe28b3a4a5373494fa8c","email":"Oliver@ucol.mx"},"__v":0}
			,{"status":1,"_id":"5afd00f37ae72934f88294bb","idAnnouncement":"5afcffe37a3a6d36b4204a4e",
				"idUser":{"name":{"first":"Linus","last":"Bergmann"},"_id":"5af8fe28b3a4a5373494fa8e","email":"Linus@ucol.mx"},"__v":0},
		"allEvaluatorProjects":[
			[{"index":0,"_id":"5afd01487ae72934f88294c9","idEvaluator":"5afd00f37ae72934f88294ba",
				"idProject":{"grade":2.9100203348479448,"_id":"5afd01057ae72934f88294c3","idAnnouncement":"5afcffe37a3a6d36b4204a4e","idCreator":"5af8fe28b3a4a5373494fa83","description":"Éste es el proyecto no.4","title":"Proyecto No. 4","score":10,"__v":0},"idAnnouncement":"5afcffe37a3a6d36b4204a4e","__v":0},
			{"index":1,"_id":"5afd01487ae72934f88294ca","idEvaluator":"5afd00f37ae72934f88294ba",
				"idProject":{"grade":2.1039498117494726,"_id":"5afd01057ae72934f88294c2","idAnnouncement":"5afcffe37a3a6d36b4204a4e","idCreator":"5af8fe28b3a4a5373494fa82","description":"Éste es el proyecto no.3","title":"Proyecto No. 3","score":10,"__v":0},"idAnnouncement":"5afcffe37a3a6d36b4204a4e","__v":0} ]]
'/:idEvaluator/qualify/:idProject'//Funcionando bien 
	PUT: Establece la calificación del proyecto con el id enviado, la calificación la recibe en el body
		de la petición como un json de la forma {grade: 8} y devuelve:
		{
		    "n": 1,
		    "nModified": 1,
		    "ok": 1
		}

//+++++++Announcement
'/possibleRsAndKs/:idAnnoun' //Funcionando bien
	GET: Devuelve todos los posibles valores de 'r' (Número de veces que un proyecto será evaluado), así
		como el valor que tomaría 'k' (número de proyectos por evaluador) en cada caso de 'r'. Ejemplo:
		{
			"projects":10,
			"evaluators":5,
			"possibleK":[2,4,6,8,10],
			"possibleR":[1,2,3,4,5]
		}
		Nota* Sólo se puede usar cuando se esté en la fecha de evaluación
'/image/:idAnnoun'
	GET: (Deprecated, la información de la imagen va en la convocatoria cuando se hace el get) Devuelve la información de la imagen de esa convocatoria. Ejemplo:
		{"_id":"5af8fdd8b3a4a5373494fa7e",
		"owner":"5af8fdd8b3a4a5373494fa7d",
		"extension":"jpg",
		"typeFile":"image/jpeg",
		"__v":0}
	POST: Dar de alta una nueva imagen, en el body de la petición debe de venir la imagen para que
			pueda ser obtenida de la siguiente forma -> req.files.image
	PUT: Actualiza la imagen de la convocatoria con ese id
	DELETE: Elimina la imgen de la convocatoria con ese id

//+++++++Project

