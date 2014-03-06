var Mongoose = require('mongoose');

var WatchSchema = Mongoose.Schema({
  img : String,
  brand : String,
  family : String,
  model : String,
  reference : String,
  serial : String,
  instructions : [],
  description_long : String,
  description_short : String,
  trivia : String
});

module.exports = Mongoose.model('Watch', WatchSchema);
