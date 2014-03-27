module.exports = function(onepage) {

  app.get('/webhooks/inquiries.json', function(req, res) {
    res.send({success : 1});
  });

  app.post('/webhooks/inquiries.json', function(req, res) {
    var data = req.body.data;
    var lname = '';
    if(!data.merges.LNAME) {
      lname = 'Anonymous';
    } else {
      lname = formatName(data.merges.LNAME);
    }
    onepage.createContact({
      firstname : formatName(data.merges.FNAME),
      lastname : lname,
      zip_code : data.merges.ZIPCODE,
      owner_id : ben_id,
      phones : ('other|' + data.merges.PHONE),
      emails : ('other|' + data.email), tags : 'Inquiries'}, function(contact) {

        // Test case
        var due =  parseOnePageCRMDate(new Date(Date.now()+24*60*60*1000));
        var params = {};
        if(data.merges.PHONE) {
          params = {
            cid : contact.id,
            assignee_id : contact.owner,
            name : 'Schedule follow-up call',
            date : due};
        } else {
          params = {
            cid : contact.id,
            assignee_id : contact.owner,
            name : 'Schedule follow-up email',
            date : due};
        }
        onepage.createAction(params, function(data) {
          console.log(data);
        });
        // End Test Case

        console.log(contact);
      });
    res.json({success : 1});
  });
};
