var Mongoose = require('mongoose');

var ContactSchema = Mongoose.Schema({

// Common
  email : String,
  first_name : String,
  last_name : String,
  country : String,
  state : String,
    
// Mailchimp
  ip : String,
  latitude : String,
  longitude : String,
  timezone : String,
  created : Date,
  euid : String,
  leid : String,

// OnePageCRM
  id : String,
  company : String,
  job_title : String,
  address : String,
  zip : String,
  city : String,
  description : String,
  phones : [{type : String, number : String}],
  owner : String,
  status : String,
  lead_source : String,
  tags : [String]
});

module.exports = Mongoose.model('Contact', ContactSchema);
