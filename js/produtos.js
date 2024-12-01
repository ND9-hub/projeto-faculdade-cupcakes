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