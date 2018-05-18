const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const announcementSchema = new Schema({
	idCreator: {type: Schema.Types.ObjectId, ref: "User" },
	title: { type: String, required: true },
	author: { type: String, required: true },
	creationDate: { type: Date, /*required: true*/ },
	endEnrollmentsDate: { type: Date, /*required: true*/ }, // agregue este
	evaluationDate: { type: Date,/* required: true*/ },
	deadlineDate: { type: Date, /*required: true*/ },
	evaluators: { type: Number, default: 0 },
	projectsPerEvaluator: { type: Number, default: 0 },
	content: { type: String },
	prize: { type: String },
	image: { type: String } //path
})

const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports.Announcement = Announcement;