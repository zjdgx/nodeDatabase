var express = require('express'),
	session = require('express-session'),
	app = express(),
	sys = require('sys'),
	path = require('path'),
	bodyParser = require('body-parser'),
	userService = require('./private/service/UserService');
	formidable = require("formidable");
	
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
console.log('dirName: ' + __dirname);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '/static')));
app.use(express.cookieParser('likeshan')); 
app.use(express.session({ secret: "andylau" }));

app.get('/', function(req, res) {
	console.log(req.session.user)
	userService.checkLogin(req, res, function(err, user) {
		if (err) {
			res.redirect('/login');
		} else {
			res.render('index', {
				title: 'zjdgx',
				user: {name: user}
			});
		}
	})
});

app.get('/login', function(req, res) {
	res.render('register/login', {
		title: '登陆 | 注册'
	});
});

app.post('/register', function(req, res) {
	console.log(req.body);
	userService.addUser(req, res, function(result) {
		if (result.result === 0) {
			res.render('register/login',{
				title: '注册失败',
				content: '注册失败, 请重试. 错误信息: ' + result.msg
			});
		} else {
			res.redirect('index')
			
			res.render('index',{
				title: '欢迎' + req.body.name
			});
		}
	});
});

app.listen(8000, function() {
	console.log('nodeDatabase started on port 8000...');
});