const config = require('../config');
const jwt = require('jsonwebtoken');
const db = require('../services/db');

/* verifyToken function verifies the json web token that is stored in cookies */ 
exports.verifyToken = (req, res, next) => {
	const token = req.cookies['token'];
	if (!token) {
		return res.status(403).send('A token is required for authentication');
	}
	try {
		const decoded = jwt.verify(token, config.jwt.secret);
		req.user = decoded;
	} catch (err) {
		return res.status(401).send('Invalid Token');
	}
	return next();
};

/* verifyAuctioneer fuction checks if the current user is the auctioneer */
exports.verifyAuctioneer = async(req,res,next) => {
	const auction_id = req.params.id;
	try {
		const findAuctioneerQuery = `SELECT auctioneer_id 
									FROM auction 
									WHERE auction_id='${auction_id}'`;
		const auctioneer_id= (await db.query(findAuctioneerQuery))[0].auctioneer_id;
		if(auctioneer_id != req.user.user_id){
			return res.status(403).json({
				success: 0,
				err: "unauthorized request, you are not the auctioneer",
			});
		}
	} catch (error) {
		return res.status(401).send('You are not the auctioneer');
	}
	return next();
}