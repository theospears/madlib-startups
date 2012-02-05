express = require('express');

var app = express.createServer();

app.get('/', function(req, res, next) {
	res.sendfile(__dirname + '/index.html');
});


app.listen(4000);
