const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
const AUTH_USERNAME = process.env.AUTH_USERNAME;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;

/**
 * @swagger
 * /api/login:
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
    res.json({ token: token , expiresIn: '1h'});
  } else {
    res.status(401).json({ message: 'Credenciais inválidas.' });
  }
});

module.exports = router;

  