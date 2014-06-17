
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendfile('public/mock.html');
});

app.listen(process.env.PORT || 2999);