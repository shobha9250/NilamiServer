const db = require('./db');
const helper = require('../helper');

/* Add auction to the database */
async function addAuction(req) {

    console.log(await db.query(`SELECT * FROM auction`))
    console.log(await db.query(`SELECT * FROM product`))
    console.log(await db.query(`SELECT * FROM user_data`))
    let rq = req.query
    let insertQuery = `INSERT INTO auction values ('${rq.auction_id}','${rq.product_id}', '','UPCOMING', '0','${rq.is_private}','0','${rq.auctioneer_id}','${rq.start_date}', '${rq.end_date}','${rq.start_time}', '${rq.end_time}')`
    await db.query(insertQuery);
}

/* Generate auction feed sorted based on popularity(default) */
async function displayFeed() {

    let feedQuery = `SELECT * from auction ORDER BY n_likes DESC,n_bidders DESC`
    const rows = await db.query(feedQuery)
    const displayFeed = helper.emptyOrRows(rows);
    return displayFeed
}

/* Display auction details for auction_id */
async function displayAuction(auction_id) {

    let displayQuery = `SELECT * from auction WHERE auction_id='${auction_id}'`
    const rows = await db.query(displayQuery)
    const auction = helper.emptyOrRows(rows);
    return auction
}

/* Modify auction details for auction_id */
/* This function is also used while updating auction info post completion and after every registration,like*/
async function modifyAuction(req) {
    let rq = req.query
    let auction_id = req.params.id
    let updateQuery = `UPDATE auction SET auction_status='rq.auction_status', n_bidders='${rq.n_bidders}', is_private='${rq.is_private}',n_likes='${rq.n_likes}', start_date='${rq.start_date}', end_date='${rq.end_date}',start_time='${rq.start_time}', end_time='${rq.end_time}' WHERE auction_id='${auction_id}'`
    await db.query(updateQuery)
}

/* Add a like to the auction given auction_id */
async function updateLikes(auction_id) {
    let updateQuery = `UPDATE auction SET n_likes= n_likes + 1 WHERE auction_id='${auction_id}'`
    await db.query(updateQuery)
}

/* Get the list of auctions which comes under a particular category */
async function categoryAuctionFilter(category) {
    console.log(await db.query(`SELECT * FROM product`))
    let filterQuery = `SELECT *
                        FROM auction
                        INNER JOIN product
                        ON auction.product_id = product.product_id WHERE product.product_category = '${category}'`
    const rows = await db.query(filterQuery);
    const displayFilteredAuctions = helper.emptyOrRows(rows);
    return displayFilteredAuctions;
}

/* Get the list of auctions with given location */
async function categoryAuctionFilter(category) {
    let filterQuery = `SELECT *
                        FROM auction
                        INNER JOIN product
                        ON auction.product_id = product.product_id WHERE product.product_category = '${category}'`
    const rows = await db.query(filterQuery);
    const displayFilteredAuctions = helper.emptyOrRows(rows);
    return displayFilteredAuctions;
}

/* Get the list of auctions with given location */
async function locationAuctionFilter(location) {
    let filterQuery = `SELECT *
                        FROM auction
                        INNER JOIN user_address
                        ON auction.auctioneer_id = user_address.user_id WHERE user_address.city = '${location}'`
    const rows = await db.query(filterQuery);
    const displayFilteredAuctions = helper.emptyOrRows(rows);
    return displayFilteredAuctions;
}

/* Get the list of auctions with given location */
async function sortedAuctionFilter() {
    console.log(await db.query(`SELECT * FROM product`))
    let filterQuery = `SELECT *
                        FROM auction
                        INNER JOIN product
                        ON auction.product_id = product.product_id ORDER BY product.estimated_price`
    const rows = await db.query(filterQuery);
    const displaySortedAuctions = helper.emptyOrRows(rows);
    return displaySortedAuctions;
}

module.exports = {
    addAuction,
    displayFeed,
    displayAuction,
    modifyAuction,
    updateLikes,
    categoryAuctionFilter,
    locationAuctionFilter,
    sortedAuctionFilter
};