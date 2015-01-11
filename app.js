var express = require('express'),
	app = express(),
	sys = require('sys'),
	path = require('path'),
	formidable = require("formidable");
	
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
console.log('dirName: ' + __dirname);
app.use(express.static(path.join(__dirname, '/static')));

app.get('/', function(req, res) {
	res.render('login', {
		title: '登陆|注册'
	});
});

app.listen(8000, function() {
	console.log('nodeDatabase started on port 8000...');
});