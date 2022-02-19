const config = require('../config');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	const token = req.headers.authorization;

	if (!token) {
		return res.status(403).send('A token is required for authentication');
	}
	try {
		const decoded = jwt.verify(token, config.jwt.secret);
		req.user = decoded;
	} catch (err) {
		return res.status(401).send('Invalid Token');
	}
	return next();
};

module.exports = verifyToken;
