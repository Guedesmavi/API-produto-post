const produtosModel = require('../models/produtosModel');

async function listarTodos(req, res) {
  try {
    const produtos = await produtosModel.listarTodos();
    res.status(200).json(produtos);
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao listar produtos', 
      erro: erro.message 
    });
  }
}

async function buscarPorId(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ mensagem: 'ID inválido' });
    }

    const produto = await produtosModel.buscarPorId(id);

    if (produto) {
      res.status(200).json(produto);
    } else {
      res.status(404).json({ mensagem: `Produto ${id} não encontrado` });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao buscar produto',
      erro: erro.message 
    });
  }
}

async function criar(req, res) {
  try {
    const { nome, preco, estoque, categoria } = req.body;

    if (!nome || !preco || !estoque || !categoria) {
      return res.status(400).json({ 
        mensagem: 'Todos os campos são obrigatórios' 
      });
    }

    const novoProduto = await produtosModel.criar({ 
      nome, preco, estoque, categoria 
    });

    res.status(201).json(novoProduto);
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao criar produto',
      erro: erro.message 
    });
  }
}

async function atualizar(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { nome, preco, estoque, categoria } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ mensagem: 'ID inválido' });
    }

    if (!nome || !preco || !estoque || !categoria) {
      return res.status(400).json({ 
        mensagem: 'Todos os campos são obrigatórios' 
      });
    }

    const produtoAtualizado = await produtosModel.atualizar(id, {
      nome, preco, estoque, categoria
    });

    if (produtoAtualizado) {
      res.status(200).json(produtoAtualizado);
    } else {
      res.status(404).json({ mensagem: `Produto ${id} não encontrado` });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao atualizar produto',
      erro: erro.message 
    });
  }
}

async function deletar(req, res) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ mensagem: 'ID inválido' });
    }

    const deletado = await produtosModel.deletar(id);

    if (deletado) {
      res.status(200).json({ 
        mensagem: `Produto ${id} removido com sucesso` 
      });
    } else {
      res.status(404).json({ 
        mensagem: `Produto ${id} não encontrado` 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao deletar produto',
      erro: erro.message 
    });
  }
}

async function buscarPorNome(req, res) {
  try {
    const { nome } = req.params;
    const produtos = await produtosModel.buscarPorNome(nome);
    res.status(200).json(produtos);
  } catch (erro) {
    res.status(500).json({ 
      mensagem: 'Erro ao buscar produtos',
      erro: erro.message 
    });
  }
}

module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  buscarPorNome
};