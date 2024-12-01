<?php
// Realiza a conexão com o banco de dados
include('conexao.php');

// Verifica a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Verifica se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recebe os dados do formulário
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $senha = $_POST['senha'];
    $confirma_senha = $_POST['confirma-senha'];
    $cep = $_POST['cep'];
    $estado = $_POST['estado'];
    $cidade = $_POST['cidade'];
    $rua = $_POST['rua'];
    $numero = $_POST['numero'];
    $complemento = $_POST['complemento'];

    // Validação de senhas
    if ($senha !== $confirma_senha) {
        die("As senhas não coincidem.");
    }

    // Criptografa a senha
    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

    // Prepara e executa a inserção no banco de dados
    $sql = "INSERT INTO usuarios (nome, email, senha, cep, estado, cidade, rua, numero, complemento)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("sssssssss", $nome, $email, $senha_hash, $cep, $estado, $cidade, $rua, $numero, $complemento);

        if ($stmt->execute()) {
            header("Location: ../index.html");
        } else {
            echo "Erro ao cadastrar usuário: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "Erro na preparação da consulta: " . $conn->error;
    }
}

// Fecha a conexão
$conn->close();
?>