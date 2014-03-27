module.exports = function(zoho) {

  app.get('/webhooks/zoho.json', function(req, res) {
    res.send({success : 1});
  });

  app.post('/webhooks/zoho.json', function(req, res) {
    /*
    var data = req.body.data;
    var lname = '';
    if(!data.merges.LNAME) {
      lname = 'Anonymous';
    } else {
      lname = formatName(data.merges.LNAME);
    }
    var fname = '';
    if(!data.merges.FNAME) {
      fname = '';
    } else {
      fname = formatName(data.merges.FNAME);
    }
    var xml_json = [{
      Leads : [{
        row : [
          {_attr : {no : '1'}},
          {FL : [
            {_attr : {val : "Lead Source"}},
            'Web Inquiry']},
          {FL : [
            {_attr : {val : "First Name"}},
            fname]},
          {FL : [
            {_attr : {val : "Last Name"}},
            lname]},
          {FL : [
            {_attr : {val : "Zip Code"}},
            data.merges.ZIPCODE]},
          {FL : [
            {_attr : {val : "Email"}},
            data.email]},
          {FL : [
            {_attr : {val : "Phone"}},
            data.merges.PHONE]}
        ]
      }]
    }];

    zoho.postInquiry(xml_json, {scope : "crmapi", wfTrigger : "true"}, function(data) {
      console.log(data);
    });
    */

    res.json({success : 1});
  });
};
