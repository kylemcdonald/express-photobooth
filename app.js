var httpPort = 3000;
var oscPort = 5000;

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');
var osc = require('node-osc');
var oscClient = new osc.Client('127.0.0.1', oscPort);

app.use(express.static('public'));
app.use(bodyParser.raw({ type: 'image/jpeg', limit: '10mb'}));

app.post('/upload', function(req, res) {
    var cameraId = req.query.cameraId;
    var dir = 'uploads/';
    mkdirp(dir, function (err) {
        if (err) {
            console.error(err);
            return;
        }
        var timestamp = Math.floor((new Date() / 1000));
        var filename = dir + timestamp + '.jpg';
        console.log('saving upload to: ' + filename);
        fs.writeFile(filename, req.body, 'binary', function(err) {
            if(err) console.log(err);
            else {
                console.log('saved upload');
                oscClient.send('/photobooth', path.resolve(filename));
            }
        });
    });
    res.sendStatus(200);
})

var server = app.listen(process.env.PORT || httpPort, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('HTTP listening on port %s', port);
});