var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileAnnouncementSchema = new Schema({ 
	owner: {type: Schema.Types.ObjectId, ref: "Announcement"},
	extension: {type: String, required: true}
	typeFile: {type: String, required: true}
});

var FileAnnouncement = mongoose.model("FileAnnouncement", fileAnnouncementSchema);

module.exports.FileAnnouncement = FileAnnouncement;