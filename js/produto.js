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

// Pega o ID do produto da URL produto.html
const params = new URLSearchParams(window.location.search);
const produtoId = params.get('id');

// Dados dos produtos (pode ser um JSON futuramente)
const produtos = {
    1: {
        nome: "Cupcake de Chocolate",
        descricao: "Delicioso cupcake de chocolate com cobertura cremosa.",
        preco: 5.00,
        imagem: "../imgs/cupcake1.jpg"
    },
    2: {
        nome: "Cupcake de Baunilha",
        descricao: "Sabor clássico de baunilha com cobertura suave.",
        preco: 5.50,
        imagem: "../imgs/cupcake2.jpg"
    },
    3: {
        nome: "Cupcake de Morango",
        descricao: "Doce e irresistível com pedaços de morango.",
        preco: 6.00,
        imagem: "../imgs/cupcake3.jpg"
    },
    4: {
        nome: "Cupcake de Limão",
        descricao: "Refrescante e cítrico, perfeito para dias quentes.",
        preco: 5.75,
        imagem: "../imgs/cupcake4.jpg"
    },
    5: {
        nome: "Cupcake de Coco",
        descricao: "Com gostinho tropical e recheio de coco cremoso.",
        preco: 6.25,
        imagem: "../imgs/cupcake5.jpg"
    }
};

// Informa os dados do produto descrito acima através do ID na URL
if (produtos[produtoId]) {
    const produto = produtos[produtoId];
    document.querySelector('h2').textContent = produto.nome;
    document.querySelector('.produto-detalhe img').src = produto.imagem;
    document.querySelector('.produto-detalhe img').alt = produto.nome;
    document.querySelector('.produto-detalhe p').textContent = produto.descricao;
    document.getElementById('total').textContent = produto.preco.toFixed(2);

    var preco = produto.preco.toFixed(2);

    // Cria o elemento <s> com o preço original
    var precoOferta = document.createElement('s');
    precoOferta.textContent = `R$ ${preco}`;
    var precoOriginal = document.createElement('s');
    precoOriginal.textContent = `R$ ${(preco*1.2).toFixed(2)}`;
    
    // Adiciona o preço original riscado e o preço atual
    var precoDetalhe = document.querySelector('.produto-detalhe p:nth-of-type(2)');
    precoDetalhe.innerHTML = 'Preço: '; // Limpa o conteúdo atual
    precoDetalhe.appendChild(precoOriginal); // Adiciona o preço original riscado
    precoDetalhe.innerHTML += ` R$ ${produto.preco.toFixed(2)}`; // Adiciona o preço atual
    
} else {
    // Caso o ID seja inválido
    document.querySelector('.produto-detalhe').innerHTML = "<h2>Produto não encontrado!</h2>";
}

// Atualiza o valor total da compra na página de produto
document.getElementById('quantidade').addEventListener('input', function() {
    const quantidade = parseInt(document.getElementById('quantidade').value);
    document.getElementById('total').textContent = 'R$ ' + (preco * quantidade).toFixed(2);
});

// Função adicionar produtos ao carrinho
function adicionarCarrinho() {
    const quantidade = document.getElementById('quantidade').value;
    
    // Verifica se o usuário está logado
    const userId = localStorage.getItem('userId');
    
    
    // Envia a requisição para o PHP
    fetch('../php/adicionar_carrinho.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `userId=${userId}&produtoId=${produtoId}&quantidade=${quantidade}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            //alert('Produto adicionado ao carrinho!');
            carregarTotalCarrinho();
        } else {
            alert('Erro ao adicionar produto ao carrinho.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

// Função para carregar o total do carrinho
function carregarTotalCarrinho() {
    const userId = localStorage.getItem('userId');
    
    if (userId) {
        // Faz a requisição para o PHP que calcula o total do carrinho
        fetch(`../php/calcular_total_carrinho.php?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.total) {
                    document.getElementById('total-carrinho').textContent = data.total;
                } else {
                    document.getElementById('total-carrinho').textContent = '0';
                }
            })
            .catch(error => console.error('Erro ao carregar total do carrinho:', error));
    } else {
        document.getElementById('total-carrinho').textContent = '0';
    }
}

// Chama a função para carregar o total assim que a página carregar
document.addEventListener('DOMContentLoaded', carregarTotalCarrinho);