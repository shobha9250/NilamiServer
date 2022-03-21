const config = require('../config');
const jwt = require('jsonwebtoken');
const db = require('../services/db');

exports.verifyToken = (req, res, next) => {
	const token = req.cookies['token'];
	console.log(token);
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

exports.verifyAuctioneer = async(req,res,next) => {
	// const user_id = req.user.user_id;
	const auction_id = req.params.id;
	try {
		const findAuctioneerQuery = `SELECT auctioneer_id FROM auction WHERE auction_id='${auction_id}'`;
		const auctioneer_id= (await db.query(findAuctioneerQuery))[0];

		console.log("hehe");
		// console.log(userArray);
		if(auctioneer_id != req.user.user_id){
			return res.status(403).json({
				success: 0,
				err: "unauthorized request, you are not the auctioneer",
			});
		}
	} catch (error) {
		return res.status(403).send('You are not the auctioneer');
	}
	return next();
}