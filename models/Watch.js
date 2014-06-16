var Mongoose = require('mongoose');

var WatchSchema = Mongoose.Schema({
  img : String, // This is now deprecated and will be phased out
  img_small : String,
  img_medium : String,
  img_large : String,
  zoom_enabled: Boolean,
  brand : String,
  family : String,
  model : String,
  reference : String,
  serial : String,
  instructions : [],
  description_long : String,
  description_short : String,
  trivia : String,
  ej_collection : String,
  lookbook : Boolean
});

module.exports = Mongoose.model('Watch', WatchSchema);
