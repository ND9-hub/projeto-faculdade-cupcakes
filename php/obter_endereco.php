<?php
// Realiza a conexão com o banco de dados
include('conexao.php');

// Verificando se a conexão foi bem-sucedida
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Verifica se o 'userId' foi enviado
if (isset($_GET['userId'])) {
    $userId = $_GET['userId'];

    // Consulta SQL para obter o endereço do usuário
    $sql = "SELECT rua, numero, cidade, estado FROM usuarios WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Recupera o endereço
        $row = $result->fetch_assoc();
        $endereco = $row['rua'] . ', ' . $row['numero'] . ', ' . $row['cidade'] . ' - ' . $row['estado'];

        // Retorna o endereço como resposta JSON
        echo json_encode(['endereco' => $endereco]);
    } else {
        echo json_encode(['endereco' => 'Endereço não encontrado']);
    }

    $stmt->close();
} else {
    echo json_encode(['endereco' => 'Usuário não encontrado']);
}

// Fecha a conexão com o banco de dados
$conn->close();
?>