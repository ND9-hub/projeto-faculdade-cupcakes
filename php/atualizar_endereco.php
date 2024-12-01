<?php
// Realiza a conexão com o banco de dados
include('conexao.php');

// Criar a conexão PDO
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Ativar exceções para erros
} catch (PDOException $e) {
    echo 'Erro de conexão: ' . $e->getMessage();
    die();  // Se houver um erro de conexão, a execução é interrompida
}

// Verifica se os dados necessários foram enviados via POST
if (isset($_POST['userId'], $_POST['cep'], $_POST['estado'], $_POST['cidade'], $_POST['rua'], $_POST['numero'])) {
    $userId = (int)$_POST['userId'];
    $cep = $_POST['cep'];
    $estado = $_POST['estado'];
    $cidade = $_POST['cidade'];
    $rua = $_POST['rua'];
    $numero = $_POST['numero'];
    $complemento = isset($_POST['complemento']) ? $_POST['complemento'] : ''; // Campo complementar é opcional

    try {
        // Prepara a consulta SQL para atualizar o endereço do usuário
        $sql = "UPDATE usuarios SET cep = ?, estado = ?, cidade = ?, rua = ?, numero = ?, complemento = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);

        // Executa a consulta
        if ($stmt->execute([$cep, $estado, $cidade, $rua, $numero, $complemento, $userId])) {
            echo json_encode(['success' => true, 'message' => 'Endereço atualizado com sucesso!']);
        } else {
            // Se a consulta falhar, retorna um erro detalhado
            echo json_encode(['success' => false, 'message' => 'Erro ao atualizar o endereço. A consulta não foi executada corretamente.']);
        }
    } catch (PDOException $e) {
        // Captura erros da consulta SQL ou da conexão
        echo json_encode(['success' => false, 'message' => 'Erro de execução: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos ou inválidos']);
}
?>