/* =========================================================
   PEC - GESTÃO DE CASOS
   Controle global de sessão
   ========================================================= */


/* =========================================================
   Obter usuário autenticado
   ========================================================= */

async function obterUsuarioAtual() {

    const {
        data,
        error
    } =
    await window.pecSupabase
        .auth
        .getUser();


    if (error) {

        console.error(
            "Erro ao obter usuário:",
            error
        );

        return null;
    }


    return data.user || null;

}


/* =========================================================
   Obter perfil do usuário
   ========================================================= */

async function obterPerfilAtual() {

    const usuario =
        await obterUsuarioAtual();


    if (!usuario) {
        return null;
    }


    const {
        data,
        error
    } =
    await window.pecSupabase
        .from("profiles")
        .select(
            "id, nome, cargo, nivel_acesso"
        )
        .eq(
            "id",
            usuario.id
        )
        .single();


    if (error) {

        console.error(
            "Erro ao obter perfil:",
            error
        );

        return null;
    }


    return data || null;

}


/* =========================================================
   Normalizar nível de acesso
   ========================================================= */

function normalizarNivelAcesso(
    nivel
) {

    return String(
            nivel || ""
        )
        .toLowerCase()
        .trim();

}


/* =========================================================
   Professor
   ========================================================= */

function perfilEhProfessor(
    perfil
) {

    if (!perfil) {
        return false;
    }


    const nivel =
        normalizarNivelAcesso(
            perfil.nivel_acesso
        );


    return nivel ===
        "professor";

}


/* =========================================================
   Gestão
   ========================================================= */

function perfilEhGestao(
    perfil
) {

    if (!perfil) {
        return false;
    }


    const nivel =
        normalizarNivelAcesso(
            perfil.nivel_acesso
        );


    return (
        nivel === "gestao" ||
        nivel === "administrador"
    );

}


/* =========================================================
   Administrador
   ========================================================= */

function perfilEhAdministrador(
    perfil
) {

    if (!perfil) {
        return false;
    }


    const nivel =
        normalizarNivelAcesso(
            perfil.nivel_acesso
        );


    return nivel ===
        "administrador";

}


/* =========================================================
   Exigir autenticação
   ========================================================= */

async function exigirSessao(
    caminhoLogin = "./login.html"
) {

    const usuario =
        await obterUsuarioAtual();


    if (!usuario) {

        window.location.href =
            caminhoLogin;

        return null;
    }


    return usuario;

}


/* =========================================================
   Exigir acesso do Professor
   ========================================================= */

async function exigirAcessoProfessor(
    caminhoLogin = "../login.html",
    caminhoGestao = "../gestao/dashboard.html"
) {

    const usuario =
        await obterUsuarioAtual();


    if (!usuario) {

        window.location.href =
            caminhoLogin;

        return null;
    }


    const perfil =
        await obterPerfilAtual();


    if (!perfil) {

        window.location.href =
            caminhoLogin;

        return null;
    }


    if (!perfilEhProfessor(perfil)) {

        if (
            perfilEhGestao(perfil)
        ) {

            window.location.href =
                caminhoGestao;

            return null;
        }


        window.location.href =
            caminhoLogin;

        return null;
    }


    return {
        usuario: usuario,
        perfil: perfil
    };

}


/* =========================================================
   Exigir acesso da Gestão
   ========================================================= */

async function exigirAcessoGestao(
    caminhoLogin = "../login.html",
    caminhoProfessor = "../professor/dashboard.html"
) {

    const usuario =
        await obterUsuarioAtual();


    if (!usuario) {

        window.location.href =
            caminhoLogin;

        return null;
    }


    const perfil =
        await obterPerfilAtual();


    if (!perfil) {

        window.location.href =
            caminhoLogin;

        return null;
    }


    if (!perfilEhGestao(perfil)) {

        if (
            perfilEhProfessor(perfil)
        ) {

            window.location.href =
                caminhoProfessor;

            return null;
        }


        window.location.href =
            caminhoLogin;

        return null;
    }


    return {
        usuario: usuario,
        perfil: perfil
    };

}


/* =========================================================
   Exigir acesso do Administrador
   ========================================================= */

async function exigirAcessoAdministrador(
    caminhoLogin = "../login.html",
    caminhoGestao = "../gestao/dashboard.html",
    caminhoProfessor = "../professor/dashboard.html"
) {

    const usuario =
        await obterUsuarioAtual();


    if (!usuario) {

        window.location.href =
            caminhoLogin;

        return null;
    }


    const perfil =
        await obterPerfilAtual();


    if (!perfil) {

        window.location.href =
            caminhoLogin;

        return null;
    }


    if (!perfilEhAdministrador(
            perfil
        )) {

        if (
            perfilEhGestao(perfil)
        ) {

            window.location.href =
                caminhoGestao;

            return null;
        }


        if (
            perfilEhProfessor(perfil)
        ) {

            window.location.href =
                caminhoProfessor;

            return null;
        }


        window.location.href =
            caminhoLogin;

        return null;
    }


    return {
        usuario: usuario,
        perfil: perfil
    };

}


/* =========================================================
   Encerrar sessão
   ========================================================= */

async function encerrarSessao(
    caminhoLogin = "./login.html"
) {

    const {
        error
    } =
    await window.pecSupabase
        .auth
        .signOut();


    if (error) {

        console.error(
            "Erro ao sair:",
            error
        );

        return false;
    }


    window.location.href =
        caminhoLogin;

    return true;

}


/* =========================================================
   Disponibilizar funções globalmente
   ========================================================= */

window.pecSessao = {

    obterUsuarioAtual,

    obterPerfilAtual,

    exigirSessao,

    exigirAcessoProfessor,

    exigirAcessoGestao,

    exigirAcessoAdministrador,

    perfilEhProfessor,

    perfilEhGestao,

    perfilEhAdministrador,

    encerrarSessao

};