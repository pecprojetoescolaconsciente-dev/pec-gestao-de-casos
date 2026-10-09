/* =========================================================
   PEC - GESTÃO DE CASOS
   Autenticação - Login
   ========================================================= */

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const senhaInput =
    document.getElementById("senha");

const loginButton =
    document.getElementById("loginButton");

const loginButtonText =
    document.getElementById("loginButtonText");

const loginSpinner =
    document.getElementById("loginSpinner");

const loginMessage =
    document.getElementById("loginMessage");

const togglePassword =
    document.getElementById("togglePassword");

const forgotPassword =
    document.getElementById("forgotPassword");


/* =========================================================
   Mensagem
   ========================================================= */

function mostrarMensagem(
    mensagem,
    tipo = "error"
) {

    loginMessage.textContent =
        mensagem;

    loginMessage.className =
        `login-message ${tipo}`;

}


function limparMensagem() {

    loginMessage.textContent =
        "";

    loginMessage.className =
        "login-message";

}


/* =========================================================
   Loading
   ========================================================= */

function definirCarregamento(
    carregando
) {

    loginButton.disabled =
        carregando;

    loginSpinner.hidden = !carregando;

    loginButtonText.textContent =
        carregando ?
        "Entrando..." :
        "Entrar";

}


/* =========================================================
   Mostrar / esconder senha
   ========================================================= */

togglePassword.addEventListener(
    "click",
    function() {

        const mostrando =
            senhaInput.type === "text";

        senhaInput.type =
            mostrando ?
            "password" :
            "text";

        togglePassword.textContent =
            mostrando ?
            "Mostrar" :
            "Ocultar";

    }
);


/* =========================================================
   Login
   ========================================================= */

loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        limparMensagem();

        const email =
            emailInput.value.trim();

        const senha =
            senhaInput.value;


        if (!email || !senha) {

            mostrarMensagem(
                "Preencha seu e-mail e sua senha."
            );

            return;
        }


        definirCarregamento(true);


        try {

            const {
                data,
                error
            } =
            await window.pecSupabase
                .auth
                .signInWithPassword({
                    email: email,
                    password: senha
                });


            if (error) {

                console.error(error);

                mostrarMensagem(
                    traduzirErroLogin(
                        error.message
                    )
                );

                return;
            }


            if (!data.user) {

                mostrarMensagem(
                    "Não foi possível acessar sua conta."
                );

                return;
            }


            mostrarMensagem(
                "Acesso realizado com sucesso.",
                "success"
            );


            await direcionarUsuario(
                data.user.id
            );


        } catch (error) {

            console.error(error);

            mostrarMensagem(
                "Não foi possível conectar ao sistema. Tente novamente."
            );

        } finally {

            definirCarregamento(false);

        }

    }
);


/* =========================================================
   Direcionamento por perfil
   ========================================================= */

async function direcionarUsuario(
    usuarioId
) {

    const {
        data: perfil,
        error
    } =
    await window.pecSupabase
        .from("profiles")
        .select(
            "id, nome, cargo, nivel_acesso"
        )
        .eq(
            "id",
            usuarioId
        )
        .single();


    if (error) {

        console.error(error);

        mostrarMensagem(
            "Seu acesso foi autenticado, mas não encontramos seu perfil no PEC."
        );

        return;
    }


    const nivelAcesso =
        String(
            perfil.nivel_acesso || ""
        )
        .toLowerCase()
        .trim();


    if (
        nivelAcesso ===
        "professor"
    ) {

        window.location.href =
            "./professor/dashboard.html";

        return;
    }


    if (
        nivelAcesso === "gestao" ||
        nivelAcesso === "administrador"
    ) {

        window.location.href =
            "./gestao/dashboard.html";

        return;
    }


    mostrarMensagem(
        "Seu usuário está ativo, mas ainda não possui um nível de acesso configurado."
    );

}


/* =========================================================
   Normalização de texto
   ========================================================= */

function normalizarTexto(
    texto
) {

    return String(
            texto || ""
        )
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

}


/* =========================================================
   Tradução dos erros mais comuns
   ========================================================= */

function traduzirErroLogin(
    mensagem
) {

    const erro =
        String(
            mensagem || ""
        ).toLowerCase();


    if (
        erro.includes(
            "invalid login credentials"
        )
    ) {

        return "E-mail ou senha incorretos.";

    }


    if (
        erro.includes(
            "email not confirmed"
        )
    ) {

        return "Seu e-mail ainda não foi confirmado.";

    }


    if (
        erro.includes(
            "too many requests"
        )
    ) {

        return "Muitas tentativas de acesso. Aguarde alguns minutos e tente novamente.";

    }


    return "Não foi possível realizar o acesso. Verifique seus dados e tente novamente.";

}


/* =========================================================
   Recuperação de senha
   ========================================================= */

forgotPassword.addEventListener(
    "click",
    function() {

        mostrarMensagem(
            "A recuperação de senha será configurada na próxima etapa.",
            "success"
        );

    }
);