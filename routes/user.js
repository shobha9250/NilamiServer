const { getAllUsers, signUp, login } = require('../services/user');
const router = require('express').Router();
const { verifyToken } = require('../middlewares/auth');

router.post('/signup', async function (req, res, next) {
	console.log('Sign up');
	try {
		await signUp(req, res);
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

//sample api to get details of all users
router.get('/allUsers', async function (req, res, next) {
	try {
		res.json(await getAllUsers(req.query.page));
	} catch (err) {
		console.error(`Error while getting users `, err.message);
		next(err);
	}
});

module.exports = router;
