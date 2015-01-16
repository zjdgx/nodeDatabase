var express = require('express'),
	app = express(),
	sys = require('sys'),
	path = require('path'),
	formidable = require("formidable"),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	userService = require('./private/service/UserService');
	
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
console.log('dirName: ' + __dirname);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '/static')));
app.use(cookieParser()); 
app.use(session({
	secret: "andylau",
	cookie: {maxAge: 2 * 60000}//两分钟后session失效
}));

app.get('/', function(req, res) {
	console.log('get("/") user: '+req.session.user);
	userService.checkLogin(req, res, function(err, user) {
		if (user) {
			user.name = req.name;
		}

		res.render('index', {
			title: 'zjdgx',
			isLogin: !err,
			user: user
		});
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
			res.redirect('/');
		}
	});
});

app.listen(8001, function() {
	console.log('nodeDatabase started on port 8001...');
});