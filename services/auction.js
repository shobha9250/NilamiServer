const db = require('./db');
const helper = require('../helper');
const { v4: uuidv4 } = require('uuid');
const mailHelper = require("./mailHelper");
const {inviteSuggestions} = require("./inviteSuggestion");
const date = require('date-and-time')


const auctionRows = "(auction_id,product_id,auction_status,n_bidders,is_private,n_likes,auctioneer_id,start_date,end_date,start_time,end_time)"
const productRows = "(product_id,product_name,product_details,product_category,product_pic,estimated_price,starting_price,city,pincode)"

/* Add auction to the database */
async function addAuction(req,res) {
	var invitedBidders;
	const productData = {
		product_id: uuidv4(),
		product_name: req.body.product_name,
		product_details: req.body.product_details,
		product_category: req.body.product_category,
		product_pic: req.body.product_pic,
		estimated_price: req.body.estimated_price,
		starting_price: req.body.starting_price,
		city: req.body.city,
		pincode: req.body.pincode
	}

	const auctionData = {
		auction_id: uuidv4(),
		inviteBidders: req.body.inviteBidders,
		product_id: productData.product_id,
		auction_status: '0',
		n_bidders: '0',
		is_private: req.body.is_private,
		n_likes: '0',
		auctioneer_id: req.user.user_id,
		start_date: req.body.start_date,
		end_date: req.body.end_date,
		start_time: req.body.start_time,
		end_time: req.body.end_time
	}

	if(auctionData.inviteBidders == "on" && auctionData.is_private == "off"){
		invitedBidders = await inviteSuggestions(req,res);
		if(invitedBidders.suggestedMails.length > 0){
		// try {
		// 	let data=	await mailHelper({
		// 		email: invitedBidders.suggestedMails,
		// 		subject: "Auction Invitation",
		// 		text: "Auction Invitation",
		// 		html: `<h4>Hola<br>An auction with category = ${productData.product_category} is going to be organized. 
		// 				Check Out the details here: <a href="http://localhost:3001/feed/${auctionData.auction_id}">More info</a></h4>`
		// 		});
		// 		console.log("Invitation sent");
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
		}
	}else{
		console.log("Auction is private of user does not want suggestions");
	}
	
	try {
		// let productQuery = `INSERT INTO product` + productRows + ` values ('${productData.product_id}','${productData.product_name}','${productData.product_details}','${productData.product_category}', '${productData.product_pic}', '${productData.estimated_price}', '${productData.starting_price}','${productData.city}','${productData.pincode}')`;
		// await db.query(productQuery);
		// let insertQuery = `INSERT INTO auction` + auctionRows + `values ('${auctionData.auction_id}','${auctionData.product_id}', '${auctionData.auction_status}', '${auctionData.n_bidders}','${auctionData.is_private}','${auctionData.n_likes}','${auctionData.auctioneer_id}','${auctionData.start_date}', '${auctionData.end_date}','${auctionData.start_time}', '${auctionData.end_time}')`;
		// await db.query(insertQuery);
		return res.status(200).json({
			success: 1,
			n_suggestions: `${invitedBidders.suggestedMails.length}`,
			message: 'successfully created auction',
		});
	} catch (error) {
		return res.json({
			success: 0,
			error: `${error}`,
		});
	}
}

/* Generate auction feed sorted based on popularity(default) */
async function displayFeed() {
	try {
		let feedQuery = `SELECT * 
						FROM auction 
						INNER JOIN product ON auction.product_id=product.product_id WHERE is_private=0
						ORDER BY n_likes DESC,n_bidders DESC`;
		const rows = await db.query(feedQuery);
		const displayFeed = helper.emptyOrRows(rows);
		console.log(rows);

		return displayFeed;
	} catch (error) {
		return {
			success: 0,
			error: `${error}`,
		};
	}
}

async function getWinnerName(req) {
	const auction_id = req.params.id;
	console.log(auction_id);
	try {
		var winnerName;
		const winnerUserId = (await db.query(`SELECT winner_user_id FROM auction WHERE auction_id = '${auction_id}'`))[0].winner_user_id;
		console.log(winnerUserId);
		const query = `SELECT anonymous FROM user_auction_reg WHERE user_id = '${winnerUserId}'`;
		const isAnonymous = (await db.query(query))[0].anonymous;
		console.log(isAnonymous);
		if(isAnonymous == "off"){
			const userNameQuery = `SELECT user_name FROM user_data WHERE user_id = '${winnerUserId}'`;
			const userName = await db.query(userNameQuery);
			console.log(userName);
			winnerName = userName;
		}else{
			winnerName = "Anonymous";
		}
		return winnerName;
	} catch (error) {
		return {
			success: 0,
			error: `${error}`,
		};
	}
}



async function getBidDetails(req,res) {
	try{
		let getTopBids = `SELECT * FROM auction_bid_details WHERE auction_id='${req.params.id}'`;
		let topBidIds = (await db.query(getTopBids))[0];
		if(!topBidIds){
			return res.status(200).json({
				success: 1,
				bidDetails: [{bid_amount:0}]
			});
		}
		let topBidDetailsQuery = `SELECT bid_amount FROM auction_bids WHERE bid_id IN ('${topBidIds.highest_bid_id}','${topBidIds.second_highest_bid_id}','${topBidIds.third_highest_bid_id}') ORDER BY bid_amount DESC`
		let topBidDetails = await db.query(topBidDetailsQuery);
		// console.log(topBidDetails);
		return res.status(200).json({
			success: 1,
			bidDetails: topBidDetails
		});
	}catch (error) {
		return res.json({
			success: 0,
			error: `${error}`
		});
	}
}

/* Display auction details for auction_id */
async function displayAuction(auction_id) {
	try {
		let displayQuery = `SELECT * 
							FROM auction 
							INNER JOIN product ON auction.product_id=product.product_id 
							WHERE auction_id='${auction_id}'`;
		const rows = await db.query(displayQuery);
		const auction = helper.emptyOrRows(rows);
		return auction[0];
	} catch (error) {
		return {
			success: 0,
			error: `${error}`,
		};
	}
}

/* Modify auction details for auction_id */
async function modifyAuction(req) {
	let auction_id = req.params.id;

	try {
		let product_id = (await db.query(
			`SELECT product_id FROM auction WHERE auction_id='${auction_id}'`
		))[0].product_id;
		let updateProductQuery = `UPDATE product
								SET product_name='${req.body.product_name}', product_details='${req.body.product_details}', product_category='${req.body.product_category}', product_pic='${req.body.product_pic}', estimated_price='${req.body.estimated_price}', starting_price='${req.body.starting_price}', city='${req.body.city}', pincode='${req.body.pincode}'
								WHERE product_id= '${product_id}'`;
		await db.query(updateProductQuery);
		let updateQuery = `UPDATE auction 
						SET is_private='${req.body.is_private}',start_date='${req.body.start_date}',end_date='${req.body.end_date}',start_time='${req.body.start_time}',end_time='${req.body.end_time}'
						WHERE auction_id='${auction_id}'`;
		await db.query(updateQuery);
		return {
			success: 1,
			message: 'updation successful',
		};
	} catch (error) {
		return {
			success: 0,
			error: `${error}`,
		};
	}
}

async function closeAuction(req,res){
	const auction_id= req.params.id;
	try {
		var myDate = new Date();
    	var currentDate = date.format(myDate, "YYYY-MM-DD");
    	var currentTime = date.format(myDate, "HH:mm:ss");
		const updateQuery = `UPDATE auction 
							SET end_date='${currentDate}',end_time='${currentTime}' 
							WHERE auction_id='${auction_id}'`;
		await db.query(updateQuery);
		return {
			success: 1,
			message: 'auction closed',
		};
	} catch (error) {
		return {
			success: 0,
			error: `${error}`,
		};
	}
}

/* Add a like to the auction given auction_id */
async function updateLikes(auction_id) {
	
	try {
		let updateQuery = `UPDATE auction SET n_likes= n_likes + 1 WHERE auction_id='${auction_id}'`;
		await db.query(updateQuery);
		return {
			success: 1,
			message: 'liked',
		};
	} catch (error) {
		return {
			success: 0,
			error: `${error}`,
		};
	}
}

/* Get the list of auctions which comes under a particular category */
async function categoryAuctionFilter(category) {
	try {
		console.log(await db.query(`SELECT * FROM product`));
		let filterQuery = `SELECT *
							FROM auction
							INNER JOIN product
							ON auction.product_id = product.product_id WHERE product.product_category = '${category}'`;
		const rows = await db.query(filterQuery);
		const displayFilteredAuctions = helper.emptyOrRows(rows);
		return displayFilteredAuctions;
	} catch (error) {
		return {
			success: 0,
			error: `${error}`,
		};
	}
}

/* Get the list of auctions with given location */
async function categoryAuctionFilter(category) {
	try {
		let filterQuery = `SELECT *
							FROM auction
							INNER JOIN product
							ON auction.product_id = product.product_id WHERE product.product_category = '${category}'`;
		const rows = await db.query(filterQuery);
		const displayFilteredAuctions = helper.emptyOrRows(rows);
		return displayFilteredAuctions;
	} catch (error) {
		return {
			success: 0,
			error: `${error}`,
		};
	}
}

/* Get the list of auctions with given location */
async function locationAuctionFilter(location) {
	try {
		let filterQuery = `SELECT *
							FROM auction
							INNER JOIN user_address
							ON auction.auctioneer_id = user_address.user_id WHERE user_address.city = '${location}'`;
		const rows = await db.query(filterQuery);
		const displayFilteredAuctions = helper.emptyOrRows(rows);
		return displayFilteredAuctions;
	} catch (error) {
		return {
			success: 0,
			error: `${error}`,
		};
	}
}

/* Get the list of auctions with given location */
async function sortedAuctionFilter() {
	try {
		console.log(await db.query(`SELECT * FROM product`));
		let filterQuery = `SELECT *
							FROM auction
							INNER JOIN product
							ON auction.product_id = product.product_id ORDER BY product.estimated_price`;
		const rows = await db.query(filterQuery);
		const displaySortedAuctions = helper.emptyOrRows(rows);
		return displaySortedAuctions;
	} catch (error) {
		return {
			success: 0,
			error: `${error}`,
		};
	}
}

module.exports = {
	addAuction,
	displayFeed,
	displayAuction,
	modifyAuction,
	updateLikes,
	categoryAuctionFilter,
	locationAuctionFilter,
	sortedAuctionFilter,
	getBidDetails,
	getWinnerName,
	closeAuction
};
