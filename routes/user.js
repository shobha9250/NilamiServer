const { getAllUsers, signUp, login, userDetails } = require('../services/user');
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

router.get('/id/:id', async function (req, res, next) {
	console.log('User details with id ' + req.params.id);
	try {
		res.json(await userDetails(req.params.id));
	} catch (err) {
		console.error(`Error while displaying auction : `, err.message);
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
