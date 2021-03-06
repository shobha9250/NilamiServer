/* 
This file contains all the routes related to user. 
The functions are called and error handling is done using try-catch blocks.
*/
const {
	signUp,
	login,
	getUserDetails,
	updateUserInfo,
	registerForAuction,
	unregisterForAuction,
	addUserAddress,
	deleteUserAddress,
	getRegisteredAuctions,
	bid,
	getMyAuctions,
} = require('../services/user');
const router = require('express').Router();
const { verifyToken } = require('../middlewares/auth');
const { verifyRegistration } = require("../middlewares/registered");

//@type      POST
//@route     /user/signup
//@desc      route for signing up
//@access    PUBLIC

router.post('/signup', async function (req, res, next) {
	try {
		await signUp(req, res);
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
	try {
		await getUserDetails(req,res);
	} catch (err) {
		console.error(`Error while displaying user : `, err.message);
		next(err);
	}
});

//@type      GET
//@route     /user/registeredAuctions
//@desc      route for showing user's registered auctions
//@access    PRIVATE

router.get('/registeredAuctions', verifyToken, async function (req, res, next) {
	try {
		await getRegisteredAuctions(req,res);
	} catch (err) {
		console.error(`Error while displaying registered auctions : `, err.message);
		next(err);
	}
});

//@type      GET
//@route     /user/myAuctions
//@desc      route for showing auctions that user has organised
//@access    PRIVATE

router.get('/myAuctions', verifyToken, async function (req, res, next) {
	try {
		await getMyAuctions(req,res);
	} catch (err) {
		console.error(`Error while displaying auctions : `, err.message);
		next(err);
	}
});

//@type      PUT
//@route     /user/updateInfo
//@desc      route for updating basic user info
//@access    PRIVATE

router.put('/updateInfo',verifyToken,async function (req, res, next) {
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
		try {
			await unregisterForAuction(req,res);
		} catch (err) {
			console.error(`Error while unregistering : `, err.message);
			next(err);
		}
	}
);

//@type      POST
//@route     /user/bid/auction/:id
//@desc      route for bidding
//@access    PRIVATE

router.post('/bid/auction/:auction_id', verifyToken, verifyRegistration, async function (req, res, next) {
	try {
		await bid(req,res);
	} catch (err) {
		console.error(`Error while bidding : `, err.message);
		next(err);
	}
}
);

module.exports = router;
