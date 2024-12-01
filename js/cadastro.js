// Campos
const form = document.getElementById('cadastro-form');
const btnCadastrar = document.getElementById('btn-cadastrar');
const nome = document.getElementById('nome');
const senha = document.getElementById('senha');
const confirmaSenha = document.getElementById('confirma-senha');
const cep = document.getElementById('cep');
const estado = document.getElementById('estado');
const cidade = document.getElementById('cidade');
const rua = document.getElementById('rua');

// Modal dos Termos
const modal = document.getElementById('modal-termos');
const abrirTermos = document.getElementById('abrir-termos');
const fecharModal = document.querySelector('.fechar');

// Abre o modal dos termos
abrirTermos.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
});

// Fecha o modal
fecharModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fecha o modal clicando fora do conteúdo
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Validação do nome completo
nome.addEventListener('input', () => {
    const partes = nome.value.trim().split(/\s+/);
    const nomeValido = partes.length >= 2 && partes[0].length >= 3 && partes[1].length >= 3;

    if (!nomeValido) {
        nome.setCustomValidity('Digite pelo menos dois nomes com no mínimo 3 letras cada.');
    } else {
        nome.setCustomValidity('');
    }
});

// Validação de senha
confirmaSenha.addEventListener('input', () => {
    if (senha.value !== confirmaSenha.value) {
        confirmaSenha.setCustomValidity('As senhas não conferem');
    } else {
        confirmaSenha.setCustomValidity('');
    }
});

// Busca endereço pelo CEP
cep.addEventListener('blur', async () => {
    const cepValue = cep.value.replace(/\D/g, '');
    if (cepValue.length === 8) {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cepValue}/json/`);
            if (response.data.erro) {
                alert('CEP não encontrado!');
            } else {
                estado.value = response.data.uf;
                cidade.value = response.data.localidade;
                rua.value = response.data.logradouro;
            }
        } catch (error) {
            alert('Erro ao buscar o CEP!');
        }
    } else {
        alert('CEP inválido!');
    }
});

// Habilita ou desabilita o botão de cadastro
form.addEventListener('input', () => {
    const isValid = form.checkValidity() && senha.value === confirmaSenha.value;
    btnCadastrar.disabled = !isValid;
    btnCadastrar.style.backgroundColor = isValid ? '#28a745' : '#b0b0b0';
});