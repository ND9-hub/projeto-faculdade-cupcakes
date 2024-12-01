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


// Função para carregar os dados do usuário
document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");
    // Carregar informações do usuário
    axios.get(`../php/obter_endereco_usuario.php?userId=${userId}`)
        .then(response => {
            if (response.data.success) {
                const usuario = response.data.usuario;
                let str = usuario.nome;
                let strComPrimeiraMaiuscula = str   // Capitalizar a primeira letra de cada palavra
                    .split(' ')               // Divide a string em palavras
                    .map(palavra =>           // Para cada palavra
                        palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()  // Capitaliza a primeira letra e coloca o restante em minúscula
                    )
                    .join(' ');               // Junta as palavras de volta em uma string
                // console.log(strComPrimeiraMaiuscula);  // Verifique o valor transformado
                document.getElementById("nome-usuario").textContent = strComPrimeiraMaiuscula;
                document.getElementById("email-usuario").textContent = usuario.email;

                // Preencher os campos de endereço
                if (usuario.endereco) {
                    document.getElementById("cep").value = usuario.endereco.cep;
                    document.getElementById("estado").value = usuario.endereco.estado;
                    document.getElementById("cidade").value = usuario.endereco.cidade;
                    document.getElementById("rua").value = usuario.endereco.rua;
                    document.getElementById("numero").value = usuario.endereco.numero;
                    document.getElementById("complemento").value = usuario.endereco.complemento || '';
                }
            } else {
                alert(response.data.message);
            }
        })
        .catch(error => {
            console.error("Erro ao carregar informações do usuário:", error);
            alert("Erro ao carregar informações.");
        });

    // Função para buscar o endereço a partir do CEP
    document.getElementById('cep').addEventListener('blur', async () => {
        const cep = document.getElementById('cep').value.replace(/\D/g, '');
        if (cep.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                if (response.data.erro) {
                    alert('CEP não encontrado!');
                } else {
                    document.getElementById('estado').value = response.data.uf;
                    document.getElementById('cidade').value = response.data.localidade;
                    document.getElementById('rua').value = response.data.logradouro;
                    verificarCampos();
                }
            } catch (error) {
                alert('Erro ao buscar o CEP!');
            }
        } else {
            alert('CEP inválido!');
        }
    });

    // Função para habilitar/desabilitar o botão de salvar
    function verificarCampos() {
        const cep = document.getElementById('cep').value.trim();
        const estado = document.getElementById('estado').value.trim();
        const cidade = document.getElementById('cidade').value.trim();
        const rua = document.getElementById('rua').value.trim();
        const numero = document.getElementById('numero').value.trim();
        const complemento = document.getElementById('complemento').value.trim();

        const botaoSalvar = document.getElementById('btn-salvar');

        if (cep && estado && cidade && rua && numero) {
            botaoSalvar.disabled = false; // Habilita o botão
        } else {
            botaoSalvar.disabled = true; // Desabilita o botão
        }
    }

    // Adiciona evento de input para cada campo
    document.getElementById('cep').addEventListener('input', verificarCampos);
    document.getElementById('estado').addEventListener('input', verificarCampos);
    document.getElementById('cidade').addEventListener('input', verificarCampos);
    document.getElementById('rua').addEventListener('input', verificarCampos);
    document.getElementById('numero').addEventListener('input', verificarCampos);
    document.getElementById('complemento').addEventListener('input', verificarCampos);

    // Inicializa o estado do botão
    verificarCampos();
});

// Função para salvar o endereço
function salvarEndereco() {
    const userId = localStorage.getItem('userId');
    const cep = document.getElementById('cep').value;
    const estado = document.getElementById('estado').value;
    const cidade = document.getElementById('cidade').value;
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;

    // Enviar dados para o PHP via POST
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('cep', cep);
    formData.append('estado', estado);
    formData.append('cidade', cidade);
    formData.append('rua', rua);
    formData.append('numero', numero);
    formData.append('complemento', complemento);

    axios.post('../php/atualizar_endereco.php', formData)
        .then(response => {
            if (response.data.success) {
                alert(response.data.message);
            } else {
                alert('Erro ao atualizar endereço: ' + response.data.message);
            }
        })
        .catch(error => {
            console.error('Erro ao salvar endereço:', error);
            alert('Erro ao enviar os dados para o servidor');
        });
}