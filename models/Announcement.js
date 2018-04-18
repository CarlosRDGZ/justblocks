const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const announcementSchema = new Schema({
	idCreator: {type: Schema.Types.ObjectId, ref: "User"},
	creationDate: {type: Date, required: true},
	evaluationDate: {type: Date, required: true},
	deadlineDate: {type: Date, required: true},
	evaluatorsAmount: {type: Number, default: 0},
	projectsByEvaluator: {type: Number, default: 0},
	content: {type: String}
})

var Announcement = mongoose.model('Announcement', announcementSchema);
module.exports.Announcement = Announcement;