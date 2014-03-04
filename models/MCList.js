var Mongoose = require('mongoose');

var MCListSchema = Mongoose.Schema({
  id : String,
  web_id : String,
  name : String,
  date_created : Date,
  email_type_option : Boolean,
  use_awsomebar : Boolean,
  default_from_name : String,
  default_from_email : String,
  default_subject : String,
  default_language : String,
  list_rating : Number,
  subscribe_url_short : String,
  subscribe_url_long : String,
  beamer_address : String,
  visibility : String,
  stats : {
    member_count : Number,
    unsubscribe_count : Number,
    cleaned_count : Number,
    member_count_since_send : Number,
    cleaned_count_since_send : Number,
    campaign_count : Number,
    grouping_count : Number,
    group_count : Number,
    merge_var_count : Number,
    avg_sub_rate : Number,
    target_sub_rate : Number,
    open_rate : Number,
    click_rate : Number,
    date_last_campaign : Date},
});

module.exports = Mongoose.model('MCList', MCListSchema);


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
