const db = require('./db');
const helper = require('../helper');
const bcrypt = require('bcrypt');
const config = require('../config');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

async function signUp(req, res) {
	let hashedPassword = await bcrypt.hash(req.body.password, 10);

	const inputData = {
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
		primary_number: req.body.primary_number,
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
			let insertQuery = `INSERT INTO user_data(user_id,user_name, email, password, name, primary_mobile) values ('${inputData.user_id}','${inputData.username}', '${inputData.email}', '${inputData.password}', '${inputData.name}', '${inputData.primary_number}')`;
			db.query(insertQuery)
				.then((result) => {
					res.cookie(
						'token',
						jwt.sign(payload, config.jwt.secret, { expiresIn: 3600 })
					);
					return res.status(501).json({
						success: 1,
						message: 'successfully signed up',
					});
				})
				.catch((err) => {
					return res.status(500).json({
						error: err,
					});
				});
		}
	} catch (error) {
		console.log(error);
	}
}

async function login(req, res) {
	const email = req.body.email;
	const password = req.body.password;

	try {
		const row = await db.query(
			`SELECT * FROM user_data WHERE email='${email}'`
		);
		if (!row) {
			return res.status(404).json({
				error: "user with this email doesn't exist",
			});
		} else {
			bcrypt
				.compare(password, row[0].password)
				.then((isCorrect) => {
					if (isCorrect) {
						const payload = {
							user_id: row.user_id,
							username: row.username,
							email: row.email,
						};
						res.cookie(
							'token',
							jwt.sign(payload, config.jwt.secret, { expiresIn: 3600 })
						);
						return res.status(501).json({
							success: 1,
							message: 'successfully signed up',
						});
					} else {
						res.status(400).json({ passworderror: 'password is not correct' });
					}
				})
				.catch((err) => console.log(err));
		}
	} catch (error) {
		console.log(error);
	}
}

/* update user info api */
async function updateUserInfo(user_name) {
	let rq = req.query;
	let updateQuery = `UPDATE user_data WHERE user_name='${user_name}' SET username='${rq.user_name}', email='${rq.email}', name='${rq.name}', primary_number='${rq.primary_number}', profile_picture='${rq.profile_picture}'`;
	await db.query(updateQuery);
}

/* get user details api */
async function userDetails(user_name) {
	let displayUser = `SELECT * FROM user_data WHERE user_name='${user_name}'`;
	const rows = await db.query(displayUser);
	const user = helper.emptyOrRows(rows);
	console.log('User page');
	return user;
}

/* get user registered auctions(upcoming, completed, ongoing) */

/* user register auction */
async function registerForAuction(user_id, auction_id) {
	let insertQuery = `INSERT INTO user_auction_reg(user_id, auction_id) values ('${user_id}','${auction_id}')`;
	await db.query(insertQuery);
}

/* user unregister auction */
async function unregisterForAuction(user_id, auction_id) {
	let deleteQuery = `DELETE FROM user_auction_reg WHERE user_id='${user_id}' AND auction_id='${auction_id}'`;
	await db.query(deleteQuery);
}

module.exports = {
	signUp,
	login,
	userDetails,
	updateUserInfo,
  registerForAuction,
  unregisterForAuction
};
