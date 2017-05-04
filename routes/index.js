var express = require('express');
var router = express.Router();
var cors = require('cors');
var apn = require('apn');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/apn', cors(), (req, res) => {
    if (!req.body.secret_sauce) {
        res.json({error: true, message: 'api key not provided'});

    } else if (req.body.secret_sauce != process.env.SecretSauce) {
        res.json({error: true, message: 'invalid api key'});

    } else {
        var options;
        if (req.body.dev) {
            options = {
                key: __dirname + '/key.pem', // Key file path
                passphrase: process.env.pass,
                cert: __dirname + '/cert.pem', // String or Buffer of CA data to use for the TLS connection
                production: false,
                enhanced: true
            };
        } else {
            options = {
                key: __dirname + '/key_prod.pem', // Key file path
                passphrase: process.env.pass,
                cert: __dirname + '/cert_prod.pem', // String or Buffer of CA data to use for the TLS connection
                production: true,
                enhanced: true
            };

        }

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
    }

});

module.exports = router;
