var Mongoose = require('mongoose');

var MCMemberSchema = Mongoose.Schema({
  email : String,
  first_name : String,
  last_name : String,
  location : String,
  confirm_time : Date,
  last_changed : Date,
  leid : String,
  euid : String
});

module.exports = Mongoose.model('MCMember', MCMemberSchema);


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
