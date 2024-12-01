<?php
session_start();

// Realiza a conexão com o banco de dados
include('conexao.php');

// Verifica a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Verifica se os dados foram enviados
$userId = isset($_POST['userId']) ? intval($_POST['userId']) : 0;
$produtoId = isset($_POST['produtoId']) ? intval($_POST['produtoId']) : 0;

if ($userId > 0 && $produtoId > 0) {
    // Consulta a quantidade do produto no carrinho
    $sql = "SELECT quantidade FROM carrinho WHERE usuario_id = $userId AND produto_id = $produtoId";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $quantidadeAtual = $row['quantidade'];

        if ($quantidadeAtual > 1) {
            // Atualiza a quantidade do produto no carrinho
            $sql = "UPDATE carrinho SET quantidade = quantidade - 1 WHERE usuario_id = $userId AND produto_id = $produtoId";
        } else {
            // Remove o produto do carrinho
            $sql = "DELETE FROM carrinho WHERE usuario_id = $userId AND produto_id = $produtoId";
        }

        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao remover o produto do carrinho.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Produto não encontrado no carrinho.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos.']);
}

$conn->close();
?>