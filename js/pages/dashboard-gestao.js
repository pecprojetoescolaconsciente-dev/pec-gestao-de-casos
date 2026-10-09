/* =========================================================
   PEC - GESTÃO DE CASOS
   Dashboard da Gestão
   ========================================================= */

let usuarioAtual = null;
let perfilAtual = null;
let casosCarregados = [];


/* =========================================================
   Elementos
   ========================================================= */

const managementUser =
    document.getElementById(
        "managementUser"
    );


const managementProfileAvatar =
    document.getElementById(
        "managementProfileAvatar"
    );


const managementProfileName =
    document.getElementById(
        "managementProfileName"
    );


const managementProfileRole =
    document.getElementById(
        "managementProfileRole"
    );


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


const statAguardandoTriagem =
    document.getElementById(
        "statAguardandoTriagem"
    );


const statEmAndamento =
    document.getElementById(
        "statEmAndamento"
    );


const statAtencao =
    document.getElementById(
        "statAtencao"
    );


const statPrazos =
    document.getElementById(
        "statPrazos"
    );


const pendingCases =
    document.getElementById(
        "pendingCases"
    );


const attentionCases =
    document.getElementById(
        "attentionCases"
    );


const recentCases =
    document.getElementById(
        "recentCases"
    );


/* =========================================================
   Inicialização
   ========================================================= */

async function iniciarPagina() {

    const acesso =
        await window.pecSessao
        .exigirAcessoGestao(
            "../login.html",
            "../professor/dashboard.html"
        );


    if (!acesso) {
        return;
    }


    usuarioAtual =
        acesso.usuario;


    perfilAtual =
        acesso.perfil;


    preencherPerfil();


    await carregarCasos();


    preencherIndicadores();

    preencherAguardandoTriagem();

    preencherAtencao();

    preencherCasosRecentes();

}


/* =========================================================
   Perfil
   ========================================================= */

function preencherPerfil() {

    const nome =
        perfilAtual.nome ||
        usuarioAtual.email ||
        "Usuário";


    const cargo =
        perfilAtual.cargo ||
        "Gestão";


    managementUser.textContent =
        `${nome} • ${cargo}`;


    managementProfileName.textContent =
        nome;


    managementProfileRole.textContent =
        cargo;


    managementProfileAvatar.textContent =
        String(
            nome
        )
        .charAt(0)
        .toUpperCase();

}


/* =========================================================
   Carregar casos
   ========================================================= */

async function carregarCasos() {

    const resultado =
        await window.pecSupabase
        .from("casos")
        .select(
            `
                id,
                numero_caso,
                data_abertura,
                status,
                etapa_atual,
                nivel_atencao,
                proxima_acao,
                prazo_proxima_acao,
                denuncias (
                    indicacao_risco_imediato,
                    existencia_evidencias_iniciais,
                    data_ocorrencia,
                    ambiente
                )
                `
        )
        .order(
            "data_abertura", {
                ascending: false
            }
        );


    if (resultado.error) {

        console.error(
            "Erro ao carregar casos:",
            resultado.error
        );


        mostrarErroCasos();

        return;
    }


    casosCarregados =
        resultado.data || [];

}


/* =========================================================
   Indicadores
   ========================================================= */

function preencherIndicadores() {

    const aguardandoTriagem =
        casosCarregados.filter(
            function(caso) {

                return (
                    caso.etapa_atual ===
                    "denuncia"
                );

            }
        );


    const emAndamento =
        casosCarregados.filter(
            function(caso) {

                return (
                    caso.status ===
                    "Em andamento"
                );

            }
        );


    const atencao =
        casosCarregados.filter(
            function(caso) {

                return casoExigeAtencao(
                    caso
                );

            }
        );


    const prazos =
        casosCarregados.filter(
            function(caso) {

                return prazoProximo(
                    caso.prazo_proxima_acao
                );

            }
        );


    statAguardandoTriagem.textContent =
        aguardandoTriagem.length;


    statEmAndamento.textContent =
        emAndamento.length;


    statAtencao.textContent =
        atencao.length;


    statPrazos.textContent =
        prazos.length;

}


/* =========================================================
   Aguardando triagem
   ========================================================= */

function preencherAguardandoTriagem() {

    const casos =
        casosCarregados
        .filter(
            function(caso) {

                return (
                    caso.etapa_atual ===
                    "denuncia"
                );

            }
        )
        .slice(
            0,
            5
        );


    if (
        casos.length === 0
    ) {

        pendingCases.innerHTML =
            `
            <div class="management-empty-state">

                <span class="management-empty-icon">
                    ✓
                </span>

                <strong>
                    Nenhum caso aguardando triagem.
                </strong>

            </div>
            `;

        return;
    }


    pendingCases.innerHTML =
        casos
        .map(
            function(caso) {

                return criarCardCaso(
                    caso,
                    "Aguardando triagem"
                );

            }
        )
        .join("");

}


/* =========================================================
   Atenção necessária
   ========================================================= */

function preencherAtencao() {

    const casos =
        casosCarregados
        .filter(
            function(caso) {

                return casoExigeAtencao(
                    caso
                );

            }
        )
        .slice(
            0,
            5
        );


    if (
        casos.length === 0
    ) {

        attentionCases.innerHTML =
            `
            <div class="management-empty-state small">

                <strong>
                    Nenhum caso sinalizado no momento.
                </strong>

            </div>
            `;

        return;
    }


    attentionCases.innerHTML =
        casos
        .map(
            function(caso) {

                const motivo =
                    obterMotivoAtencao(
                        caso
                    );


                return `
                    <div class="management-attention-item">

                        <strong>
                            ${escaparHtml(
                                caso.numero_caso ||
                                "Caso"
                            )}
                        </strong>

                        <span>
                            ${escaparHtml(
                                motivo
                            )}
                        </span>

                    </div>
                `;

            }
        )
        .join("");

}


/* =========================================================
   Casos recentes
   ========================================================= */

function preencherCasosRecentes() {

    const casos =
        casosCarregados.slice(
            0,
            6
        );


    if (
        casos.length === 0
    ) {

        recentCases.innerHTML =
            `
            <div class="management-empty-state">

                <strong>
                    Nenhum caso registrado ainda.
                </strong>

            </div>
            `;

        return;
    }


    recentCases.innerHTML =
        casos
        .map(
            function(caso) {

                return criarCardCaso(
                    caso,
                    formatarEtapa(
                        caso.etapa_atual
                    )
                );

            }
        )
        .join("");

}


/* =========================================================
   Card de caso
   ========================================================= */

function criarCardCaso(
    caso,
    statusVisual
) {

    const denuncia =
        obterDenuncia(
            caso
        );


    let ambiente =
        "";


    if (
        denuncia &&
        denuncia.ambiente
    ) {

        ambiente =
            denuncia.ambiente;

    }


    const data =
        formatarData(
            caso.data_abertura
        );


    let meta =
        data;


    if (ambiente) {

        meta +=
            ` • ${ambiente}`;

    }


    return `
        <div class="management-case-item">

            <div class="management-case-main">

                <div class="management-case-top">

                    <span class="management-case-number">
                        ${escaparHtml(
                            caso.numero_caso ||
                            "Caso"
                        )}
                    </span>

                    <span class="management-case-status">
                        ${escaparHtml(
                            statusVisual
                        )}
                    </span>

                </div>


                <div class="management-case-title">
                    ${escaparHtml(
                        obterTituloCaso(
                            caso
                        )
                    )}
                </div>


                <div class="management-case-meta">
                    ${escaparHtml(
                        meta
                    )}
                </div>

            </div>


            <a
                href="./caso.html?id=${encodeURIComponent(
                    caso.id
                )}"
                class="management-case-action"
            >
                Abrir caso
            </a>

        </div>
    `;

}


/* =========================================================
   Título do caso
   ========================================================= */

function obterTituloCaso(
    caso
) {

    if (
        caso.proxima_acao &&
        String(
            caso.proxima_acao
        ).trim()
    ) {

        return caso.proxima_acao;

    }


    if (
        caso.etapa_atual ===
        "denuncia"
    ) {

        return "Novo registro recebido";

    }


    return "Caso em acompanhamento";

}


/* =========================================================
   Obter denúncia do caso
   ========================================================= */

function obterDenuncia(
    caso
) {

    if (!caso ||
        !caso.denuncias
    ) {

        return null;
    }


    if (
        Array.isArray(
            caso.denuncias
        )
    ) {

        if (
            caso.denuncias.length === 0
        ) {

            return null;

        }


        return caso.denuncias[0];

    }


    return caso.denuncias;

}


/* =========================================================
   Caso exige atenção?
   ========================================================= */

function casoExigeAtencao(
    caso
) {

    if (!caso) {
        return false;
    }


    if (
        caso.nivel_atencao ===
        "Alto"
    ) {

        return true;

    }


    if (
        caso.nivel_atencao ===
        "Urgente"
    ) {

        return true;

    }


    const denuncia =
        obterDenuncia(
            caso
        );


    if (
        denuncia &&
        denuncia.indicacao_risco_imediato ===
        true
    ) {

        return true;

    }


    return false;

}


/* =========================================================
   Motivo da atenção
   ========================================================= */

function obterMotivoAtencao(
    caso
) {

    const denuncia =
        obterDenuncia(
            caso
        );


    if (
        denuncia &&
        denuncia.indicacao_risco_imediato ===
        true
    ) {

        return "Risco imediato informado no registro";

    }


    if (
        caso.nivel_atencao ===
        "Urgente"
    ) {

        return "Nível de atenção urgente";

    }


    if (
        caso.nivel_atencao ===
        "Alto"
    ) {

        return "Nível de atenção alto";

    }


    return "Atenção necessária";

}


/* =========================================================
   Prazo próximo
   ========================================================= */

function prazoProximo(
    prazo
) {

    if (!prazo) {
        return false;
    }


    const hoje =
        inicioDoDia(
            new Date()
        );


    const limite =
        new Date(
            hoje
        );


    limite.setDate(
        limite.getDate() + 7
    );


    const dataPrazo =
        converterDataBanco(
            prazo
        );


    if (!dataPrazo) {
        return false;
    }


    return (
        dataPrazo >= hoje &&
        dataPrazo <= limite
    );

}


/* =========================================================
   Converter data YYYY-MM-DD
   ========================================================= */

function converterDataBanco(
    valor
) {

    if (!valor) {
        return null;
    }


    const partes =
        String(
            valor
        )
        .split("-");


    if (
        partes.length !== 3
    ) {

        return null;

    }


    const ano =
        Number(
            partes[0]
        );


    const mes =
        Number(
            partes[1]
        );


    const dia =
        Number(
            partes[2]
        );


    return new Date(
        ano,
        mes - 1,
        dia
    );

}


/* =========================================================
   Início do dia
   ========================================================= */

function inicioDoDia(
    data
) {

    return new Date(
        data.getFullYear(),
        data.getMonth(),
        data.getDate()
    );

}


/* =========================================================
   Formatar data
   ========================================================= */

function formatarData(
    valor
) {

    if (!valor) {
        return "Data não informada";
    }


    const data =
        new Date(
            valor
        );


    if (
        Number.isNaN(
            data.getTime()
        )
    ) {

        return "Data não informada";

    }


    return data.toLocaleDateString(
        "pt-BR"
    );

}


/* =========================================================
   Formatar etapa
   ========================================================= */

function formatarEtapa(
    etapa
) {

    const etapas = {

        denuncia: "Aguardando triagem",

        triagem: "Triagem",

        levantamento: "Levantamento",

        analise: "Análise",

        classificacao: "Classificação",

        intervencao: "Intervenção",

        monitoramento: "Monitoramento",

        reavaliacao: "Reavaliação",

        encerramento: "Encerramento"

    };


    return (
        etapas[etapa] ||
        etapa ||
        "Em andamento"
    );

}


/* =========================================================
   Erro ao carregar casos
   ========================================================= */

function mostrarErroCasos() {

    statAguardandoTriagem.textContent =
        "—";


    statEmAndamento.textContent =
        "—";


    statAtencao.textContent =
        "—";


    statPrazos.textContent =
        "—";


    pendingCases.innerHTML =
        `
        <div class="management-empty-state">

            <strong>
                Não foi possível carregar os casos.
            </strong>

        </div>
        `;


    attentionCases.innerHTML =
        `
        <div class="management-empty-state small">

            <strong>
                Não foi possível carregar.
            </strong>

        </div>
        `;


    recentCases.innerHTML =
        `
        <div class="management-empty-state">

            <strong>
                Não foi possível carregar os casos.
            </strong>

        </div>
        `;

}


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

        }

    }
);


/* =========================================================
   Escapar HTML
   ========================================================= */

function escaparHtml(
    texto
) {

    return String(
            texto ||
            ""
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
   Iniciar
   ========================================================= */

iniciarPagina();