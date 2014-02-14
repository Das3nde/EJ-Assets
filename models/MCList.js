var Mongoose = require('mongoose');
var MCMemberSchema = require('MCMember.js').MCMemberSchema;

var MCListSchema = Mongoose.Schema({
  id : String,
  web_id : String,
  name : String,
  date_created : Date,
  email_type_option : Boolean,
  use_awsomebar : Boolean,
  default_from_name : String,
  default_from_email : String,
  default_subject : String,
  default_language : String,
  list_rating : Number,
  subscribe_url_short : String,
  subscribe_url_long : String,
  beamer_address : String,
  visibility : String,
  members : [MCMemberSchema]
});

module.exports = Mongoose.model('MCList', MCListSchema);


/**************************************
 * For dev reference later
 **************************************/

/*
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = Mongoose.model('User', UserSchema);
*/
