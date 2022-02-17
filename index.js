const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//import the routes
const userRoutes = require('./routes/user');

app.use(cors({origin: true}));

//use custom routes
app.use(userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});