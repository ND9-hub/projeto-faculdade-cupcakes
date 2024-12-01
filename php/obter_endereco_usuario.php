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

if (isset($_GET['userId'])) {
    $userId = $_GET['userId'];

    // Prepare a consulta para obter os dados do usuário
    $sql = "SELECT nome, email, cep, estado, cidade, rua, numero, complemento FROM usuarios WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);

    // Verifica se o usuário foi encontrado
    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Retorna as informações do usuário como um JSON
        echo json_encode([
            'success' => true,
            'usuario' => [
                'nome' => $user['nome'],
                'email' => $user['email'],
                'endereco' => [
                    'cep' => $user['cep'],
                    'estado' => $user['estado'],
                    'cidade' => $user['cidade'],
                    'rua' => $user['rua'],
                    'numero' => $user['numero'],
                    'complemento' => $user['complemento']
                ]
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'ID do usuário não fornecido']);
}
?>