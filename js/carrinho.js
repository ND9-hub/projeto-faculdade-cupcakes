// Verifica se o usuário está logado
document.addEventListener("DOMContentLoaded", () => {
const userId = localStorage.getItem("userId");
if (!userId) {
    // Redireciona para a página de login caso não esteja logado
    window.location.href = "../index.html";
}
});
        
// Função de deslogar
function deslogar() {
    // Remove a chave 'userId' do localStorage
    localStorage.removeItem('userId');

    // Redireciona o usuário para a página de login
    window.location.href = '../index.html'; // Ou para a página de login que você desejar
}


// Função para carregar os produtos no carrinho
function carregarCarrinho() {
    const userId = localStorage.getItem('userId');

    // Faz a requisição para listar os produtos do carrinho
    fetch(`../php/listar_carrinho.php?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
            const produtos = data.produtos;
            const produtosList = document.getElementById('produtos-list');
            const totalValorElement = document.getElementById('total-valor');
            const finalizarPagamentoButton = document.getElementById('finalizar-pagamento');
            const mensagemLimiteElement = document.getElementById('mensagem-limite'); // Novo elemento para mostrar a mensagem

            // Limpa a lista de produtos
            produtosList.innerHTML = '';

            if (produtos.length === 0) {
                // Exibe uma mensagem quando o carrinho estiver vazio
                produtosList.innerHTML = '<p>Seu carrinho está vazio.</p>';
                finalizarPagamentoButton.disabled = true;
                totalValorElement.innerHTML = 'R$ 0.00';
                mensagemLimiteElement.innerHTML = ''; // Limpa a mensagem se o carrinho estiver vazio
                return;
            }

            let totalCarrinho = 0;
            let totalQuantidade = 0; // Variável para somar as quantidades dos produtos

            produtos.forEach(produto => {
                // Cria a linha de produto
                const produtoItem = document.createElement('div');
                produtoItem.classList.add('produto-item');
                produtoItem.innerHTML = ` 
                    <img src="${produto.imagem}" alt="${produto.nome}">
                    <div class="produto-cont">
                        <h4>${produto.nome}</h4>
                        <p><s>R$ ${parseFloat(produto.preco*1.2).toFixed(2)}</s> R$ ${parseFloat(produto.preco).toFixed(2)} x ${produto.quantidade}</p>
                        <p>Total: R$ ${(produto.preco * produto.quantidade).toFixed(2)}</p>
                        <button onclick="removerProduto(${produto.produto_id})">Remover</button>
                    </div>
                `;

                // Adiciona o produto à lista
                produtosList.appendChild(produtoItem);

                // Calcula o total do carrinho
                totalCarrinho += produto.preco * produto.quantidade;
                totalQuantidade += parseInt(produto.quantidade, 10);; // Soma a quantidade dos produtos
            });

            // Verifica a taxa de entrega
            const taxaEntrega = document.getElementById('entrega').checked ? 10.00 : 0.00;

            // Atualiza o total com a taxa de entrega (se aplicável)
            const totalComTaxa = totalCarrinho + taxaEntrega;
            totalValorElement.innerHTML = `R$ ${totalComTaxa.toFixed(2)}`;

            // Desativa o botão de finalizar pagamento se o carrinho estiver vazio ou se a quantidade total for maior que 20
            finalizarPagamentoButton.disabled = totalQuantidade === 0 || totalQuantidade > 50;

            // Adiciona uma mensagem na tela se a quantidade total for maior que 20
            if (totalQuantidade > 50) {
                mensagemLimiteElement.innerHTML = '<p style="color: red; font-weight: bold;">Você tem mais de 50 itens no carrinho. Infelizmente temos um limite de produtos por entrega, ajuste seu carrinho!</p>';
            } else {
                mensagemLimiteElement.innerHTML = ''; // Limpa a mensagem se a quantidade for menor ou igual a 20
            }
        })
        .catch(error => {
            console.error('Erro ao carregar os produtos do carrinho:', error);
        });
}

// Função para remover uma unidade do produto
function removerProduto(produtoId) {
    const userId = localStorage.getItem('userId');

    // Envia a requisição para o PHP que remove uma unidade do produto no carrinho
    fetch('../php/remover_produto.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `userId=${userId}&produtoId=${produtoId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            carregarCarrinho(); // Atualiza a lista do carrinho após a remoção
        } else {
            alert('Erro ao remover o produto do carrinho.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

// Função para carregar e atualizar o endereço do usuário
function carregarEndereco() {
    const userId = localStorage.getItem('userId');

    // Faz a requisição para obter o endereço do usuário
    fetch(`../php/obter_endereco.php?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
            const enderecoUsuario = document.getElementById('endereco-usuario');
            enderecoUsuario.innerHTML = data.endereco || 'Endereço não encontrado.'; // Atualiza a página com o endereço
        })
        .catch(error => {
            console.error('Erro ao carregar o endereço do usuário:', error);
        });
}

// Chama a função carregar endereço de entrega assim que a página carregar
document.addEventListener('DOMContentLoaded', carregarEndereco);

// Adiciona um evento para detectar a mudança na opção de entrega
const opcaoEntrega = document.getElementsByName('opcaoEntrega');
opcaoEntrega.forEach(radio => {
    radio.addEventListener('change', () => {
        carregarCarrinho();  // Recalcula e atualiza o total com base na nova opção
    });
});

// Chama a função para carregar o carrinho assim que a página carregar
document.addEventListener('DOMContentLoaded', carregarCarrinho);

// Função para finalizar pagamento (abre o modal)
function finalizarPagamento() {
    const modal = document.getElementById('modal-pagamento');
    modal.style.display = 'flex';
}

function fecharModal() {
    const modal = document.getElementById('modal-pagamento');
    modal.style.display = 'none';
}