var async = require('async'),
	mongodb = require('mongodb'),
	USER_ENCRYPTE_METHOD = 'desx',
	util = require('../util/util'),
	USER_ENCRYPTE_KEY = 'zjdgx20150115',
	session = require('express-session'),
	server = new mongodb.Server('127.0.0.1', 27017, {}),
	client = new mongodb.Db('zjdgx-node-database', server, {w: 1});

exports.addUser = function (req, res, cb) {
	async.waterfall([
		function (cb) {
			// 打开数据库
			client.open(function (err) {
				if (err) {
					cb && cb(err);
					return;
				}
				cb();
			});
		},
		function (cb) {
			// 打开collection
			client.collection('user', function (err, collection) {
				if (err) {
					cb && cb(err);
				} else {
					cb(null, collection);
				}
			});
		},
		function (collection, cb) {
			// 检查姓名是否存在
			collection.find({name: req.body.name}).toArray(function (err, results) {
				if (err) {
					cb && cb(err);
				} else {
					if (results.length) {
						cb && cb(new Error('Email has registered before.'));
					} else {
						cb(null, collection);
					}
				}
			});
		},
		function (collection, cb) {
			// 插入数据
			collection.insert(
				{'name': util.encrypt(req.body.name, USER_ENCRYPTE_METHOD, USER_ENCRYPTE_KEY), password: util.encrypt(req.body.password, USER_ENCRYPTE_METHOD, USER_ENCRYPTE_KEY), date: new Date()},
				{safe: true},
				function (err, documents) {
					client.close();
					if (err) {
						cb && cb(err);
						return;
					}
					cb();
				}
			);
		}
	], function (err, result) {
		client.close();
		if (err) {
			cb & cb({'result': 0, 'msg': err});
		} else {
			// 将用户名保存在session中
			req.session.user = {name: req.body.name};
			cb({'result': 1, 'msg': 'Register success.'});
		}
	});
};

exports.checkLogin = function (req, res, cb) {
	var user = req.session.user;

	if (user) {
		async.waterfall([
			function (cb) {
				client.open(function (err) {
					if (err) {
						cb && cb(err);
						return;
					}
					cb();
				});
			},
			function (cb) {
				client.collection('user', function (err, collection) {
					if (err) {
						cb && cb(err);
					} else {
						cb(null, collection);
					}
				});
			},
			function (collection, cb) {
				collection.find({name: util.encrypt(user.name, USER_ENCRYPTE_METHOD, USER_ENCRYPTE_KEY)}).toArray(function (err, results) {
					if (err) {
						cb && cb(err);
					} else {
						if (!results.length) {
							cb && cb(new Error('Email is not existed.'));
						} else {
							cb(null, results);
						}
					}
				});
			},
			function (result, cb) {
				if (result.length) {
					cb(null, {});
				} else {
					cb(new Error('please login first...'));
				}
			}
		], function (err, result) {
			client.close();
			cb(err, user);
		});
	} else {
		cb(new Error('please login first...'));
	}
};