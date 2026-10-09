/* =========================================================
   PEC - GESTÃO DE CASOS
   Meus registros
   ========================================================= */


let usuarioAtual = null;
let perfilAtual = null;

let registros = [];

let filtroAtual =
    "todos";

let termoBusca =
    "";


/* =========================================================
   Elementos
   ========================================================= */

const userAvatar =
    document.getElementById(
        "userAvatar"
    );

const sidebarUserName =
    document.getElementById(
        "sidebarUserName"
    );

const sidebarUserRole =
    document.getElementById(
        "sidebarUserRole"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


const navInicio =
    document.getElementById(
        "navInicio"
    );

const navNovoCaso =
    document.getElementById(
        "navNovoCaso"
    );

const mobileHomeButton =
    document.getElementById(
        "mobileHomeButton"
    );

const mobileNewCaseButton =
    document.getElementById(
        "mobileNewCaseButton"
    );

const emptyNewRecordButton =
    document.getElementById(
        "emptyNewRecordButton"
    );


const recordsSearch =
    document.getElementById(
        "recordsSearch"
    );

const recordsFilters =
    document.getElementById(
        "recordsFilters"
    );

const recordsCount =
    document.getElementById(
        "recordsCount"
    );

const recordsCountLabel =
    document.getElementById(
        "recordsCountLabel"
    );


const recordsLoading =
    document.getElementById(
        "recordsLoading"
    );

const recordsError =
    document.getElementById(
        "recordsError"
    );

const recordsList =
    document.getElementById(
        "recordsList"
    );

const recordsEmpty =
    document.getElementById(
        "recordsEmpty"
    );

const emptyRecordsText =
    document.getElementById(
        "emptyRecordsText"
    );

const retryRecordsButton =
    document.getElementById(
        "retryRecordsButton"
    );


const toast =
    document.getElementById(
        "toast"
    );

const toastText =
    document.getElementById(
        "toastText"
    );


/* =========================================================
   Inicialização
   ========================================================= */

async function iniciarPagina() {

    usuarioAtual =
        await window.pecSessao
        .exigirSessao(
            "../login.html"
        );


    if (!usuarioAtual) {
        return;
    }


    configurarEventos();


    await carregarPerfil();


    await carregarRegistros();

}


iniciarPagina();


/* =========================================================
   Perfil
   ========================================================= */

async function carregarPerfil() {

    const resultado =
        await window.pecSupabase
        .from(
            "profiles"
        )
        .select(
            "id, nome, cargo"
        )
        .eq(
            "id",
            usuarioAtual.id
        )
        .single();


    if (resultado.error) {

        console.error(
            "Erro ao carregar perfil:",
            resultado.error
        );


        mostrarToast(
            "Não foi possível carregar seu perfil."
        );


        return;
    }


    perfilAtual =
        resultado.data;


    atualizarUsuario();

}


/* =========================================================
   Interface do usuário
   ========================================================= */

function atualizarUsuario() {

    if (!perfilAtual) {
        return;
    }


    const nome =
        perfilAtual.nome ||
        "Professor";


    const inicial =
        nome
        .charAt(0)
        .toUpperCase();


    userAvatar.textContent =
        inicial;


    sidebarUserName.textContent =
        nome;


    sidebarUserRole.textContent =
        perfilAtual.cargo ||
        "Professor";

}


/* =========================================================
   Carregar registros
   ========================================================= */

async function carregarRegistros() {

    mostrarCarregamento();


    /* =====================================================
       1. Casos criados pelo professor
       ===================================================== */

    const resultadoCasos =
        await window.pecSupabase
        .from(
            "casos"
        )
        .select(
            [
                "id",
                "numero_caso",
                "data_abertura",
                "status",
                "etapa_atual",
                "nivel_atencao",
                "created_at"
            ].join(", ")
        )
        .eq(
            "aberto_por_id",
            usuarioAtual.id
        )
        .order(
            "created_at", {
                ascending: false
            }
        );


    if (resultadoCasos.error) {

        console.error(
            "Erro ao carregar casos:",
            resultadoCasos.error
        );


        mostrarErro();

        return;
    }


    const casos =
        resultadoCasos.data || [];


    if (
        casos.length === 0
    ) {

        registros = [];


        aplicarFiltros();

        return;
    }


    const casosIds =
        casos.map(
            function(caso) {

                return caso.id;

            }
        );


    /* =====================================================
       2. Informações do registro inicial
       ===================================================== */

    const resultadoDenuncias =
        await window.pecSupabase
        .from(
            "denuncias"
        )
        .select(
            [
                "caso_id",
                "data_ocorrencia",
                "existencia_evidencias_iniciais",
                "indicacao_risco_imediato"
            ].join(", ")
        )
        .in(
            "caso_id",
            casosIds
        );


    if (
        resultadoDenuncias.error
    ) {

        console.error(
            "Erro ao carregar registros iniciais:",
            resultadoDenuncias.error
        );


        mostrarErro();

        return;
    }


    /* =====================================================
       3. Participantes dos casos
       ===================================================== */

    const resultadoParticipantes =
        await window.pecSupabase
        .from(
            "caso_participantes"
        )
        .select(
            [
                "caso_id",
                "papel",
                "tipo_participante",
                "aluno_id",
                "nome_externo"
            ].join(", ")
        )
        .in(
            "caso_id",
            casosIds
        );


    if (
        resultadoParticipantes.error
    ) {

        console.error(
            "Erro ao carregar participantes:",
            resultadoParticipantes.error
        );


        mostrarErro();

        return;
    }


    const participantes =
        resultadoParticipantes.data || [];


    /* =====================================================
       4. IDs dos alunos necessários
       ===================================================== */

    const alunosIds =
        participantes
        .filter(
            function(
                participante
            ) {

                return (
                    participante.tipo_participante ===
                    "aluno" &&
                    participante.aluno_id
                );

            }
        )
        .map(
            function(
                participante
            ) {

                return (
                    participante.aluno_id
                );

            }
        )
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


    let alunos = [];


    if (
        alunosIds.length > 0
    ) {

        const resultadoAlunos =
            await window.pecSupabase
            .from(
                "alunos"
            )
            .select(
                "id, nome"
            )
            .in(
                "id",
                alunosIds
            );


        if (
            resultadoAlunos.error
        ) {

            console.error(
                "Erro ao carregar alunos:",
                resultadoAlunos.error
            );


            mostrarErro();

            return;
        }


        alunos =
            resultadoAlunos.data || [];

    }


    /* =====================================================
       5. Mapas para montar os registros
       ===================================================== */

    const alunosPorId = {};


    alunos.forEach(
        function(aluno) {

            alunosPorId[
                    aluno.id
                ] =
                aluno.nome;

        }
    );


    const denunciasPorCaso = {};


    (
        resultadoDenuncias.data || []
    ).forEach(
        function(denuncia) {

            denunciasPorCaso[
                    denuncia.caso_id
                ] =
                denuncia;

        }
    );


    /* =====================================================
       6. Montar registros completos
       ===================================================== */

    registros =
        casos.map(
            function(caso) {

                const participantesCaso =
                    participantes.filter(
                        function(
                            participante
                        ) {

                            return (
                                participante.caso_id ===
                                caso.id
                            );

                        }
                    );


                const vitimas =
                    obterNomesParticipantes(
                        participantesCaso,
                        "possivel_vitima",
                        alunosPorId
                    );


                const autores =
                    obterNomesParticipantes(
                        participantesCaso,
                        "possivel_autor",
                        alunosPorId
                    );


                const denuncia =
                    denunciasPorCaso[
                        caso.id
                    ] ||
                    null;


                return {

                    id: caso.id,

                    numero: caso.numero_caso,

                    status: caso.status ||
                        "Em andamento",

                    etapa: caso.etapa_atual ||
                        "denuncia",

                    nivelAtencao: caso.nivel_atencao,

                    dataAbertura: caso.data_abertura ||
                        caso.created_at,

                    dataOcorrencia: denuncia ?
                        denuncia.data_ocorrencia : null,

                    evidencias: denuncia ?
                        denuncia
                        .existencia_evidencias_iniciais : false,

                    risco: denuncia ?
                        denuncia
                        .indicacao_risco_imediato : false,

                    vitimas: vitimas,

                    autores: autores

                };

            }
        );


    aplicarFiltros();

}


/* =========================================================
   Nome dos participantes
   ========================================================= */

function obterNomesParticipantes(
    participantes,
    papel,
    alunosPorId
) {

    return participantes
        .filter(
            function(
                participante
            ) {

                return (
                    participante.papel ===
                    papel
                );

            }
        )
        .map(
            function(
                participante
            ) {

                if (
                    participante.tipo_participante ===
                    "aluno" &&
                    participante.aluno_id
                ) {

                    return (
                        alunosPorId[
                            participante.aluno_id
                        ] ||
                        "Estudante"
                    );

                }


                if (
                    participante.nome_externo
                ) {

                    return (
                        participante.nome_externo
                    );

                }


                return (
                    "Participante"
                );

            }
        );

}


/* =========================================================
   Filtros
   ========================================================= */

function aplicarFiltros() {

    const termo =
        normalizarTexto(
            termoBusca
        );


    const filtrados =
        registros.filter(
            function(registro) {

                /* =========================================
                   Filtro por situação
                   ========================================= */

                if (
                    filtroAtual ===
                    "em_andamento"
                ) {

                    if (
                        registroConcluido(
                            registro
                        )
                    ) {

                        return false;

                    }

                }


                if (
                    filtroAtual ===
                    "concluidos"
                ) {

                    if (!registroConcluido(
                            registro
                        )) {

                        return false;

                    }

                }


                /* =========================================
                   Pesquisa
                   ========================================= */

                if (!termo) {
                    return true;
                }


                const textoPesquisa =
                    normalizarTexto(
                        [
                            registro.numero,
                            registro.vitimas.join(
                                " "
                            ),
                            registro.autores.join(
                                " "
                            ),
                            registro.status
                        ].join(
                            " "
                        )
                    );


                return textoPesquisa
                    .includes(
                        termo
                    );

            }
        );


    atualizarContagem(
        filtrados.length
    );


    renderizarRegistros(
        filtrados
    );

}


/* =========================================================
   Registro concluído?
   ========================================================= */

function registroConcluido(
    registro
) {

    const status =
        normalizarTexto(
            registro.status
        );


    return (
        status.includes(
            "concluido"
        ) ||
        status.includes(
            "encerrado"
        )
    );

}


/* =========================================================
   Contagem
   ========================================================= */

function atualizarContagem(
    quantidade
) {

    recordsCount.textContent =
        quantidade;


    if (
        quantidade === 1
    ) {

        recordsCountLabel.textContent =
            "registro encontrado";

    } else {

        recordsCountLabel.textContent =
            "registros encontrados";

    }

}


/* =========================================================
   Renderizar registros
   ========================================================= */

function renderizarRegistros(
    lista
) {

    recordsLoading.hidden =
        true;


    recordsError.hidden =
        true;


    if (
        lista.length === 0
    ) {

        recordsList.hidden =
            true;


        recordsEmpty.hidden =
            false;


        if (
            registros.length === 0
        ) {

            emptyRecordsText.textContent =
                "Quando você enviar uma situação, ela aparecerá aqui.";

        } else {

            emptyRecordsText.textContent =
                "Nenhum registro corresponde à sua busca ou ao filtro selecionado.";

        }


        return;
    }


    recordsEmpty.hidden =
        true;


    recordsList.hidden =
        false;


    recordsList.innerHTML =
        lista.map(
            function(registro) {

                return criarCardRegistro(
                    registro
                );

            }
        )
        .join("");


    configurarBotoesRegistros();

}


/* =========================================================
   Criar card
   ========================================================= */

function criarCardRegistro(
    registro
) {

    const concluido =
        registroConcluido(
            registro
        );


    const classeStatus =
        concluido ?
        "concluido" :
        "em-andamento";


    const vitimas =
        registro.vitimas.length > 0 ?
        registro.vitimas.join(
            ", "
        ) :
        "Não informado";


    const autores =
        registro.autores.length > 0 ?
        registro.autores.join(
            ", "
        ) :
        "Não informado";


    let flags = "";


    if (
        registro.risco === true
    ) {

        flags += `
            <span class="record-flag risk">
                ! Risco imediato informado
            </span>
        `;

    }


    if (
        registro.evidencias === true
    ) {

        flags += `
            <span class="record-flag evidence">
                Evidências informadas
            </span>
        `;

    }


    return `
        <article class="record-card">

            <div class="record-main">

                <div class="record-top">

                    <strong class="record-number">
                        ${escaparHtml(
                            registro.numero
                        )}
                    </strong>

                    <span
                        class="
                            record-status
                            ${classeStatus}
                        "
                    >
                        ${escaparHtml(
                            registro.status
                        )}
                    </span>

                    <span class="record-date">
                        ${formatarData(
                            registro.dataOcorrencia ||
                            registro.dataAbertura
                        )}
                    </span>

                </div>


                <div class="record-people">

                    <div class="record-person">

                        <span>
                            Possível vítima
                        </span>

                        <strong
                            title="${escaparHtml(
                                vitimas
                            )}"
                        >
                            ${escaparHtml(
                                vitimas
                            )}
                        </strong>

                    </div>


                    <div class="record-person">

                        <span>
                            Possível autor
                        </span>

                        <strong
                            title="${escaparHtml(
                                autores
                            )}"
                        >
                            ${escaparHtml(
                                autores
                            )}
                        </strong>

                    </div>

                </div>


                ${
                    flags
                        ? `
                            <div class="record-flags">
                                ${flags}
                            </div>
                        `
                        : ""
                }

            </div>


            <div class="record-actions">

                <button
                    type="button"
                    class="view-record-button"
                    data-case-id="${registro.id}"
                >
                    Ver registro
                    <span>→</span>
                </button>

            </div>

        </article>
    `;

}


/* =========================================================
   Botões Ver registro
   ========================================================= */

function configurarBotoesRegistros() {

    const botoes =
        recordsList
            .querySelectorAll(
                ".view-record-button"
            );


    botoes.forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    const casoId =
                        botao.dataset.caseId;


                    abrirRegistro(
                        casoId
                    );

                }
            );

        }
    );

}


/* =========================================================
   Abrir registro
   ========================================================= */

function abrirRegistro(
    casoId
) {

    window.location.href =
        "./caso.html?id=" +
        encodeURIComponent(
            casoId
        );

}


/* =========================================================
   Carregamento
   ========================================================= */

function mostrarCarregamento() {

    recordsLoading.hidden =
        false;


    recordsError.hidden =
        true;


    recordsList.hidden =
        true;


    recordsEmpty.hidden =
        true;


    recordsCount.textContent =
        "—";


    recordsCountLabel.textContent =
        "registros encontrados";

}


/* =========================================================
   Erro
   ========================================================= */

function mostrarErro() {

    recordsLoading.hidden =
        true;


    recordsList.hidden =
        true;


    recordsEmpty.hidden =
        true;


    recordsError.hidden =
        false;


    recordsCount.textContent =
        "—";

}


/* =========================================================
   Eventos
   ========================================================= */

function configurarEventos() {

    /* =====================================================
       Pesquisa
       ===================================================== */

    recordsSearch.addEventListener(
        "input",
        function () {

            termoBusca =
                recordsSearch.value;


            aplicarFiltros();

        }
    );


    /* =====================================================
       Filtros
       ===================================================== */

    recordsFilters
        .querySelectorAll(
            ".filter-button"
        )
        .forEach(
            function (botao) {

                botao.addEventListener(
                    "click",
                    function () {

                        filtroAtual =
                            botao.dataset.filter;


                        recordsFilters
                            .querySelectorAll(
                                ".filter-button"
                            )
                            .forEach(
                                function (
                                    item
                                ) {

                                    item.classList
                                        .remove(
                                            "active"
                                        );

                                }
                            );


                        botao.classList
                            .add(
                                "active"
                            );


                        aplicarFiltros();

                    }
                );

            }
        );


    /* =====================================================
       Navegação
       ===================================================== */

    navInicio.addEventListener(
        "click",
        abrirDashboard
    );


    mobileHomeButton.addEventListener(
        "click",
        abrirDashboard
    );


    navNovoCaso.addEventListener(
        "click",
        abrirNovaSituacao
    );


    mobileNewCaseButton.addEventListener(
        "click",
        abrirNovaSituacao
    );


    emptyNewRecordButton.addEventListener(
        "click",
        abrirNovaSituacao
    );


    /* =====================================================
       Tentar novamente
       ===================================================== */

    retryRecordsButton.addEventListener(
        "click",
        carregarRegistros
    );


    /* =====================================================
       Logout
       ===================================================== */

    logoutButton.addEventListener(
        "click",
        executarLogout
    );

}


/* =========================================================
   Dashboard
   ========================================================= */

function abrirDashboard() {

    window.location.href =
        "./dashboard.html";

}


/* =========================================================
   Nova situação
   ========================================================= */

function abrirNovaSituacao() {

    window.location.href =
        "./nova-situacao.html";

}


/* =========================================================
   Logout
   ========================================================= */

async function executarLogout() {

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


/* =========================================================
   Toast
   ========================================================= */

let toastTimer =
    null;


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
            function () {

                toast.classList
                    .remove(
                        "show"
                    );

            },
            3500
        );

}


/* =========================================================
   Formatar data
   ========================================================= */

function formatarData(
    data
) {

    if (!data) {
        return "";
    }


    /*
     * Datas vindas como YYYY-MM-DD não devem
     * sofrer mudança de fuso horário.
     */

    if (
        String(data).length === 10
    ) {

        const partes =
            String(data)
                .split("-");


        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );

    }


    const objetoData =
        new Date(
            data
        );


    return objetoData
        .toLocaleDateString(
            "pt-BR"
        );

}


/* =========================================================
   Normalizar texto
   ========================================================= */

function normalizarTexto(
    texto
) {

    return String(
        texto || ""
    )
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

}


/* =========================================================
   Segurança HTML
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