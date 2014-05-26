var Mongoose = require('mongoose');

var Watch = require('./Watch.js');

var EJCollectionsSchema = Mongoose.Schema({
  aficionado : [Watch],
  connoisseur: [Watch],
  virtuoso   : [Watch]
});

module.exports = Mongoose.model('EJCollections', EJCollectionsSchema);
