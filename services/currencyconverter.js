const process = require('process');
const axios = require('axios');

const EXCHANGE_RATE = 2711.00

const getExchangeRate = async ({ from, to }) => {
    try {
        const response = EXCHANGE_RATE * parseFloat(from);
        return response;
    } catch (error) {
        console.error('Error getting exchange rate:', error);
        throw error;
    }
};

module.exports = {
    getExchangeRate
}