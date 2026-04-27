const express = require('express');
const router = express.Router();

const produtosController = require('../controllers/produtosController');

// ============================================================
// ROTAS
// ============================================================

// GET /produtos
router.get('/', produtosController.listarTodos);

// GET /produtos/buscar/nome/:nome
router.get('/buscar/nome/:nome', produtosController.buscarPorNome);

// GET /produtos/buscar/id/:id
router.get('/buscar/id/:id', produtosController.buscarPorId);

// POST /produtos
router.post('/', produtosController.criar);

// PUT /produtos/:id
router.put('/:id', produtosController.atualizar);

// DELETE /produtos/:id
router.delete('/:id', produtosController.deletar);

module.exports = router;
