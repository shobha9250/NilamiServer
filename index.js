const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT;
console.log(port);

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

//import the routes
const userRoutes = require('./routes/user');
const auctionRoutes = require('./routes/auction');

app.use(cors({ origin: true }));

//use custom routes
app.use('/user', userRoutes);
app.use('/auction', auctionRoutes);

app.get('/', (req, res) => {
	res.json({ message: 'ok' });
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
