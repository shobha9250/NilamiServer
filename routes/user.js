const {
	signUp,
	login,
	getUserDetails,
	updateUserInfo,
	registerForAuction,
	unregisterForAuction,
	addUserAddress,
	deleteUserAddress,
	getRegisteredAuctions
} = require('../services/user');
const router = require('express').Router();
const { verifyToken } = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const config = require('../config');


//@type      POST
//@route     /user/signup
//@desc      route for signing up
//@access    PUBLIC

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

//@type      POST
//@route     /user/login
//@desc      route for login
//@access    PUBLIC

router.post('/login', async function (req, res, next) {
	console.log('Login');
	try {
		await login(req, res);
	} catch (err) {
		console.error(`Error while signing up : `, err.message);
		next(err);
	}
});

//@type      GET
//@route     /user/profile
//@desc      route for showing user details
//@access    PRIVATE

router.get('/profile', verifyToken, async function (req, res, next) {
	console.log('User details with username ' + req.user.username);
	try {
		await getUserDetails(req,res);
	} catch (err) {
		console.error(`Error while displaying user : `, err.message);
		next(err);
	}
});

//@type      GET
//@route     /user/registeredAuctions
//@desc      route for showing user details
//@access    PRIVATE

router.get('/registeredAuctions', verifyToken, async function (req, res, next) {
	try {
		await getRegisteredAuctions(req,res);
	} catch (err) {
		console.error(`Error while displaying registered auctions : `, err.message);
		next(err);
	}
});

//@type      PUT
//@route     /user/updateInfo
//@desc      route for updating basic user info
//@access    PRIVATE

router.put('/updateInfo',verifyToken,async function (req, res, next) {
	console.log('Modify details for user ' + req.user.username);
	try {
		await updateUserInfo(req,res);
	} catch (err) {
		console.error(`Error while modifying user : `, err.message);
		next(err);
	}
});

//@type      POST
//@route     /user/addAddress
//@desc      route for adding a new address to profile
//@access    PRIVATE

router.post('/addAddress',verifyToken,async function (req, res, next) {
	console.log('Modify details for user ' + req.user.username);
	try {
		await addUserAddress(req,res);
	} catch (err) {
		console.error(`Error while adding address : `, err.message);
		next(err);
	}
});

//@type      POST
//@route     /user/deleteAddress
//@desc      route for deleting an existing address from profile
//@access    PRIVATE

router.post('/deleteAddress',verifyToken,async function (req, res, next) {
	console.log('Modify details for user ' + req.user.username);
	try {
		await deleteUserAddress(req,res);
	} catch (err) {
		console.error(`Error while adding address : `, err.message);
		next(err);
	}
});

//@type      POST
//@route     /user/register/auction
//@desc      route for registering to a auction
//@access    PRIVATE

router.post('/register/auction', verifyToken, async function (req, res, next) {
		console.log('Register for auction ' + req.body.auction_id);
		try {
			await registerForAuction(req,res);
		} catch (err) {
			console.error(`Error while registering : `, err.message);
			next(err);
		}
	}
);

//@type      POST
//@route     /user/unregister/auction
//@desc      route for unregistering from an event
//@access    PRIVATE

router.post('/unregister/auction', verifyToken, async function (req, res, next) {
		console.log('Unregister for auction ' + req.body.auction_id);
		try {
			await unregisterForAuction(req,res);
		} catch (err) {
			console.error(`Error while unregistering : `, err.message);
			next(err);
		}
	}
);

module.exports = router;
