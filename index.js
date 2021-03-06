const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookies = require('cookie-parser');
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(cookies());

//import the routes
const userRoutes = require('./routes/user');
const auctionRoutes = require('./routes/auction');

app.use(cors({ credentials: true,origin: true }));

//use custom routes
app.use('/user', userRoutes);
app.use('/auction', auctionRoutes);

app.get('/', (req, res) => {
	token = req.cookies['token'];
	res.json({ message: 'ok' });
});

app.listen(port, () => {
	console.log(` listening at http://localhost:${port}`);
});
