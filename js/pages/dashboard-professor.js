/* =========================================================
   PEC - GESTÃO DE CASOS
   Dashboard do Professor
   ========================================================= */


let usuarioAtual = null;
let perfilAtual = null;
let rascunhoAtual = null;
let casosRecentes = [];


/* =========================================================
   Elementos
   ========================================================= */

const welcomeTitle =
    document.getElementById("welcomeTitle");

const sidebarUserName =
    document.getElementById("sidebarUserName");

const sidebarUserRole =
    document.getElementById("sidebarUserRole");

const headerUserName =
    document.getElementById("headerUserName");

const userAvatar =
    document.getElementById("userAvatar");

const headerAvatar =
    document.getElementById("headerAvatar");

const logoutButton =
    document.getElementById("logoutButton");

const newCaseButton =
    document.getElementById("newCaseButton");

const mobileNewCaseButton =
    document.getElementById("mobileNewCaseButton");

const navNovoCaso =
    document.getElementById("navNovoCaso");

const navMeusRegistros =
    document.getElementById("navMeusRegistros");

const mobileRecordsButton =
    document.getElementById("mobileRecordsButton");

const toast =
    document.getElementById("toast");

const toastText =
    document.getElementById("toastText");

const sentRecordsCount =
    document.getElementById("sentRecordsCount");

const draftSection =
    document.getElementById("draftSection");

const draftSummary =
    document.getElementById("draftSummary");

const draftUpdatedAt =
    document.getElementById("draftUpdatedAt");

const continueDraftButton =
    document.getElementById("continueDraftButton");

const recentActivityContent =
    document.getElementById("recentActivityContent");


/* =========================================================
   Inicialização
   ========================================================= */

async function iniciarDashboard() {

    usuarioAtual =
        await window.pecSessao.exigirSessao(
            "../login.html"
        );


    if (!usuarioAtual) {
        return;
    }


    await carregarPerfil();

    await carregarDadosDashboard();

}


/* =========================================================
   Carregar perfil
   ========================================================= */

async function carregarPerfil() {

    const {
        data,
        error
    } =
    await window.pecSupabase
        .from("profiles")
        .select(
            "id, nome, cargo"
        )
        .eq(
            "id",
            usuarioAtual.id
        )
        .single();


    if (error) {

        console.error(
            "Erro ao carregar perfil:",
            error
        );

        mostrarToast(
            "Não foi possível carregar seu perfil."
        );

        return;
    }


    perfilAtual =
        data;


    atualizarInterfaceUsuario();

}

/* =========================================================
   Dados reais do Dashboard
   ========================================================= */

async function carregarDadosDashboard() {

    await Promise.all([
        carregarRascunhoDashboard(),
        carregarRegistrosEnviados()
    ]);

}


/* =========================================================
   Rascunho
   ========================================================= */

async function carregarRascunhoDashboard() {

    const resultado =
        await window.pecSupabase
        .from("rascunhos_situacao")
        .select(
            "id, dados, updated_at"
        )
        .eq(
            "usuario_id",
            usuarioAtual.id
        )
        .maybeSingle();


    if (resultado.error) {

        console.error(
            "Erro ao carregar rascunho:",
            resultado.error
        );

        return;
    }


    if (!resultado.data ||
        !resultado.data.dados
    ) {

        rascunhoAtual =
            null;

        draftSection.hidden =
            true;

        return;
    }


    rascunhoAtual =
        resultado.data;


    await renderizarRascunho();

}


/* =========================================================
   Exibir rascunho
   ========================================================= */

async function renderizarRascunho() {

    if (!rascunhoAtual) {
        return;
    }


    const dados =
        rascunhoAtual.dados;


    const vitimas =
        Array.isArray(
            dados.vitimas
        ) ?
        dados.vitimas : [];


    const autores =
        Array.isArray(
            dados.autores
        ) ?
        dados.autores : [];


    const ids =
        vitimas
        .concat(autores)
        .filter(
            function(
                id,
                index,
                lista
            ) {

                return (
                    lista.indexOf(id) ===
                    index
                );

            }
        );


    let nomesPorId = {};


    if (ids.length > 0) {

        const resultado =
            await window.pecSupabase
            .from("alunos")
            .select(
                "id, nome"
            )
            .in(
                "id",
                ids
            );


        if (!resultado.error) {

            const alunos =
                resultado.data || [];


            alunos.forEach(
                function(aluno) {

                    nomesPorId[
                            aluno.id
                        ] =
                        aluno.nome;

                }
            );

        }

    }


    const nomesVitimas =
        vitimas
        .map(
            function(id) {

                return (
                    nomesPorId[id] ||
                    null
                );

            }
        )
        .filter(
            function(nome) {

                return (
                    nome !== null
                );

            }
        );


    const nomesAutores =
        autores
        .map(
            function(id) {

                return (
                    nomesPorId[id] ||
                    null
                );

            }
        )
        .filter(
            function(nome) {

                return (
                    nome !== null
                );

            }
        );


    const partes = [];


    if (
        nomesVitimas.length > 0
    ) {

        partes.push(
            "Possível vítima: " +
            nomesVitimas.join(", ")
        );

    }


    if (
        nomesAutores.length > 0
    ) {

        partes.push(
            "Possível autor: " +
            nomesAutores.join(", ")
        );

    }


    if (
        partes.length > 0
    ) {

        draftSummary.textContent =
            partes.join(" • ");

    } else {

        draftSummary.textContent =
            "Registro iniciado e ainda não enviado.";

    }


    draftUpdatedAt.textContent =
        formatarDataRascunho(
            rascunhoAtual.updated_at
        );


    draftSection.hidden =
        false;

}


/* =========================================================
   Registros enviados
   ========================================================= */

async function carregarRegistrosEnviados() {

    const resultado =
        await window.pecSupabase
        .from("casos")
        .select(
            "id, numero_caso, status, etapa_atual, created_at", {
                count: "exact"
            }
        )
        .eq(
            "aberto_por_id",
            usuarioAtual.id
        )
        .order(
            "created_at", {
                ascending: false
            }
        )
        .limit(5);


    if (resultado.error) {

        console.error(
            "Erro ao carregar registros:",
            resultado.error
        );


        sentRecordsCount.textContent =
            "—";


        return;
    }


    sentRecordsCount.textContent =
        resultado.count || 0;


    casosRecentes =
        resultado.data || [];


    renderizarAtividadesRecentes();

}


/* =========================================================
   Atividades recentes
   ========================================================= */

function renderizarAtividadesRecentes() {

    if (
        casosRecentes.length === 0
    ) {

        recentActivityContent.innerHTML =
            `
            <div class="empty-state">

                <div class="empty-icon">
                    ✓
                </div>

                <h3>
                    Tudo tranquilo por aqui
                </h3>

                <p>
                    Quando você enviar uma situação,
                    ela aparecerá neste espaço.
                </p>

            </div>
            `;

        return;
    }


    recentActivityContent.innerHTML =
        `
        <div class="activity-list">

            ${casosRecentes
                .map(
                    function (caso) {

                        return `
                            <div class="activity-item">

                                <div class="activity-icon">
                                    ✓
                                </div>

                                <div class="activity-info">

                                    <strong>
                                        ${escaparHtml(
                                            caso.numero_caso
                                        )}
                                    </strong>

                                    <span>
                                        Registro enviado •
                                        ${escaparHtml(
                                            caso.status ||
                                            "Em andamento"
                                        )}
                                    </span>

                                </div>

                                <time>
                                    ${formatarDataCaso(
                                        caso.created_at
                                    )}
                                </time>

                            </div>
                        `;

                    }
                )
                .join("")}

        </div>
        `;

}


/* =========================================================
   Atualizar informações visuais
   ========================================================= */

function atualizarInterfaceUsuario() {

    const nomeCompleto =
        perfilAtual.nome ||
        "Professor";


    const primeiroNome =
        obterPrimeiroNome(
            nomeCompleto
        );


    const inicial =
        primeiroNome
        .charAt(0)
        .toUpperCase();


    welcomeTitle.textContent =
        `${obterSaudacao()}, ${primeiroNome}`;


    sidebarUserName.textContent =
        nomeCompleto;


    sidebarUserRole.textContent =
        perfilAtual.cargo ||
        "Professor";


    headerUserName.textContent =
        primeiroNome;


    userAvatar.textContent =
        inicial;


    headerAvatar.textContent =
        inicial;

}


/* =========================================================
   Saudação
   ========================================================= */

function obterSaudacao() {

    const hora =
        new Date().getHours();


    if (hora >= 5 && hora < 12) {
        return "Bom dia";
    }


    if (hora >= 12 && hora < 18) {
        return "Boa tarde";
    }


    return "Boa noite";
}


/* =========================================================
   Primeiro nome
   ========================================================= */

function obterPrimeiroNome(
    nome
) {

    return String(
            nome || "Professor"
        )
        .trim()
        .split(/\s+/)[0];

}


/* =========================================================
   Toast
   ========================================================= */

let toastTimer = null;


function mostrarToast(
    mensagem
) {

    toastText.textContent =
        mensagem;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function() {

                toast.classList.remove(
                    "show"
                );

            },
            3500
        );

}


/* =========================================================
   Nova situação
   ========================================================= */

function abrirNovaSituacao() {

    window.location.href =
        "./nova-situacao.html";

}


newCaseButton.addEventListener(
    "click",
    abrirNovaSituacao
);


mobileNewCaseButton.addEventListener(
    "click",
    abrirNovaSituacao
);


navNovoCaso.addEventListener(
    "click",
    abrirNovaSituacao
);


/* =========================================================
   Continuar rascunho
   ========================================================= */

continueDraftButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "./nova-situacao.html";

    }
);

/* =========================================================
   Meus registros
   ========================================================= */

function abrirMeusRegistros() {

    window.location.href =
        "./meus-registros.html";

}


navMeusRegistros.addEventListener(
    "click",
    abrirMeusRegistros
);


mobileRecordsButton.addEventListener(
    "click",
    abrirMeusRegistros
);


/* =========================================================
   Logout
   ========================================================= */

logoutButton.addEventListener(
    "click",
    async function() {

        logoutButton.disabled =
            true;

        logoutButton.textContent =
            "Saindo...";


        const saiu =
            await window.pecSessao
            .encerrarSessao(
                "../login.html"
            );


        if (!saiu) {

            logoutButton.disabled =
                false;

            logoutButton.textContent =
                "Sair";


            mostrarToast(
                "Não foi possível sair agora. Tente novamente."
            );

        }

    }
);


/* =========================================================
   Formatar data do rascunho
   ========================================================= */

function formatarDataRascunho(
    data
) {

    if (!data) {

        return "Rascunho salvo";

    }


    const dataRascunho =
        new Date(data);

    const hoje =
        new Date();


    const mesmoDia =
        dataRascunho.getDate() ===
            hoje.getDate() &&

        dataRascunho.getMonth() ===
            hoje.getMonth() &&

        dataRascunho.getFullYear() ===
            hoje.getFullYear();


    const horario =
        dataRascunho
            .toLocaleTimeString(
                "pt-BR",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


    if (mesmoDia) {

        return (
            "Salvo hoje às " +
            horario
        );

    }


    const dataFormatada =
        dataRascunho
            .toLocaleDateString(
                "pt-BR"
            );


    return (
        "Salvo em " +
        dataFormatada +
        " às " +
        horario
    );

}


/* =========================================================
   Formatar data do caso
   ========================================================= */

function formatarDataCaso(
    data
) {

    if (!data) {
        return "";
    }


    const dataCaso =
        new Date(data);


    return dataCaso
        .toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit"
            }
        );

}


/* =========================================================
   Segurança para conteúdo HTML
   ========================================================= */

function escaparHtml(
    texto
) {

    return String(
        texto || ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   Executar
   ========================================================= */

iniciarDashboard();