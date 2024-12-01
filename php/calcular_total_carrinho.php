<?php
session_start();

// Realiza a conexão com o banco de dados
include('conexao.php');

// Verifica a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Verifica se o usuário está logado (usando o userId armazenado no localStorage)
$userId = isset($_GET['userId']) ? intval($_GET['userId']) : 0;

if ($userId > 0) {
    // Consulta os produtos do carrinho do usuário
    $sql = "SELECT c.quantidade 
            FROM carrinho c
            JOIN produtos p ON c.produto_id = p.id
            WHERE c.usuario_id = $userId";
    $result = $conn->query($sql);

    $totalCarrinho = 0;

    // Calcula o total
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $totalCarrinho += $row['quantidade'];
        }
    }

    // Retorna o total como resposta JSON
    echo json_encode(['total' => $totalCarrinho]);
} else {
    echo json_encode(['total' => 0]);
}

$conn->close();
?>