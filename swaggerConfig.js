const swaggerJsdoc = require('swagger-jsdoc');
const baseUrl = require('./utils/config');


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Family Tree API',
      version: '1.0.0',
      description: 'API documentation for the Family Tree application',
    },
    servers: [
      {
        url: baseUrl,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./routes/api/*.js'], // Path to the API routes
};

module.exports = swaggerJsdoc(options);