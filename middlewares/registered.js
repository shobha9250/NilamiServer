const db = require('../services/db');

/* Checks if the current user is registered for the current auction */
exports.verifyRegistration = async(req,res,next) => {
	const user_id = req.user.user_id;
	const auction_id = req.params.id;
	try {
		const checkRegisteredQuery = `SELECT * FROM user_auction_reg WHERE auction_id='${auction_id}' AND user_id='${user_id}'`;
		const checkValue = (await db.query(checkRegisteredQuery));
		if(checkValue.length < 1){
			return res.json({
				success: 0,
				err: "not registered for the auction",
			});
		}
	} catch (error) {
		return res.send('something went wrong');
	}
	return next();
}