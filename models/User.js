var Mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = Mongoose.Schema({
  email : String,
  password : String
});

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = Mongoose.model('User', UserSchema);
