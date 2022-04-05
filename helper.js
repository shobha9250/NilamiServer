/*It is used to detect whether a sql query returned empty rows*/

function emptyOrRows(rows) {
	if (!rows) {
		return [];
	}
	return rows;
}

module.exports = {
	emptyOrRows,
};
