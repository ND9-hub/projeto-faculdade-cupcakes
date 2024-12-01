<?php
// Inicia a sessão para recuperar o ID do usuário logado
session_start();

// Realiza a conexão com o banco de dados
include('conexao.php');

// Verifica a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Verifica se a requisição é POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recupera os dados enviados pelo JavaScript
    $userId = isset($_POST['userId']) ? intval($_POST['userId']) : 0;
    $produtoId = isset($_POST['produtoId']) ? intval($_POST['produtoId']) : 0;
    $quantidade = isset($_POST['quantidade']) ? intval($_POST['quantidade']) : 0;

    // Valida os dados
    if ($userId > 0 && $produtoId > 0 && $quantidade > 0) {
        // Verifica se o produto já existe no carrinho do usuário
        $sql = "SELECT * FROM carrinho WHERE usuario_id = $userId AND produto_id = $produtoId";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // Atualiza a quantidade se o produto já estiver no carrinho
            $sql = "UPDATE carrinho SET quantidade = quantidade + $quantidade WHERE usuario_id = $userId AND produto_id = $produtoId";
        } else {
            // Adiciona o produto no carrinho
            $sql = "INSERT INTO carrinho (usuario_id, produto_id, quantidade) VALUES ($userId, $produtoId, $quantidade)";
        }

        // Executa a consulta e verifica se foi bem-sucedido
        if ($conn->query($sql) === TRUE) {
            // Calcular o total do carrinho
            $totalCarrinho = 0;
            $sqlCarrinho = "SELECT p.preco, c.quantidade FROM carrinho c INNER JOIN produtos p ON c.produto_id = p.id WHERE c.usuario_id = $userId";
            $resultCarrinho = $conn->query($sqlCarrinho);

            if ($resultCarrinho->num_rows > 0) {
                while ($row = $resultCarrinho->fetch_assoc()) {
                    $totalCarrinho += $row['preco'] * $row['quantidade'];
                }
            }

            // Retorna uma resposta de sucesso e o total do carrinho
            echo json_encode(['success' => true, 'totalCarrinho' => number_format($totalCarrinho, 2)]);
        } else {
            // Retorna uma resposta de erro
            echo json_encode(['success' => false, 'message' => 'Erro ao adicionar produto ao carrinho.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Dados inválidos.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método de requisição inválido.']);
}
?>