const express = require('express');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectToDatabase = require('./db');
require('dotenv').config();

// Configurações do servidor
const app = express();
const port = process.env.PORT;

// Configuração do Swagger
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API de Filmes',
        version: '1.0.0',
        description: 'Uma API para gerenciar filmes',
      },
      tags: [
        {
          name: 'Filmes',
          description: 'Operações relacionadas a filmes',
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
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ['./app/routes/*.js'], // Caminho para os arquivos de rotas da API
  };

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const movieRoutes = require('./app/routes/movieRoutes');
const authenticateRoutes = require('./app/routes/authenticateRoutes');

// Configuração do parser de requisição
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexão com o banco de dados
connectToDatabase();

// Rotas da API
app.use('/api/movies', movieRoutes);
app.use('/api', authenticateRoutes);

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
