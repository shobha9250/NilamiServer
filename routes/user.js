const {getAllUsers} = require("../services/user");
const router = require("express").Router();
const {verifyToken} = require('../middlewares/auth');


//sample api to get details of all users
router.get("/allUsers",verifyToken, async function(req, res, next) {
    try {
      res.json(await getAllUsers(req.query.page));
    } catch (err) {
      console.error(`Error while getting users `, err.message);
      next(err);
    }
});

module.exports = router;