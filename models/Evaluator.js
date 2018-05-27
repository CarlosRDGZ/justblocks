const mongoose = require('mongoose')
const Schema = mongoose.Schema

const evaluatorSchema = new Schema({
  idAnnouncement: { type: Schema.Types.ObjectId, ref: 'Announcement' },
  idUser: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: Number, default: 0 }	//0: Enviado, 1: Aceptado, 2: Rechazado, 3: Suplente
})

const Evaluator = mongoose.model('Evaluator', evaluatorSchema)
module.exports.Evaluator = Evaluator