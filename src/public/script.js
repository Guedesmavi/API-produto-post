// ========================================
// VARIÁVEIS GLOBAIS
// ========================================

let produtoEmEdicao = null;

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function mostrarMensagem(mensagem, tipo = 'info') {
    const modal = document.getElementById('modalMessage');
    const modalText = document.getElementById('modalText');
    
    modalText.textContent = mensagem;
    modal.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalMessage').style.display = 'none';
}

function limparFormulario() {
    document.getElementById('productForm').reset();
    produtoEmEdicao = null;
    document.querySelector('.form-section h2').textContent = 'Adicionar ou Editar Produto';
}

// ========================================
// OPERAÇÕES COM A API
// ========================================

async function carregarProdutos() {
    const loadingMessage = document.getElementById('loadingMessage');
    const emptyMessage = document.getElementById('emptyMessage');
    const productsList = document.getElementById('productsList');
    
    loadingMessage.style.display = 'block';
    productsList.innerHTML = '';
    
    try {
        const resposta = await fetch('/produtos');
        
        if (!resposta.ok) throw new Error('Erro ao buscar produtos');
        
        const produtos = await resposta.json();
        loadingMessage.style.display = 'none';
        
        if (produtos.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
            exibirTabela(produtos);
        }
    } catch (erro) {
        loadingMessage.style.display = 'none';
        emptyMessage.style.display = 'block';
        mostrarMensagem('Erro ao carregar produtos', 'erro');
    }
}

async function criarProduto(dados) {
    try {
        const resposta = await fetch('/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.erro || 'Erro ao criar produto');
        }

        mostrarMensagem('Produto cadastrado com sucesso!', 'sucesso');
        limparFormulario();
        carregarProdutos();

    } catch (erro) {
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

async function atualizarProduto(id, dados) {
    try {
        const resposta = await fetch(`/produtos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.erro || 'Erro ao atualizar produto');
        }

        mostrarMensagem('Produto atualizado!', 'sucesso');
        limparFormulario();
        carregarProdutos();

    } catch (erro) {
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

async function deletarProduto(id) {
    if (!confirm('Deseja deletar este produto?')) return;

    try {
        const resposta = await fetch(`/produtos/${id}`, {
            method: 'DELETE'
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.erro || 'Erro ao deletar');
        }

        mostrarMensagem('Produto removido!', 'sucesso');
        carregarProdutos();

    } catch (erro) {
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

// ========================================
// EXIBIÇÃO
// ========================================

function exibirTabela(produtos) {
    const productsList = document.getElementById('productsList');
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                    <th>Categoria</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    produtos.forEach(produto => {
        html += `
            <tr>
                <td>#${produto.id}</td>
                <td>${produto.nome}</td>
                <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
                <td>${produto.estoque}</td>
                <td>${produto.categoria}</td>
                <td>
                    <button class="btn btn-edit" onclick="editarProduto(${produto.id}, '${produto.nome}', ${produto.preco}, ${produto.estoque}, '${produto.categoria}')">✏️ Editar</button>
                    <button class="btn btn-danger" onclick="deletarProduto(${produto.id})">🗑️ Deletar</button>
                </td>
            </tr>
        `;
    });
    
    html += `</tbody></table>`;
    productsList.innerHTML = html;
}

function editarProduto(id, nome, preco, estoque, categoria) {
    produtoEmEdicao = id;

    document.getElementById('nome').value = nome;
    document.getElementById('preco').value = preco;
    document.getElementById('estoque').value = estoque;
    document.getElementById('categoria').value = categoria;

    document.querySelector('.form-section h2').textContent = `Editando Produto #${id}`;
}

// ========================================
// BUSCA
// ========================================

async function buscarProdutos(tipo, valor) {
    const loadingMessage = document.getElementById('loadingMessage');
    const emptyMessage = document.getElementById('emptyMessage');
    const productsList = document.getElementById('productsList');

    loadingMessage.style.display = 'block';
    productsList.innerHTML = '';

    try {
        let url = '';

        if (tipo === 'nome') {
            url = `/produtos/buscar/nome/${encodeURIComponent(valor)}`;
        } else {
            url = `/produtos/buscar/id/${valor}`;
        }

        const resposta = await fetch(url);

        if (!resposta.ok) throw new Error('Erro na busca');

        let produtos = await resposta.json();

        if (!Array.isArray(produtos)) {
            produtos = produtos ? [produtos] : [];
        }

        loadingMessage.style.display = 'none';

        if (produtos.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
            exibirTabela(produtos);
        }

    } catch (erro) {
        loadingMessage.style.display = 'none';
        emptyMessage.style.display = 'block';
        mostrarMensagem('Erro ao buscar produtos', 'erro');
    }
}

function filtrarProdutos() {
    const valor = document.getElementById('searchInput').value.trim();
    const tipo = document.getElementById('searchType').value;

    if (valor === '') {
        carregarProdutos();
    } else {
        buscarProdutos(tipo, valor);
    }
}

// ========================================
// EVENTOS
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    carregarProdutos();

    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const preco = document.getElementById('preco').value.trim();
        const estoque = document.getElementById('estoque').value.trim();
        const categoria = document.getElementById('categoria').value.trim();

        if (!nome || !preco || !estoque || !categoria) {
            mostrarMensagem('Preencha todos os campos!', 'erro');
            return;
        }

        const dados = { nome, preco, estoque, categoria };

        if (produtoEmEdicao) {
            atualizarProduto(produtoEmEdicao, dados);
        } else {
            criarProduto(dados);
        }
    });

    document.getElementById('btnLimpar').addEventListener('click', limparFormulario);
    document.getElementById('btnRecarregar').addEventListener('click', carregarProdutos);
    document.getElementById('btnBuscar').addEventListener('click', filtrarProdutos);

});