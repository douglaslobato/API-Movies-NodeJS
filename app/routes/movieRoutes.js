const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
const AUTH_USERNAME = process.env.AUTH_USERNAME;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;

/**
 * @swagger
 * tags:
 *   name: Filmes
 *   description: Operações relacionadas a filmes
 * security:
 *   - bearerAuth: []
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Titulo do filme
 *         director:
 *           type: string
 *           description: Diretor do filme
 *         releaseYear:
 *           type: integer
 *           description: Ano de lançamento do filme
 *       example:
 *         title: Filme exemplo
 *         director: Nome exemplo
 *         releaseYear: 2010
 */

/**
 * @swagger
 * /api/movies/login:
 *   post:
 *     summary: Autentica o usuário e retorna um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nome de usuário
 *               password:
 *                 type: string
 *                 description: Senha
 *             example:
 *               username: string
 *               password: string
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida. Retorna um token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação.
 *       401:
 *         description: Credenciais inválidas. A autenticação falhou.
 */
// Rota de autenticação
router.post('/login', (req, res) => {
  // Autenticação do usuário
  const username = req.body.username;
  const password = req.body.password;

  // Verificação do usuário e senha
  if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
    // Criação do token JWT
    const token = jwt.sign({ username: username }, jwtSecret, { expiresIn: '1h' });
    res.json({ token: token });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas.' });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Token recebido:', authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  const token = authHeader.split(' ')[1]; // Removendo a palavra 'Bearer' e obtendo apenas o token

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Falha na autenticação do token.' });
    }
    req.user = user;
    next();
  });
};

// Rotas protegidas, exigem autenticação
router.use(authenticateToken);

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Retorna todos os filmes
 *     tags: [Filmes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de filmes retornada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
// Rota para listar todos os filmes
router.get('/', (req, res) => {
    Movie.find()
      .then(movies => {
        res.json(movies);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Retorna um filme pelo ID
 *     tags: [Filmes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do filme a ser obtido
 *     responses:
 *       200:
 *         description: Filme retornado com sucesso
 *       404:
 *         description: Filme não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
// Rota para obter um filme pelo ID
router.get('/:id', (req, res) => {
    Movie.findById(req.params.id)
      .then(movie => {
        if (!movie) {
          res.status(404).json({ message: 'Filme não encontrado.' });
        } else {
          res.json(movie);
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Cria um novo filme
 *     tags: [Filmes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Filme criado com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
// Rota para criar um novo filme
router.post('/', (req, res) => {
    const movie = new Movie(req.body);
    movie
      .save()
      .then(savedMovie => {
        res.status(201).json(savedMovie);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
  

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Atualiza um filme existente
 *     tags: [Filmes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do filme a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *           description: Filme atualizado com sucesso
 *       404:
 *           description: Filme não encontrado
 *       500:
 *           description: Erro interno do servidor
 */

// Rota para atualizar um filme existente
router.put('/:id', (req, res) => {
    Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(updatedMovie => {
        if (!updatedMovie) {
          res.status(404).json({ message: 'Filme não encontrado.' });
        } else {
          res.json(updatedMovie);
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
 
/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Exclui um filme
 *     tags: [Filmes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do filme a ser excluído
 *     responses:
 *       200:
 *         description: Filme excluído com sucesso
 *       404:
 *         description: Filme não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
// Rota para excluir um filme
router.delete('/:id', (req, res) => {
    Movie.findByIdAndRemove(req.params.id)
      .then(deletedMovie => {
        if (!deletedMovie) {
          res.status(404).json({ message: 'Filme não encontrado.' });
        } else {
          res.json({ message: 'Filme excluído com sucesso.' });
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
  
  module.exports = router;
  
