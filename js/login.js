document.addEventListener("DOMContentLoaded", () => {
    // Verifica se já existe uma sessão ativa


    const loginForm = document.getElementById("form-login");
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email-login").value;
        const senha = document.getElementById("senha-login").value;

        const formData = new FormData();
        formData.append("email", email);
        formData.append("senha", senha);

        try {
            const response = await fetch("php/logar.php", {  // Ajuste aqui para o caminho correto
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (result.status === "success") {
                // Salva o ID do usuário no localStorage e redireciona
                localStorage.setItem("userId", result.id);
                window.location.href = "html/produtos.html";
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert("Erro ao tentar logar. Tente novamente mais tarde.");
            console.error("Erro:", error);
        }
    });
});

        // Verifica se o usuário está logado
        document.addEventListener("DOMContentLoaded", () => {
            const userId = localStorage.getItem("userId");
            if (userId) {
                // Redireciona para a página de login caso não esteja logado
                window.location.href = "html/produtos.html";
            }
        });