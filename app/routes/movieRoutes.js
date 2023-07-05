const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

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
// Rota para criar um novofilme
router.post('/', (req, res) => {
    const movie = new Movie(req.body);
    movie.save()
      .then(() => {
        res.status(201).json({ message: 'Filme criado com sucesso.' });
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
 *         description: Filme atualizado com sucesso
 *       404:
 *         description: Filme não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
// Rota para atualizar um filme existente
router.put('/:id', (req, res) => {
    Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(movie => {
        if (!movie) {
          res.status(404).json({ message: 'Filme não encontrado.' });
        } else {
          res.json({ message: 'Filme atualizado com sucesso.' });
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
 *     summary: Remove um filme existente
 *     tags: [Filmes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do filme a ser removido
 *     responses:
 *       200:
 *         description: Filme removido com sucesso
 *       404:
 *         description: Filme não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
// Rota para remover um filme existente
router.delete('/:id', (req, res) => {
    Movie.findByIdAndRemove(req.params.id)
      .then(movie => {
        if (!movie) {
          res.status(404).json({ message: 'Filme não encontrado.' });
        } else {
          res.json({ message: 'Filme removido com sucesso.' });
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });

module.exports = router;
