var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = new Schema({ 
	owner: {type: Schema.Types.ObjectId, ref: "User"},
	checked: {type: Boolean, default: false},
	title: {type: String, required: true},
	url: {type: String, required: true}
});

var Notification = mongoose.model("Notification", notificationSchema);
module.exports.Notification = Notification;