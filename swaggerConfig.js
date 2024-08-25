// swaggerConfig.js
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
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication operations'
      },
      {
        name: 'User',
        description: 'Operations about users'
      },
      {
        name: 'Person',
        description: 'Operations about persons'
      },
      {
        name: 'Events',
        description: 'Event management'
      },
      {
        name: 'Relationship',
        description: 'Relationship management'
      },
      {
        name: 'Family',
        description: 'Family management'
      },
      {
        name: 'Document',
        description: 'Document management'
      },
      {
        name: 'DNA Test',
        description: 'DNA test management'
      },
      {
        name: 'Person Alias',
        description: 'Person alias management'
      },
      {
        name: 'Family Tree',
        description: 'Family tree operations'
      },
      {
        name: 'Dashboard',
        description: 'Dashboard operations'
      }
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
  apis: ['./routes/api/*.js'], 
};


const swaggerSpec = swaggerJsdoc(options);

const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    plugins: [
      {
        statePlugins: {
          spec: {
            wrapSelectors: {
              allowTryItOutFor: () => () => true
            }
          }
        }
      }
    ]
  }
};

module.exports = { swaggerSpec, swaggerUiOptions };