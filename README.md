# Justblocks

## Modelos

- **Usuario**
```javascript
Usuario {
	_id: ObjectID 
	nombre: { type: String, required: true },
	correo: { type: String, required: true },
	fechaNacimiento: { type: Date, required: true },
	token: String
}
```