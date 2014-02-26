var Mongoose = require('mongoose');

var DeletesSchema = Mongoose.Schema({

// Common
  first_name : String,
  last_name : String,
  id : String
});

module.exports = Mongoose.model('Deletes', DeletesSchema);
