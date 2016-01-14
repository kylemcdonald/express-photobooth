var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mkdirp = require('mkdirp');
var fs = require('fs');

app.use(express.static('public'));
app.use(bodyParser.raw({ type: 'image/jpeg', limit: '10mb'}));

app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.post('/upload', function(req, res) {
	var cameraId = req.query.cameraId;
	var dir = 'uploads/';
	mkdirp(dir, function (err) {
	    if (err) {
	    	console.error(err);
	    	return;
	    }
	    var timestamp = Math.floor((new Date() / 1000));
		var filename = timestamp + '.jpg';
		var path = dir + filename;
		console.log('saving upload to: ' + path);
		fs.writeFile(path, req.body, 'binary', function(err) {
			if(err) console.log(err);
			else console.log('saved upload');
		});
	});
	res.sendStatus(200);
})

var server = app.listen(process.env.PORT || 3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('App listening at http://%s:%s', host, port);
});