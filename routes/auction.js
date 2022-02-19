const { addAuction, displayFeed, displayAuction, modifyAuction, updateLikes, categoryAuctionFilter, locationAuctionFilter, sortedAuctionFilter } = require("../services/auction");
const router = require("express").Router();

router.post("/new", async function (req, res, next) {
    console.log('Adding new auction details')
    try {
        await addAuction(req);
    } catch (err) {
        console.error(`Error while adding auction : `, err.message);
        next(err);
    }
});

router.get('/feed', async function (req, res, next) {
    console.log('Generating auction feed.')
    try {
        res.json(await displayFeed());
    } catch (err) {
        console.error(`Error while displayinf feed : `, err.message);
        next(err);
    }
});

router.get('/id/:id', async function (req, res, next) {
    console.log('Details for auction with id ' + req.params.id)
    try {
        res.json(await displayAuction(req.params.id));
    } catch (err) {
        console.error(`Error while displaying auction : `, err.message);
        next(err);
    }
});

router.put('/edit/:id', async function (req, res, next) {
    console.log('Modify details for auction with id ' + req.params.id)
    try {
        res.json(await modifyAuction(req));
    } catch (err) {
        console.error(`Error while modifying auction : `, err.message);
        next(err);
    }
});

router.put('/add_like/:id', async function (req, res, next) {
    console.log('Add a like for auction with id ' + req.params.id)
    try {
        res.json(await updateLikes(req.params.id));
    } catch (err) {
        console.error(`Error while modifying likes of given auction_id : `, err.message);
        next(err);
    }
});

router.get('/category_filter/:category', async function (req, res, next) {
    console.log('Details for auction with category ' + req.params.category)
    try {
        res.json(await categoryAuctionFilter(req.params.category));
    } catch (err) {
        console.error(`Error while displaying category filtered auctions : `, err.message);
        next(err);
    }
});

router.get('/location_filter/:location', async function (req, res, next) {
    console.log('Details for auction with location ' + req.params.location)
    try {
        res.json(await locationAuctionFilter(req.params.location));
    } catch (err) {
        console.error(`Error while displaying location filtered auctions : `, err.message);
        next(err);
    }
});

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