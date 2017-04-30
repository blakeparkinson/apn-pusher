var express = require('express');
var router = express.Router();
var cors = require('cors');
var apn = require('apn');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/apn', cors(), (req, res) => {
  console.log(req);
    var options = {
        key: __dirname + '/key.pem', // Key file path
        passphrase: 'Theplow19',
        cert: __dirname + '/cert.pem', // String or Buffer of CA data to use for the TLS connection
        production: false,
        enhanced: true
    };

    let token = req.body.token;
    let alert = req.body.alert;
    let payload = req.body.payload;
    let topic = req.body.topic;

    var apnProvider = new apn.Provider(options);

    let deviceToken = token;

    var note = new apn.Notification();

    //note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 1;
    note.sound = "ping.aiff";
    note.alert = alert;
    note.payload = payload;
    note.topic = topic;

    apnProvider.send(note, deviceToken).then((result) => {
        console.log(result);
        res.json({success: true, result: result});
    });

});

module.exports = router;
