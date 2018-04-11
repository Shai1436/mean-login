var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//TODO: Refactor user schema
var User = new Schema({
  username: String,
  password: String,
  email: String,
  firstName: String,
  lastName: String,
  facebook: {
  	id: String,
  	token: String,
  	name: String
  },

  google: {
  	id: String,
  	token: String,
  	name: String
  },
  totalSizeLimit: {type: Number, default: 3221225472},
  currentSize: {type: Number, default: 0}
});



module.exports = mongoose.model('User', User);
