var Mongoose = require('mongoose');

var WatchSchema = Mongoose.Schema({
  img : String,
  brand : String,
  family : String,
  model : String,
  reference : String,
  serial : String,
  complications : [String]
});

module.exports = Mongoose.model('Watch', WatchSchema);
