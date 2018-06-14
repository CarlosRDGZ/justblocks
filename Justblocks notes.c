//Pruebas ids
Announcement: "5b01d16ffc5ae925acfbce0f"
administrador (correo: "bmosqueda@ucol.mx", pass: "qwe"): "5b01d106fc5ae925acfbce0d"
Para assignar k y luego hacer la asignación, ver el progreso de las calificaciones (admin), para después calcular
lo promedios, normal y ajustado: 'http://127.0.0.1:3000/app/announcement/projectsPerEvaluator/5b01d16ffc5ae925acfbce0f'

  
evaluador ("evaluator1@ucol.mx", pass: "aaaa"): idEvaluador: "5b21d30e21bbd800dced5170"
Para ver los proyectos que le toca evaluar: 'http://127.0.0.1:3000/announcement/view/evaluator/5b01d16ffc5ae925acfbce0f'
(primeros los tienes que asignar con la cuenta de administrador)


proyecto: "5b21d2fe21bbd800dced5169", creadorProyecto: {_id: '5b209b1749c3e90e7c0faf34', email: 'project@ucol.mx', pass: 'aaaa'}
Para administrar un proyecto (agregar participantes y documentos):'http://127.0.0.1:3000/project/admin/5b21d2fe21bbd800dced5169'
//En todo puedes jugar con las fechas de la convocatoria para que te aparezcan las opciones









partakers: {
  idPartaker1: "5b11e35713785e104026c6df",
  idPartaker2: "5b11e42913785e104026c6e0",
  idPartaker3: "5b11e45813785e104026c6e1"
}

L = str(anova) //PAra saber qué se puede extraer de las funciones
L$pvalue	//SAcamo el va lor de pvalue obtenido
Código Enigma pelícla
66	111	98	98	121

//***************Opciones
- La cantidad de proyectos por evaluador no la debemos de pedir cuando se crea sino cuando llega la fecha de evauación
	entonces, será necesario pedírsela al administrador para que la defina.
	Una vez definida y validado que el modelo funciona con esos datos se realiza la asignación de proyectos a los evaluadores
- En el servidor debemos de tener una condición, si la fecha de evaluación ya llegó le tenemos que mostrar una vista
	en donde le sugiramos una k y le pidamos que defina una para que se pueda seguir con la convocatoria
- En caso de que no funcione el modelo con esos datos, darle la opción de disminuir el número de evaluadores y volver 
	a calcular las K donde sí funcione el modelo.
- Si nunguna de las k lo convence podemos ofrecer la opción de sólo mostrar los promedios normales y con base
	a ellos se haga la premiación porque no se pudo encontrar la k ideal.

- Como nostros ya tendremos el número de proyectos (t) y el número de evaluadores (b), es más fácil 
	pedirle al administrador el número de veces que quiere que sea evaluado cada proyecto (r) que el
	número de proyectos por evaluador (k) debido a:
	k = (r * t) / b
	Podemos pedirle r y mostrarle el número de proyectos que le tocaría a cada evaluador y en caso de que
	le parezcan muchos proyectos pues que vuelva a cambiar r hasta que encuentre lo que más se ajuste a sus necesidades
- Se le podría permitir al administrador elegir el número de grupos de ganadores que hará y mandárselo a R para que lo haga así

//***************Otros
- Módulo para registro de evaluadores y acpetación de los mismos
- Mostrar en el home del usuario todas sus convocatorias separadas por el rol que desempeña en cada una,
  desde las que administra, en las que es participante y en las que es evaluador
- Hacer la vista de búsqueda de las convocatorias

//***************Cambios código
- Modelo de archivos de la convocatoria que puedan agregar los usuarios enrrolados como participantes para que suban archivos al proyeto
- Invetigar cómo hacer búsquedas condicionales con mongooses
- agregar la vista de proyecto, para poder subir archivos, y los compañeros


//***************Notificaciones
- Como sólo le van a aparecer las notificaciones que todavía no ha atendido mostrar la opción de ver todas
- Cuando le dé click a una notificación mandar la solicitud al api y ponerle como vista


//***************Calcular R y K
//Consideraciones
r >= 2
((r * t) / b) <= t
si el valor de k es con decimales la cantidad de apariciones de cada proyecto será igual a r - 1, no a r
k < t

// trt: An integer > 1 giving the number of treatments of the design.
// b: An integer > 1 giving the number of rows (subjects) of the design.
// k: An integer > 1 giving the number of columns (periods) of the design.

t = 17
b = 11
k = []
r = []


function getRs() {
	for(let i = 1; i < t; i++) {
		let tempK = i * t / b;
		if( tempK <= t) {//K nunca puede ser mayor a t
			r.push(i);
			k.push(tempK);
		}
		else {
			break;
		}
	}
}

function printArray(array) {
	array.forEach(value => {
		console.log(value);
	})
}

/*Cuando se implemente lo de designar k en el lado del cliente se le muestran todas las k posibles despues
de haberlas calculado en base a las R, además tendrá la opción de disminuir k para que se le generen nuevas r
y decida con cuál k se queda, en lugar de que se haga automático mejor que los proyectos se asignen
una vez llegada la fecha de evaluación y que el administrador haya designado k, pero que hasta ese moment se haga*/









/*POR si algún día se ocupa, Api announcements
//******************Eliminar después, esto no funciona
announcements.get('/possibleK/:idAnnoun', (req, res) => {
  console.log('Get possibleK');
  Announcement.findById(req.params.idAnnoun)
    .then(announ => {
      let today = new Date();
      //ya no está en la etapa de registro
      if(announ.evaluationDate <= today) {
        getPossibleK(req.params.idAnnoun).
          then(result => {
            res.json(result); 
          })
          .catch(err => {console.log("Announcement error"); console.log(err.message); res.status(500).json({err: err.message});})
      }
      else {
        console.log("Fecha de evaluación mayor a la actual"); 
        res.status(403).json({err: 'La fecha de evaluación todavía no ha llegado'});
      }
    })
    .catch(err => {console.log("Announcement error"); console.log(err.message); res.status(500).json({err: err.message});})
})

//No funciona, en caso de encontrar la condición correcta, corregir
//The necessary conditions for the existence are that bk/trt and bk(k−1)/(trt(trt−1)) positive integers.
function getPossibleK(idAnnoun) {
  return new Promise((resolve, reject) => {
    let trtCount = 100
    let blocksCount = 30
    let ks = []
    Project.count({idAnnouncement: idAnnoun})
      .then(projectNumber => {
        // trtCount = projectNumber; console.log("trtCount: " + trtCount);
        Evaluator.count({idAnnouncement: idAnnoun})
          .then(evaluatorNumber => {
            // blocksCount = evaluatorNumber; 
            console.log("blocksCount: " + blocksCount);
            for (let i = 1; i <= blocksCount; i++) {
              let condition1 = (blocksCount * i) / trtCount;
              console.log("condition1: " + condition1)
              let condition2 = (blocksCount * i * (i - 1)) / (trtCount * (trtCount - 1))
              console.log("condition2: " + condition2)
              //Enteros positivos
              if(condition1 > 0 && condition1 % 1 == 0 && condition2 > 0 && condition2 % 1 == 0)  {
                ks.push(i);
                console.log("DENTRO: ", i)
              }
            }
            console.log(ks);
            resolve({
              projects: trtCount,
              evaluators: blocksCount,
              possibleK: ks
            });
          })
          .catch(err => {console.log("Project error"); console.log(err.message); reject({err: err.message})})
      })
    .catch(err => {console.log("Project error"); console.log(err.message); reject({err: err.message})})
  })
}
*/