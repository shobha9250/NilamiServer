const db = require('./db');
const helper = require('../helper');
const bcrypt = require('bcrypt');

/* check valid user */
async function validUser(user) {
	const validEmail = typeof user.email == 'string' && user.email.trim() != '';

	const validPassword =
		typeof user.password == 'string' &&
		user.password.trim() != '' &&
		user.password.trim().length >= 5;

	return validEmail && validPassword;
}

/* signup api */
async function signUp(req, res) {
	if (validUser(req.body)) {
		const body = req.body;
		const email = body.email;
		let hashedPassword = await bcrypt.hash(body.password, 10);

		db.query(
			`SELECT * FROM user_data WHERE email=?`,
			[email],
			(err, results) => {
				if (err) {
					return res.status(500).json({
						error: err,
					});
				}
        console.log('x' + results);
				if (results.rows.length > 0) {
					return res.status(409).json({
						message: 'mail exists already',
					});
				} else {
					let insertQuery = `INSERT INTO user_data(username, email, password, name, primary_number) values ('${body.username}', '${body.email}', ${hashedPassword}, '${body.name}', '${body.primary_number}')`;
					await db.query(insertQuery);
					return res.status(501).json({
						success: 1,
						message: 'successfully signed up',
					});
				}
			}
		);
	}
}

/* login api */
async function login(req, res) {
	let body = req.body;
	let email = body.email;
	let password = body.password;
	getUserByEmail(email, (err, results) => {
		if (err) {
			console.log(err);
		}
		if (!results) {
			return res.json({
				success: 0,
				data: 'Invalid email or password',
			});
		}
		const result = compareSync(body.password, results.password);
		if (result) {
			results.password = undefined;
			const jsontoken = sign({ result: results }, 'qwe1234', {
				expiresIn: '1h',
			});
			return res.json({
				success: 1,
				message: 'login successfully',
				token: jsontoken,
			});
		} else {
			return res.json({
				success: 0,
				data: 'Invalid email or password',
			});
		}
	});
}

/* sample api to get details of all users */
async function getAllUsers() {
	const rows = await db.query(
		`SELECT id, name, released_year, githut_rank, pypl_rank, tiobe_rank 
      FROM programming_languages`
	);
	const data = helper.emptyOrRows(rows);
	return { data };
}

module.exports = {
	signUp,
	login,
	getAllUsers,
};
