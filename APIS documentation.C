/************************APIS documentation****************************/
//Nota: Para acceder a todas las rutas hay que acceder como /api/[Nombre de la api]

//Evaluator
'/evaluator'
	POST: Registrar un evaluator
		params: idAnnoun, idUser, [status (inicia en 0 (enviado))]
	GET: Devuelve todos los evaluadores en el sistema
'/evaluator/:id'
	PUT: Editar el estado de un evaluadores
		params: id (en la url), status en el body de la petición//0: Enviado, 1: Aceptado, 2: Rechazado
	GET: Devuelve el evaluador con ese id
	DELETE: Elimina el evaludador con el id enviado
'/evaluator/announcement/:idAnnoun'
	GET: Devuelve todos los evaluadores de la convocatoria con ese id (incluido su status)
'/announcement/qualified/:idAnnoun'
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
				"projects":4,//La cantidad de proyectos que le tocan evaluar
				"qualified":4}}	//La cantidad de proyectos que ya evalu
'/announcement/count/:idAnnoun'
	GET: Devuelve el número de evaluadores en esa convocatoria
		Ejemplo
		{"evaluatorsAmount": 15}
//Announcement
'/possibleK/:idAnnoun'
	GET: Devulve todos los posibles valores de k para que el modelo funcione con el número de proyectos
			registrados y el número de evaluadores registrados. Si la fecha de evaluación es menor a la 
			fecha actual devolverá un error
