const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Configurações do servidor
const app = express();
const port = 3000;

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

// Configuração do parser de requisição
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

// Configuração do MongoDB
mongoose.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.9pxsej5.mongodb.net/MovieDB?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log("Conectado ao banco!")
})
.catch((err) => console.log(err));

// Rotas da API
app.use('/api/movies', movieRoutes);

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
