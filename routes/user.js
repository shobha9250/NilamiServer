const {
	signUp,
	login,
	userDetails,
	updateUserInfo,
	registerForAuction,
	unregisterForAuction,
} = require('../services/user');
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

router.get('/:username', verifyToken, async function (req, res, next) {
	console.log('User details with username ' + req.user.username);
	try {
		res.json(await userDetails(req.user.username));
		console.log(req.user);
	} catch (err) {
		console.error(`Error while displaying user : `, err.message);
		next(err);
	}
});

router.put('/editUser/:username', verifyToken, async function (req, res, next) {
	console.log('Modify details for user ' + req.user.username);
	try {
		res.json(await updateUserInfo(req.user.username));
	} catch (err) {
		console.error(`Error while modifying user : `, err.message);
		next(err);
	}
});

router.post('/register/auction/:auction_id', verifyToken, async function (req, res, next) {
	console.log('Register for auction ' + req.auction_id);
	try {
		await registerForAuction(req.user.user_id, req.auction_id);
	} catch (err) {
		console.error(`Error while registering : `, err.message);
		next(err);
	}
});

router.post('/unregister/auction/:auction_id', verifyToken, async function (req, res, next) {
	console.log('Register for auction ' + req.auction_id);
	try {
		await unregisterForAuction(req.user.user_id, req.auction_id);
	} catch (err) {
		console.error(`Error while unregistering : `, err.message);
		next(err);
	}
});

module.exports = router;
