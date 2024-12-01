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

// Verifica se o parâmetro userId foi passado
if (isset($_GET['userId'])) {
    $userId = (int)$_GET['userId'];  // Garantir que o userId seja um número inteiro

    // Prepara a consulta SQL para buscar o nome e o e-mail do usuário
    $sql = "SELECT nome, email FROM usuarios WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);

    // Verifica se encontrou o usuário
    if ($stmt->rowCount() > 0) {
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'usuario' => $usuario]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'ID do usuário não fornecido']);
}
?>