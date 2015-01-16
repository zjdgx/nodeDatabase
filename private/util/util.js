var crypto = require('crypto');

exports.encrypt = function (str, cryptoMethod, privateKey) {
	var result = '',
		cipher = crypto.createCipher(cryptoMethod, privateKey);

	result = cipher.update(str, 'utf8', 'hex');
	result += cipher.final('hex');

	return result;
};

exports.descrypt = function (str, privateKey) {
	var result = '',
		decipher = crypto.createDecipher(cryptoMethod, privateKey);

	result = decipher.update(str, 'hex', 'utf8');
	result += decipher.final('utf8');

	return result;
};