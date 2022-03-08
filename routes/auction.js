const { verifyToken, verifyAuctioneer } = require("../middlewares/auth");
const { addAuction, displayFeed, displayAuction, modifyAuction, updateLikes, categoryAuctionFilter, locationAuctionFilter, sortedAuctionFilter } = require("../services/auction");
const router = require("express").Router();
const {inviteSuggestions} = require("../services/inviteSuggestion");


//@type      POST
//@route     /auction/user
//@desc      route for creating a new auction
//@access    PRIVATE

router.post('/new',verifyToken, async function (req, res, next) {
	console.log('Adding new auction details');
	try {
		// await addAuction(req);
        inviteSuggestions(req,res);
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
	console.log('Generating auction feed.');
	try {
		res.json(await displayFeed());
	} catch (err) {
		console.error(`Error while displaying feed : `, err.message);
		next(err);
	}
});

function comp(a, b) {
    if (a.start_time < b.start_time) {
        return true;
    }
    else if (b.start_time > a.start_time) {
        return false;
    }
    if (a.end_time < b.end_time) {
        return true;
    }
    return false;
}

router.get('/suggestion', async function (req, res, next) {
    console.log('Suggesting start time');
    try {
        const allAuctions = res.json(await displayFeed());
        const filteredAuctions = [];
        var j = 0;
        for (var i = 0; i < allAuctions.size(); i++) {
            if (req.body.estimated_price - 10000 <= allAuctions[i].estimated_price && req.body.estimated_price + 10000 >= allAuctions[i].estimated_price && req.body.category == allAuctions[i].category && req.body.city == allAuctions[i].city && allAuctions[i].start_time >= req.body.start_time && allAuctions[i].end_time <= req.body.end_time) {
                filteredAuctions[j] = { start_time: allAuctions[i].start_time, end_time: allAuctions[i].end_time };
                j++;
            }
        }
        filteredAuctions.sort(comp);

        if (j == 0 || filteredAuctions[0].start_time>=(req.body.start_time + req.body.duration)) {
            return req.body.start_time;
        }
        else if (filteredAuctions[j - 1].end_time + req.body.duration <= req.body.end_time) {
            return filteredAuctions[j - 1].end_time;
        }
        else{
            var ind = -1;
            var k1 = 0;
            var k2 = 0;
            var interections = j+1;
            while (k1 < j) {
                if (k1 < j - 1) {
                    if (filteredAuctions[k1 + 1].start_time - filteredAuctions[k1].end_time >= req.body.duration) {
                        return filteredAuctions[k1].end_time;
                    }
                }
                k2 = max(k1, k2);
                while (k2 < j && filteredAuctions[k2].start_time < (filteredAuctions[k1].start_time + req.body.duration)) {
                    k2++;
                }
                if (k2 - k1 < interections) {
                    interections = k2 - k1;
                    ind = k1;
                }
                k1++;
            }
            return filteredAuctions[ind].start_time;
        }
    } catch (err) {
        console.error(`Error while feteching auctions : `, err.message);
        next(err);
    }
});

//@type      GET
//@route     /auction/id/:id
//@desc      route for getting details of a particular auction
//@access    PUBLIC

router.get('/id/:id', async function (req, res, next) {
	console.log('Details for auction with id ' + req.params.id);
	try {
		res.json(await displayAuction(req.params.id));
	} catch (err) {
		console.error(`Error while displaying auction : `, err.message);
		next(err);
	}
});

//@type      PUT
//@route     /auction/edit/:id
//@desc      route for editing an auction
//@access    PRIVATE

router.put('/edit/:id',verifyToken,verifyAuctioneer, async function (req, res, next) {
	console.log('Modify details for auction with id ' + req.params.id);
	try {
		res.json(await modifyAuction(req));
	} catch (err) {
		console.error(`Error while modifying auction : `, err.message);
		next(err);
	}
});

//@type      PUT
//@route     /auction/add_like/:id
//@desc      route for adding a like to a auction post
//@access    PRIVATE

router.put('/add_like/:id',verifyToken, async function (req, res, next) {
    console.log('Add a like for auction with id ' + req.params.id)
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
    console.log('Details for auction with category ' + req.params.category)
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
    console.log('Details for auction with location ' + req.params.location)
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
    console.log('Details for auction with sorted')
    try {
        res.json(await sortedAuctionFilter());
    } catch (err) {
        console.error(`Error while displaying sorted auctions : `, err.message);
        next(err);
    }
});

module.exports = router;
