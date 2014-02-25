var Mongoose = require('mongoose');

var ContactSchema = Mongoose.Schema({
  email : String,
  first_name : String,
  last_name : String,
  phone : String,
  zip : String,
  mc_date_added : Date
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
