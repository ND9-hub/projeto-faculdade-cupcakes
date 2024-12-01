<?php
// Inicia a sessão
session_start();

// Realiza a conexão com o banco de dados
include('conexao.php');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Verifica a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Verifica se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    // Consulta para verificar se o e-mail existe
    $sql = "SELECT id, senha FROM usuarios WHERE email = ?";
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            // E-mail encontrado, verifica a senha
            $stmt->bind_result($id, $senha_hash);
            $stmt->fetch();

            if (password_verify($senha, $senha_hash)) {
                // Login efetuado com sucesso
                // Armazena o ID do usuário na sessão
                $_SESSION['usuario_id'] = $id;

                echo json_encode(["status" => "success", "message" => "Login efetuado com sucesso", "id" => $id]);
            } else {
                // Senha incorreta
                echo json_encode(["status" => "error", "message" => "Senha incorreta"]);
            }
        } else {
            // E-mail não encontrado
            echo json_encode(["status" => "error", "message" => "E-mail não cadastrado"]);
        }

        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Erro na consulta ao banco"]);
    }
}

// Fecha a conexão
$conn->close();
?>