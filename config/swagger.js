const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Brainchit Utils API',
      version: '1.0.0',
      description: 'A utility server with various endpoints for data management and tracking',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:7000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        MasterKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-master-key',
          description: 'Master key for API authentication',
        },
      },
      schemas: {
        NutritionData: {
          type: 'object',
          required: ['totalCalorie', 'totalProtien'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated MongoDB ID',
              example: '68f12f51d49b25100b920e32',
            },
            totalCalorie: {
              type: 'number',
              minimum: 0,
              description: 'Total calories consumed',
              example: 2000,
            },
            totalProtien: {
              type: 'number',
              minimum: 0,
              description: 'Total protein in grams',
              example: 150,
            },
            totalFats: {
              type: 'number',
              minimum: 0,
              nullable: true,
              description: 'Total fats in grams (optional)',
              example: 60,
            },
            totalCarbs: {
              type: 'number',
              minimum: 0,
              nullable: true,
              description: 'Total carbohydrates in grams (optional)',
              example: 250,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the entry was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the entry was last updated',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            error: {
              type: 'string',
              example: 'Detailed error description',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operation successful',
            },
            data: {
              type: 'object',
            },
          },
        },
      },
    },
    security: [
      {
        MasterKeyAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './server.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
