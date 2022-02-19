const db = require('./db');
const helper = require('../helper');

/* sample api to get details of all users */
async function getAllUsers(){
    const rows = await db.query(
      // `SELECT id, name, released_year, githut_rank, pypl_rank, tiobe_rank 
      // FROM programming_languages`
      `select * from demo`
    );
    const data = helper.emptyOrRows(rows);
    return {data}
}

module.exports = {
    getAllUsers,
};