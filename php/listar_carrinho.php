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
    $sql = "SELECT c.quantidade, p.id AS produto_id, p.nome, p.preco, p.imagem 
            FROM carrinho c
            JOIN produtos p ON c.produto_id = p.id
            WHERE c.usuario_id = $userId";
    $result = $conn->query($sql);

    $produtosCarrinho = [];
    while ($row = $result->fetch_assoc()) {
        $produtosCarrinho[] = $row;
    }

    // Retorna os produtos como resposta JSON
    echo json_encode(['produtos' => $produtosCarrinho]);
} else {
    echo json_encode(['produtos' => []]);
}
?>