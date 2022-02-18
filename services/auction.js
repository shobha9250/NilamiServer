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

module.exports = {
    addAuction,
    displayFeed,
    displayAuction,
    modifyAuction
};