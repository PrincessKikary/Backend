const process = require('process');
const axios = require('axios');
const moment = require('moment');

const AZAMPAY_BASE_URL = 'https://authenticator-sandbox.azampay.co.tz'; // I use sandbox URL for now
const CLIENT_ID = process.env.AZAMPAY_CLIENT_ID;
const CLIENT_SECRET = process.env.AZAMPAY_CLIENT_SECRET;
const APP_NAME = process.env.AZAMPAY_APP_NAME;

let accessToken = null;
let tokenExpiry = null;

const generateToken = async () => {
  try {
    const response = await axios.post(`${AZAMPAY_BASE_URL}/AppRegistration/GenerateToken`, {
      appName: APP_NAME,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET
    });

    if (response.data && response.data.data) {
      accessToken = response.data.data.accessToken;
      tokenExpiry = moment().add(response.data.data.expire, 'seconds');
      return accessToken;
    } else {
      throw new Error('Failed to generate token');
    }
  } catch (error) {
    console.error('Error generating AzamPay token:', error);
    throw error;
  }
};

const getValidToken = async () => {
  if (!accessToken || moment().isAfter(tokenExpiry)) {
    await generateToken();
  }
  return accessToken;
};

module.exports = {
  getValidToken
};