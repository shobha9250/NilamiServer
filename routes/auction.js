const { addAuction, displayFeed, displayAuction, modifyAuction } = require("../services/auction");
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

module.exports = router;