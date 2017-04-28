var express = require('express');
var router = express.Router();
var cors = require('cors');
var apn = require('apn');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/apn', cors(), (req, res) =>  {
  var options = {
    key:  __dirname + '/key.pem',          // Key file path
    passphrase: 'Theplow19',
    cert: __dirname + '/cert.pem',// String or Buffer of CA data to use for the TLS connection
    production:false,
    enhanced: true
  };

var apnProvider = new apn.Provider(options);

let deviceToken = "51733ecfe5644c385a1d2b6ba317c42c7a54539130ddf289adddec9d5f2b8f54";

var note = new apn.Notification();


note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
note.badge = 1;
note.sound = "ping.aiff";
note.alert = "\uD83D\uDCE7 \u2709 From the node server";
note.payload = {'messageFrom': 'Blake Parkinson'};
note.topic = "com.schooldeets.app";

apnProvider.send(note, deviceToken).then( (result) => {
  console.log(result);
  res.json({
                success: true,
                result: result
            });
});




});

module.exports = router;
