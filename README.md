# Justblocks

### Modelos
  Esto es prupesta y debera ser revisada.
  Fecha: Wed 11 Apr 2018 12:10:35 AM CDT

- **General**
	Todos los modelos compartiran los atributos de este.
```javascript
{
	_id: { type: ObjectID, required: true },
	/* log */
	fechaModificación: { type: Date, required: true },
	usuarioModificó: { type: ObjectID, required: true }
}
```

- **Usuario**
```javascript
{
	nombre: { type: String, required: true },
	correo: { type: String, required: true },
	fechaNacimiento: { type: Date, required: true },
	token: String
}
```
- **Convocatoria**
```javascript
{
	/* Datos principales */
	idCreador: { type: ObjectID, required: true },
	fechaCreacion: { type: Date, required: true },
	fechaRegistro: { type: Date, required: true },
	fechaEvaluacion: { type: Date, required: true },
	fechaCierre: { type: Date, required: true },
	
	/* Datos particulares */
	cantEvaluadores: Number,
	proyectosPorEvaluador: Number,
	/* administradorMaster: se puede omitir */
	contenido: {
		type: String,
		required: false /* No recurdo esto */
	}
}
```
- **Documentos**
```javascript
{
	extension: { type: String, required: true },
	idParticipante: { type: ObjectID, required: true }
	/**
	   En lugar de idParticipante
	   no deveria ser idProyecto?
	**/
}
```
- **Proyecto**
```javascript
{
	idConvocatoria: { type: ObjectID, required: true },
	descripcion: String,
	/** Se deberia incluir calificacion **/
}
```

- **Participantes**
```javascript
{
	idUsuario: { type: ObjectID, required: true },
	proyecto: { type: ObjectID, required: true }
}
```
##### Pendiente
```
evaludarores {
	id_usuario:
	ids_proyectos:
}

administradores {
	id_usuario:
	convocatoria:
}
```
### Vistas
  En un archivo JSON estarán almacenadas las 9 convocatorias más recientes que seran las que
  se mostraran en la pagina principal (index).