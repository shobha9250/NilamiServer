require('dotenv').config();

const config = {
    db: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  };
module.exports = config;