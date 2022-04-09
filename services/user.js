/* This file contains the fuctions that were called in the user routes file.*/

const db = require('./db');
const bcrypt = require('bcrypt');
const config = require('../config');
const jwt = require('jsonwebtoken');
const mailHelper = require("./mailHelper");
const { v4: uuidv4 } = require('uuid');
const date = require('date-and-time')

/* New user is created and added to the database*/
async function signUp(req, res) {
	let hashedPassword = await bcrypt.hash(req.body.password, 10);

	const inputData = {
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
		primary_number: req.body.primary_number,
		address: req.body.address,
		address_id: uuidv4(),
		city: req.body.address,
		pincode: req.body.pincode,
		mobile: req.body.mobile,
		profile_pic: req.body.profile_url,
		user_id: uuidv4(),
		username: req.body.email.substring(0, req.body.email.lastIndexOf('@')),
	};
	try {
		const rows = await db.query(
			`SELECT * FROM user_data WHERE email='${inputData.email}'`
		);
		if (rows.length >= 1) {
			return res.status(500).json({
				error: 'exist',
			});
		} else {
			const payload = {
				user_id: inputData.user_id,
				username: inputData.username,
				email: inputData.email,
			};
			let insertQuery = `INSERT INTO 
								user_data(user_id,user_name, email, password, name, primary_mobile, profile_pic) 
								VALUES 
								('${inputData.user_id}',
								'${inputData.username}', 
								'${inputData.email}', 
								'${inputData.password}', 
								'${inputData.name}', 
								'${inputData.primary_number}', 
								'${inputData.profile_pic}')`;
			let addressQuery = `INSERT INTO 
								user_address(address_id,user_id,address,city,pincode,mobile) 
								VALUES
								('${inputData.address_id}',
								'${inputData.user_id}',
								'${inputData.address}',
								'${inputData.city}',
								'${inputData.pincode}',
								'${inputData.mobile}')`;
			await db.query(insertQuery);
			await db.query(addressQuery);
			res.cookie(
				'token',
				jwt.sign(payload, config.jwt.secret)
			);
			return res.status(200).json({
				success: 1,
				message: 'successfully signed up',
				user_id: `${inputData.user_id}`,
				user_name: `${inputData.username}`
			});
			
		} 
	}catch (error) {
		console.log(error);
		return res.json({
			success: 0,
			message: `${error}`,
		});
	}
}

/* It matches the email id and password in database*/
async function login(req, res) {
	const email = req.body.email;
	const password = req.body.password;
	try {
		const row = await db.query(
			`SELECT * FROM user_data WHERE email='${email}'`
		);
		if (row.length == 0) {
			return res.status(404).json({
				error: "user with this email doesn't exist",
			});
		} else {

			bcrypt
				.compare(password, row[0].password)
				.then((isCorrect) => {
					if (isCorrect) {
						const payload = {
							user_id: row[0].user_id,
							username: row[0].user_name,
							email: row[0].email,
						};
						res.cookie(
							'token',
							jwt.sign(payload, config.jwt.secret)
						);
						return res.status(200).json({
							success: 1,
							message: 'successfully logged in',
							user_id: `${row[0].user_id}`,
							user_name:`${row[0].user_name}`
						});
					} else {
						res.status(200).json({ passworderror: 'password is not correct' });
					}
				})
				.catch((err) => console.log(err));
		}
	} catch (error) {
		console.log(error);
		return res.json({
			success: 0,
			message: `${error}`,
		});
	}
}

/* update user info */
async function updateUserInfo(req,res) {
	let updatedData = {
		name : req.body.name,
		email : req.body.email,
		primary_mobile : req.body.primary_mobile,
		profile_pic: req.body.profile_pic
	};
	let updateQuery = `UPDATE user_data 
						SET email='${updatedData.email}', 
					    name='${updatedData.name}', 
						primary_mobile='${updatedData.primary_mobile}', 
						profile_pic='${updatedData.profile_pic}' 
						WHERE user_name='${req.user.username}'`;
	try {
		await db.query(updateQuery);
		return res.status(200).json({
			success: 1,
			message: 'successfully updated',
		});
	} catch (error) {
		console.log(error);
		return res.json({
			success: 0,
			message: `${error}`,
		});
	}
}

/* Adding a new user address*/
async function addUserAddress(req,res){
	let newAddress = {
		address: req.body.address,
		city: req.body.city,
		pincode: req.body.pincode,
		mobile: req.body.mobile,
		address_id: uuidv4()
	}
	let addressQuery = `INSERT INTO 
						user_address(address_id,user_id,address,city,pincode,mobile) 
						VALUES
						('${newAddress.address_id}','${req.user.user_id}',
						'${newAddress.address}','${newAddress.city}',
						'${newAddress.pincode}','${newAddress.mobile}')`;
	try {
		await db.query(addressQuery);
		return res.status(200).json({
			success: 1,
			message: 'successfully added address',
		});
	} catch (error) {
		console.log(error);
		return res.json({
			success: 0,
			message: `${error}`,
		});
	}
}

/* deleting a user address that was previously created*/
async function deleteUserAddress(req,res){
	const address_id = req.body.address_id;
	let addressQuery = `DELETE FROM user_address WHERE address_id='${address_id}'`;
	try {
		await db.query(addressQuery);
		return res.status(200).json({
			success: 1,
			message: 'successfully deletd address',
		});
	} catch (error) {
		console.log(error);
		return res.json({
			success: 0,
			message: `${error}`,
		});
	}
}

/* get user details*/
async function getUserDetails(req,res) {
	let userInfoQuery = `SELECT * FROM user_data WHERE user_name='${req.user.username}'`;
	let userAddressQuery =`SELECT * FROM user_address WHERE user_id='${req.user.user_id}'`;

	try {
		const userArray = await db.query(userInfoQuery);
		const userAddressArray = await db.query(userAddressQuery);
		const user = userArray[0];
		return res.status(200).json({
			success: 1,
			userData: {user},
			userAddress: userAddressArray
		});
	} catch (error) {
		console.log(error);
		return res.json({
			success: 0,
			message: `${error}`,
		});
	}
}

/* get user registered auctions(upcoming, completed, ongoing) */
async function getRegisteredAuctions(req,res) {
	const user_id = req.user.user_id;
	let getRegisteredAuctionQuery = `SELECT* FROM auction 
									INNER JOIN product ON auction.product_id=product.product_id 
									WHERE auction_id IN 
									(SELECT auction_id FROM user_auction_reg WHERE user_id='${user_id}')`;
	try {
		const registeredAuctions = await db.query(getRegisteredAuctionQuery);
		return res.status(200).json({
			success:1,
			registeredAuctions: registeredAuctions
		});
	} catch (error) {
		console.log(error);
		return res.json({
			success: 0,
			message: `${error}`,
		});
	}
}

/* get user's orgainsed auctions */
async function getMyAuctions(req,res) {
	const user_id = req.user.user_id;
	let getMyAuctionsQuery = `SELECT * 
							FROM auction 
							INNER JOIN product ON auction.product_id=product.product_id 
							WHERE auctioneer_id='${user_id}'`;
	try {
		const myAuctions = await db.query(getMyAuctionsQuery);
		return res.status(200).json({
			success:1,
			myAuctions: myAuctions
		});
	} catch (error) {
		console.log(error);
		return res.json({
			success: 0,
			message: `${error}`,
		});
	}
}

/* user register auction */
async function registerForAuction(req,res) {
	const auction_id = req.body.auction_id;
	const user_id = req.user.user_id;
	var anonymous = 1;
	if(req.body.anonymous == 'off')
		anonymous = 0;

	let insertQuery = `INSERT INTO user_auction_reg(user_id, auction_id,anonymous) 
						values ('${user_id}','${auction_id}','${anonymous}')`;
	try {
		await db.query(insertQuery);
		const increaseBidderQuery = `UPDATE auction SET n_bidders=n_bidders+1 WHERE auction_id='${auction_id}'`;
		await db.query(increaseBidderQuery);
		try {
			const userMailQuery = `SELECT email FROM user_data WHERE user_id = '${user_id}'`;
			const userMail = (await db.query(userMailQuery))[0]; 
			let data=	await mailHelper({
				email: userMail.email,
				subject: "Auction Registration",
				text: "Auction Registration",
				html: `<h4>Successfully registered for the Auction.<br> 
						Check out the details here: 
						<a href="http://localhost:3001/feed/${auction_id}"> More info</a></h4>`
				});
			} catch (error) {
				console.log(error);
			}

		return res.status(200).json({
			success: 1,
			message : "successfully registered"
		});
	} catch (error) {
		console.log(error);
		return res.json({
			success: 0,
			message: `${error}`,
		});
	}
}

/* user unregister auction */
async function unregisterForAuction(req,res) {
	const auction_id = req.body.auction_id;
	const user_id = req.user.user_id;
	let deleteQuery = `DELETE FROM user_auction_reg WHERE user_id='${user_id}' AND auction_id='${auction_id}'`;
	try {
		await db.query(deleteQuery);
		return res.status(200).json({
			success: 1,
			message : "successfully unregistered"
		});
	} catch (error) {
		console.log(error);
		return res.json({
			success: 0,
			message: `${error}`,
		});
	}
}

/* user bidding in an auction */
async function bid(req,res) {
	const inputBidDetails = {
		bid_id: uuidv4(),
		auction_id: req.params.auction_id,
		bid_amount: req.body.bid_amount,
		user_id: req.user.user_id
	}
	try {
		const auctionDetailsQuery = `SELECT start_date,end_date,start_time,end_time 
									FROM auction 
									WHERE auction_id='${inputBidDetails.auction_id}'`; 
		const auctionDetails = (await db.query(auctionDetailsQuery))[0];

		var myDate = new Date();
    	var currentDate = date.format(myDate, "YYYY-MM-DD");
    	var currentTime = date.format(myDate, "HH:mm:ss");
    	if((date.format(auctionDetails.end_date,"YYYY-MM-DD") < currentDate) || 
			((date.format(auctionDetails.end_date,"YYYY-MM-DD") == currentDate)&& 
			(currentTime > auctionDetails.end_time) ) )
      	{
			return res.json({
				success: 0,
				message : "Auction has ended"
			});
		}
		if((date.format(auctionDetails.start_date,"YYYY-MM-DD") > currentDate) || 
			((date.format(auctionDetails.start_date,"YYYY-MM-DD") == currentDate)&& 
			(currentTime < auctionDetails.start_time) ) )
      	{
			return res.json({
				success: 0,
				message : "Auction has not started yet"
			});
		  }
		
		const getStartingPrice = `SELECT starting_price FROM product 
								WHERE product_id = (SELECT product_id FROM auction
								 WHERE auction_id='${inputBidDetails.auction_id}')`;
		const startingPrice = (await db.query(getStartingPrice))[0].starting_price;
		if(startingPrice > inputBidDetails.bid_amount){
			return res.json({
				success: 0,
				message : "your bid is less than than the starting bid"
			});
		}
		let insertBidQuery = `INSERT INTO auction_bids 
							VALUES('${inputBidDetails.bid_id}','${inputBidDetails.auction_id}',
							'${inputBidDetails.bid_amount}','${inputBidDetails.user_id}')`;
		await db.query(insertBidQuery);

		let getTopBids = `SELECT * FROM auction_top_bids WHERE auction_id='${inputBidDetails.auction_id}'`;
		let topBidIds = (await db.query(getTopBids))[0];
		if(!topBidIds){
			let insertBidQuery = `INSERT INTO auction_top_bids 
								VALUES('${inputBidDetails.auction_id}','${inputBidDetails.bid_id}',
								'${inputBidDetails.bid_id}','${inputBidDetails.bid_id}')`;
			await db.query(insertBidQuery);
			const updateWinnerQuery =`UPDATE auction SET winner_user_id='${req.user.user_id}' 
										WHERE auction_id='${inputBidDetails.auction_id}'`;
			await db.query(updateWinnerQuery);
		}else{
			let topBidDetailsQuery = `SELECT bid_amount 
									FROM auction_bids WHERE bid_id 
									IN ('${topBidIds.highest_bid_id}',
									'${topBidIds.second_highest_bid_id}',
									'${topBidIds.third_highest_bid_id}') 
									ORDER BY bid_amount DESC`;
			let topBidDetails = await db.query(topBidDetailsQuery);

			if(inputBidDetails.bid_amount > topBidDetails[0].bid_amount){
				const updateBidQuery = `UPDATE auction_top_bids SET 
										highest_bid_id='${inputBidDetails.bid_id}', 
										second_highest_bid_id='${topBidIds.highest_bid_id}', 
										third_highest_bid_id='${topBidIds.second_highest_bid_id}' 
										WHERE auction_id ='${inputBidDetails.auction_id}'`;
				
				await db.query(updateBidQuery);
				const updateWinnerQuery =`UPDATE auction SET winner_user_id='${req.user.user_id}'`;
				await db.query(updateWinnerQuery);
			}else{
				return res.json({
					success: 0,
					message : "your bid is less than than the highest bid"
				});
			}
		}
		return res.status(200).json({
			success: 1,
			message : "successful bid"
		});
	} catch (error) {
		console.log(error);
		return res.json({
			success: 0,
			error: `${error}`,
		});
	}
}

module.exports = {
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
};