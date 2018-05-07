var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageUserSchema = new Schema({ 
	owner: {type: Schema.Types.ObjectId, ref: "User"},
	extension: {type: String, required: true},
	typeFile: {type: String, required: true}
});

var ImageUser = mongoose.model("ImageUser", imageUserSchema);

module.exports.ImageUser = ImageUser;