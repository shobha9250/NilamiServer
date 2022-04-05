/* 
This file contains all the routes related to auction. 
The functions are called and error handling is done using try-catch blocks.
*/

const { verifyToken, verifyAuctioneer } = require("../middlewares/auth");
const { 
	addAuction, 
	displayFeed, 
	getTopBidDetails, 
	displayAuction, 
	modifyAuction,
	closeAuction, 
	updateLikes, 
	categoryAuctionFilter, 
	locationAuctionFilter, 
	sortedAuctionFilter,
	getWinnerName, } = require("../services/auction");
const router = require("express").Router();
const {startTimeSuggestion} = require("../services/startTimeSuggestion");


//@type      POST
//@route     /auction/new
//@desc      route for creating a new auction
//@access    PRIVATE

router.post('/new',verifyToken, async function (req, res, next) {
	try {
		await addAuction(req,res);
	} catch (err) {
		console.error(`Error while adding auction : `, err.message);
		next(err);
	}
});

//@type      GET
//@route     /auction/feed
//@desc      route for getting feed of public auctions
//@access    PUBLIC

router.get('/feed', async function (req, res, next) {
	try {
		res.json(await displayFeed());
	} catch (err) {
		console.error(`Error while displaying feed : `, err.message);
		next(err);
	}
});

//@type      GET
//@route     /auction/timeSuggestion
//@desc      route for getting time suggestions
//@access    PRIVATE

router.post('/timeSuggestion', async function (req, res, next) {
	try {
        res.json(await startTimeSuggestion(req, res, next));
    } catch (err) {
		console.error(`Error while suggesting start time, date: `, err.message);
		next(err);
	}
});

//@type      GET
//@route     /auction/id/:id
//@desc      route for getting details of a particular auction
//@access    PUBLIC

router.get('/id/:id', async function (req, res, next) {
	try {
		res.json(await displayAuction(req.params.id));
	} catch (err) {
		console.error(`Error while displaying auction : `, err.message);
		next(err);
	}
});

//@type      GET
//@route     /auction/getWinnerName/id/:id
//@desc      route for getting details of a winner of a particular auction
//@access    PUBLIC

router.get('/getWinnerName/id/:id', async function (req, res, next) {
	try {
		res.json(await getWinnerName(req));
	} catch (err) {
		console.error(`Error while displaying auction : `, err.message);
		next(err);
	}
});

//@type      GET
//@route     /auction/bidDetails/id/:id
//@desc      route for getting top bid details of a particular auction
//@access    PRIVATE

router.get('/bidDetails/id/:id', async function (req, res, next) {
	try {
		await getTopBidDetails(req,res);
	} catch (err) {
		console.error(`Error while displaying auction : `, err.message);
		next(err);
	}
});

//@type      PUT
//@route     /auction/edit/:id
//@desc      route for editing an auction
//@access    PRIVATE

router.put('/edit/:id',verifyToken, verifyAuctioneer, async function (req, res, next) {
	try {
		res.json(await modifyAuction(req));
	} catch (err) {
		console.error(`Error while modifying auction : `, err.message);
		next(err);
	}
});

//@type      PUT
//@route     /auction/close/:id
//@desc      route for closing an auction
//@access    PRIVATE

router.put('/close/:id',verifyToken, verifyAuctioneer, async function (req, res, next) {
	try {
		res.json(await closeAuction(req));
	} catch (err) {
		console.error(`Error while closing auction : `, err.message);
		next(err);
	}
});

//@type      PUT
//@route     /auction/add_like/:id
//@desc      route for adding a like to a auction post
//@access    PUBLIC

router.put('/add_like/:id', async function (req, res, next) {
    try {
        res.json(await updateLikes(req.params.id));
    } catch (err) {
        console.error(`Error while modifying likes of given auction_id : `, err.message);
        next(err);
    }
});

//@type      GET
//@route     /auction/category_filter/:category
//@desc      route for filtering out feed on category basis
//@access    PUBLIC

router.get('/category_filter/:category', async function (req, res, next) {
    try {
        res.json(await categoryAuctionFilter(req.params.category));
    } catch (err) {
        console.error(`Error while displaying category filtered auctions : `, err.message);
        next(err);
    }
});

//@type      GET
//@route     /auction/location_filter/:location
//@desc      route for filtering out feed on location basis
//@access    PUBLIC

router.get('/location_filter/:location', async function (req, res, next) {
    try {
        res.json(await locationAuctionFilter(req.params.location));
    } catch (err) {
        console.error(`Error while displaying location filtered auctions : `, err.message);
        next(err);
    }
});

//@type      GET
//@route     /auction/sort_auctions
//@desc      route for sorting out feed on estimated price 
//@access    PUBLIC

router.get('/sort_auctions', async function (req, res, next) {
    try {
        res.json(await sortedAuctionFilter());
    } catch (err) {
        console.error(`Error while displaying sorted auctions : `, err.message);
        next(err);
    }
});

module.exports = router;
