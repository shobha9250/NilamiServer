
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

// These id's and secrets should come from .env file.
const CLIENT_ID = process.env.MAIL_CLIENT_ID;
const CLEINT_SECRET = process.env.MAIL_SECRET;
const REDIRECT_URI = process.env.MAIL_REDIRECT_URI;
const REFRESH_TOKEN = process.env.MAIL_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const mailHelper = async (options) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'noreply.nilami@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    
    console.log(options.email);

    const mailOptions = {
      from: 'noreply.nilami@gmail.com',
      to: options.email,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    return new Promise(async(resolve, reject) => {
            try {
              let info = await transport.sendMail(mailOptions);
              console.log(info);
              resolve(info.messageId);
            } catch (error) {
              console.log(error);
              reject(error);
            }
          });
  } catch (error) {
    return error;
  }
}

module.exports = mailHelper;
