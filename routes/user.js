const { signUp, login, userDetails } = require('../services/user');
const router = require('express').Router();
const { verifyToken } = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const config = require('../config');

router.post('/signup', async function (req, res, next) {
	console.log('Sign up');
	try {
		await signUp(req, res);
		// const decoded = jwt.verify(req.cookies['token'], config.jwt.secret);
		// console.log(decoded);
	} catch (err) {
		console.error(`Error while signing up : `, err.message);
		next(err);
	}
});

router.post('/login', async function (req, res, next) {
	console.log('Login');
	try {
		await login(req, res);
	} catch (err) {
		console.error(`Error while signing up : `, err.message);
		next(err);
	}
});

router.get('/:username',verifyToken, async function (req, res, next) {
	console.log('User details with id ' + req.user.username);
	try {
		res.json(await userDetails(req.user.username));
		console.log(req.user);
	} catch (err) {
		console.error(`Error while displaying auction : `, err.message);
		next(err);
	}
});

module.exports = router;
