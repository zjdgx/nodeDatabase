var session = require('express-session'),
	mongodb = require('mongodb'),
	async = require('async'),
	server = new mongodb.Server('127.0.0.1', 27017, {}),
	client = new mongodb.Db('zjdgx-node-database', server, {w: 1});;

exports.addUser = function(req, res, cb) {
	async.waterfall([
		function(cb) {
			client.open(function(err){
				if (err) {
					cb && cb(err);
					return;
				}
				cb();
			});
		},
		function(cb) {
			client.collection('user', function(err, collection) {
				if (err) {
					cb && cb(err);	
				} else {
					cb(null, collection);
				}
			});
		},
		function(collection, cb) {
			collection.find({name:req.body.name}).toArray(function(err, results) {
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
		function(collection, cb) {
			collection.insert(
				{'name':req.body.name, password: req.body.password},
				{safe: true},
				function(err, documents) {
					client.close();
					if (err) {
						cb && cb(err);
						return;
					}
					cb();
				}
			);
		}
	],function(err, result) {
		client.close();
		if (err) {
			cb & cb({'result':0,'msg':err});
		} else {
			req.session.user = req.body.name;
			cb({'result':1,'msg':'Register success.'});
		}
	});
};

exports.checkLogin = function(req, res, cb) {
	var user = req.session.user;
	
	if (user) {
		async.waterfall([
			function(cb) {
				client.open(function(err){
					if (err) {
						cb && cb(err);
						return;
					}
					cb();
				});
			},
			function(cb) {
				client.collection('user', function(err, collection) {
					if (err) {
						cb && cb(err);	
					} else {
						cb(null, collection);
					}
				});
			},
			function(collection, cb) {
				collection.find({name:user}).toArray(function(err, results) {
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
			function(result, cb) {
				console.log('result: ' + JSON.stringify(results));
				cb(null, {});
			}
		],function(err, result) {
			if (err) {
				cb & cb({'result':0,'msg':err});
			} else {
				cb(user);
			}
		});
	}
};