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
'/:idEvaluator/projects' //Funcionando bien
	GET: Devuelve todos los proyectos asignados a ese evaluador
		{
	        "grade": 9,
	        "index": 0,
	        "_id": "5b01f48a643bc907188410e8",
	        "idEvaluator": "5b01d49f6d2c310404563293",
	        "idProject": {
	            "_id": "5b01f18c8d6db70338ca5c31",
	            "description": "Éste es el proyecto no.0",
	            "title": "Proyecto No. 0"
	        },
	        "idAnnouncement": "5b01d16ffc5ae925acfbce0f",
	        "__v": 0
	    },
	    
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
'/image/:idAnnoun' //Funcionando bien
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
'/R/projectsAssign/:idAnnoun' //Funcionando bien
	GET: Calcula el promedio ajustado de todos los proyectos de la convocatoria enviada, además
		muestran el grupo al que pertenecen porque algunos promedios son estadísticamente iguales entre sí
		y lo guarda en la base de datos. El modelo de Project ahora tiene los campos de mean, adjustedGrade y group
'/abiertas' //Funcionando bien
	GET: Devuelve todas las convocatorias que tengan fecha de evaluación mayor a la fecha actual, es decir, 
		todas las que están abiertas y a las que los usuarios se pueden registrar todavía.
		Devuelve un array de convocatorias  
'/terminadas' //Funcionando bien
	GET: Devuelve todas las convocatorias que tengan 'deadlineDead' menor o igual 
		a la fecha actual, es decir, que ya hayan sido cerradas y terminadas
		Devuelve un array de convocatorias
'/search/:str' //Funcionando bien
	GET: Devuelve un array de convocatorias que incluyan en su título la cadena enviada.
		No importa en donde aparezca la cadena, principio, en medio o al final

//+++++++Project
'/projectsEvaluator/:idProject' //Funcionando bien
	GET: Devuelve toda la información de ese proyecto con respecto a la evaluación que le dieron, 
		es decir, la cantidad de veces que va a ser evaluado (con el id del evaluador de cada uno)
		{
	        grade: 5,
	        index: 5,
	        _id: "5afd140c44b82a2a5cbce1be",
	        idEvaluator: "5afd00f37ae72934f88294bb",
	        idProject: "5afd01057ae72934f88294bf",
	        idAnnouncement: "5afcffe37a3a6d36b4204a4e",
	        __v: 0
	    }
'/calculateNormalMean/:idAnnoun' //Funcionando bien
	GET: Calcula todos los promedios normales de todos los proyectos de esa convocatoria, en caso de que todavía
		falte por calificar algún proyecto regresará un error con un json con los ids de los proyectos que faltan.
		Asímismo establecerá la propiedad mean de esos proyectos con lo resultante y devulve un status 200 si todo sale bien
'/adjustedGrades/:idAnnoun' //Funcionando bien
	GET: Calcula los promedios ajustados de todos los proyectos de esa convocatoria y los guarda en la base
		de datos, además de que les asigna también al grupo al que pertenecen si es que se encontraron
		algunos que sean estadísticamente iguales entre sí y devuelve la información en este formato y ordenados
		como los proyectos están ordenados en la base de datos tras cada consulta
		Nota: Esto es sólo para prueba en realidad será cosa interna del servidor esta parte, nunca se
		podrá llamar al API 
		{
	        adjustedGrade: 6.266,
	        index: 0,
	        group: "  23 "
	    }
'/winners/:idAnnoun' //Funcionando bien
	GET: Devuelve los proyectos con las calificaciones estadísticamente iguales de los tres primeros grupos, es decir
		los ganadores de la convocatoria y en un último arreglo el resto de los participantes (los que no ganaron). 
		Los devuelve en 4 arreglos diferentes. Devuelvo proyectos como tal pero ya ordenados por
		grupo. Ejmplo del json de un proyecto devuelto
		{
            mean 6,
            adjustedGrade: 6.9087,
            group: "12",
            _id: "5b01f18c8d6db70338ca5c33",
            idAnnouncement: "5b01d16ffc5ae925acfbce0f",
            idCreator: "5b01d505f75b231fd877932a",
            description: "Éste es el proyecto no.2",
            title: "Proyecto No. 2",
            __v: 0
        }
'/documents/:idProject' //Funcionando bien, falta validar que sólo lo suban participantes 
	POST: Subir un nuevo documento para ese proyecto (el documento lo podrá ver el evaluador)
		Nota: En el FormData el archivo deberá ser eviado como document
				    formData.append('document', documentFile.files[0])
		{
		    owner: "5b01f18c8d6db70338ca5c31",
		    extension: "pdf",
		    typeFile: "application/pdf",
		    name: "Digital Booklet - El Círculo",
		    _id: "5b04d2e37a06920480d84641",
		    __v: 0
		}
	GET: Devulve todos los documentos de ese proyecto con un json con el formato de arriba.
	DELETE: Elimina todos los documentos de ese proyecto
'/qualify/:idProject'//Funcionando bien 
	PUT: Establece la calificación del proyecto con el id enviado, la calificación la recibe en el body
		de la petición como un json de la forma {grade: 8} y devuelve un json con el formato de proyecto
'/:idProject/status'//Funcionando bien
	PUT: (Para administradores de la convocatoria) Actualiza el status del proyecto y lo devulve.
		Los status posibles son 0: Enviado, 1: Aceptado y 2: Rechazado

//+++++++User
'/email/:email' //Funcionando bien
	GET: Devuelve el nombre y el id del usuario con ese correo electrónico