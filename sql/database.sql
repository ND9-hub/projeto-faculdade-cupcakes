-- Criando o banco de dados
CREATE DATABASE supercakes;

USE supercakes;

-- Criando a tabela de informações do usuário
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    rua VARCHAR(150) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(100)
);

-- Criando a tabela para registrar os produtos
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    imagem VARCHAR(255) NOT NULL
);

-- Registrando os produtos
INSERT INTO produtos (nome, descricao, preco, imagem)
VALUES
    ('Cupcake de Chocolate', 'Delicioso cupcake de chocolate com cobertura cremosa.', 5.00, '../imgs/cupcake1.jpg'),
    ('Cupcake de Baunilha', 'Sabor clássico de baunilha com cobertura suave.', 5.50, '../imgs/cupcake2.jpg'),
    ('Cupcake de Morango', 'Doce e irresistível com pedaços de morango.', 6.00, '../imgs/cupcake3.jpg'),
    ('Cupcake de Limão', 'Refrescante e cítrico, perfeito para dias quentes.', 5.75, '../imgs/cupcake4.jpg'),
    ('Cupcake de Coco', 'Com gostinho tropical e recheio de coco cremoso.', 6.25, '../imgs/cupcake5.jpg');

-- Criando a tabela para registro de itens no carrinho
CREATE TABLE carrinho (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);