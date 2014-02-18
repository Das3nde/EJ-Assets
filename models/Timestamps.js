var Mongoose = require('mongoose');

var TimestampSchema = Mongoose.Schema({
  list_pull : Date
});

module.exports = Mongoose.model('Timestamps', TimestampSchema);
