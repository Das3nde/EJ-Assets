var Mongoose = require('mongoose');

var ContactSchema = Mongoose.Schema({
  email_work : String,
  email_home : String,
  email_other : String,
  first_name : String,
  last_name : String,
  phone : String,
  zip : String,
  mc_date_added : Date,
  mc_region : String,
  mc_leid : String,
  mc_euid : String
});

module.exports = Mongoose.model('Contact', ContactSchema);


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
