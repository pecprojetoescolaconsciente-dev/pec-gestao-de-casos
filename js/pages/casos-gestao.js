/* =========================================================
   PEC - GESTÃO DE CASOS
   Casos da Gestão
   ========================================================= */

let usuarioAtual = null;
let perfilAtual = null;

let casosCarregados = [];
let casosFiltrados = [];


/* =========================================================
   Elementos
   ========================================================= */

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


const casesSearch =
    document.getElementById(
        "casesSearch"
    );


const casesCount =
    document.getElementById(
        "casesCount"
    );


const filterEtapa =
    document.getElementById(
        "filterEtapa"
    );


const filterAtencao =
    document.getElementById(
        "filterAtencao"
    );


const filterStatus =
    document.getElementById(
        "filterStatus"
    );


const filterResponsavel =
    document.getElementById(
        "filterResponsavel"
    );


const clearFiltersButton =
    document.getElementById(
        "clearFiltersButton"
    );


const casesList =
    document.getElementById(
        "casesList"
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


    preencherFiltroResponsaveis();


    aplicarFiltros();

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
                unidade_escolar,
                estudantes_envolvidos,
                responsavel_id,
                status,
                etapa_atual,
                nivel_atencao,
                proxima_acao,
                prazo_proxima_acao,

                responsavel:profiles (
                    id,
                    nome,
                    cargo
                ),

                denuncias (
                    indicacao_risco_imediato,
                    existencia_evidencias_iniciais,
                    data_ocorrencia,
                    ambiente,
                    tipo_ambiente
                ),

                caso_participantes (
                    papel,
                    tipo_participante,
                    aluno_id,

                    alunos (
                        id,
                        nome,
                        serie,
                        turma,
                        periodo
                    )
                )
                `
        )
        .order(
            "data_abertura", {
                ascending: false
            }
        );


    if (
        resultado.error
    ) {

        console.error(
            "Erro ao carregar casos:",
            resultado.error
        );


        mostrarErro();

        return;
    }


    casosCarregados =
        resultado.data || [];

}


/* =========================================================
   Filtro de responsáveis
   ========================================================= */

function preencherFiltroResponsaveis() {

    const responsaveis = [];


    casosCarregados.forEach(
        function(caso) {

            const responsavel =
                obterResponsavel(
                    caso
                );


            if (!responsavel ||
                !responsavel.id
            ) {

                return;

            }


            const jaExiste =
                responsaveis.some(
                    function(item) {

                        return (
                            item.id ===
                            responsavel.id
                        );

                    }
                );


            if (!jaExiste) {

                responsaveis.push(
                    responsavel
                );

            }

        }
    );


    responsaveis.sort(
        function(a, b) {

            return String(
                    a.nome ||
                    ""
                )
                .localeCompare(
                    String(
                        b.nome ||
                        ""
                    ),
                    "pt-BR"
                );

        }
    );


    responsaveis.forEach(
        function(responsavel) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                responsavel.id;


            option.textContent =
                responsavel.nome ||
                "Responsável";


            filterResponsavel.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   Aplicar filtros
   ========================================================= */

function aplicarFiltros() {

    const busca =
        normalizarTexto(
            casesSearch.value
        );


    const etapa =
        filterEtapa.value;


    const atencao =
        filterAtencao.value;


    const status =
        filterStatus.value;


    const responsavel =
        filterResponsavel.value;


    casosFiltrados =
        casosCarregados.filter(
            function(caso) {

                if (
                    busca &&
                    !casoCorrespondeBusca(
                        caso,
                        busca
                    )
                ) {

                    return false;

                }


                if (
                    etapa &&
                    caso.etapa_atual !==
                    etapa
                ) {

                    return false;

                }


                if (
                    atencao &&
                    !casoCorrespondeAtencao(
                        caso,
                        atencao
                    )
                ) {

                    return false;

                }


                if (
                    status &&
                    caso.status !==
                    status
                ) {

                    return false;

                }


                if (
                    responsavel &&
                    !casoCorrespondeResponsavel(
                        caso,
                        responsavel
                    )
                ) {

                    return false;

                }


                return true;

            }
        );


    renderizarCasos();

}


/* =========================================================
   Busca
   ========================================================= */

function casoCorrespondeBusca(
    caso,
    busca
) {

    const numero =
        normalizarTexto(
            caso.numero_caso
        );


    if (
        numero.includes(
            busca
        )
    ) {

        return true;

    }


    const participantes =
        obterParticipantes(
            caso
        );


    const encontrouAluno =
        participantes.some(
            function(participante) {

                const aluno =
                    obterAlunoParticipante(
                        participante
                    );


                if (!aluno ||
                    !aluno.nome
                ) {

                    return false;

                }


                return normalizarTexto(
                        aluno.nome
                    )
                    .includes(
                        busca
                    );

            }
        );


    if (
        encontrouAluno
    ) {

        return true;

    }


    if (
        caso.estudantes_envolvidos &&
        normalizarTexto(
            caso.estudantes_envolvidos
        )
        .includes(
            busca
        )
    ) {

        return true;

    }


    return false;

}


/* =========================================================
   Filtro de atenção
   ========================================================= */

function casoCorrespondeAtencao(
    caso,
    filtro
) {

    if (
        filtro ===
        "sem_classificacao"
    ) {

        return !caso.nivel_atencao;

    }

    if (
        filtro ===
        "risco_imediato"
    ) {

        const denuncia =
            obterDenuncia(
                caso
            );


        return (
            denuncia &&
            denuncia.indicacao_risco_imediato ===
            true
        );

    }


    return (
        caso.nivel_atencao ===
        filtro
    );

}


/* =========================================================
   Filtro de responsável
   ========================================================= */

function casoCorrespondeResponsavel(
    caso,
    filtro
) {

    if (
        filtro ===
        "sem_responsavel"
    ) {

        return !caso.responsavel_id;

    }


    return (
        caso.responsavel_id ===
        filtro
    );

}


/* =========================================================
   Renderizar casos
   ========================================================= */

function renderizarCasos() {

    casesCount.textContent =
        casosFiltrados.length;


    if (
        casosFiltrados.length === 0
    ) {

        casesList.innerHTML =
            `
            <div class="cases-empty-state">

                <span class="cases-empty-icon">
                    ⌕
                </span>

                <strong>
                    Nenhum caso encontrado.
                </strong>

                <span>
                    Tente alterar a busca ou remover algum filtro.
                </span>

            </div>
            `;

        return;

    }


    casesList.innerHTML =
        casosFiltrados
        .map(
            function(caso) {

                return criarLinhaCaso(
                    caso
                );

            }
        )
        .join("");

}


/* =========================================================
   Criar linha
   ========================================================= */

function criarLinhaCaso(
    caso
) {

    const denuncia =
        obterDenuncia(
            caso
        );


    const responsavel =
        obterResponsavel(
            caso
        );


    const nomes =
        obterNomesPrincipais(
            caso
        );


    const etapa =
        formatarEtapa(
            caso.etapa_atual
        );


    const data =
        formatarDataHora(
            caso.data_abertura
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


    let meta =
        data;


    if (
        ambiente
    ) {

        meta +=
            ` • ${ambiente}`;

    }


    let nomeResponsavel =
        "Sem responsável";


    let cargoResponsavel =
        "Aguardando definição";


    if (
        responsavel
    ) {

        nomeResponsavel =
            responsavel.nome ||
            "Responsável";


        cargoResponsavel =
            responsavel.cargo ||
            "Gestão";

    }


    const prazo =
        montarPrazo(
            caso.prazo_proxima_acao
        );


    return `
        <article class="cases-case">

            <div class="cases-case-main">

                <div class="cases-case-top">

                    <span class="cases-case-number">
                        ${escaparHtml(
                            caso.numero_caso ||
                            "Caso"
                        )}
                    </span>

                    ${criarBadgeEtapa(
                        etapa,
                        caso
                    )}

                    ${criarBadgeAtencao(
                        caso
                    )}

                </div>


                <div class="cases-case-people">
                    ${escaparHtml(
                        nomes
                    )}
                </div>


                <div class="cases-case-meta">
                    ${escaparHtml(
                        meta
                    )}
                </div>

            </div>


            <div class="cases-case-column">

                <span class="cases-case-column-label">
                    Responsável
                </span>

                <strong>
                    ${escaparHtml(
                        nomeResponsavel
                    )}
                </strong>

                <span>
                    ${escaparHtml(
                        cargoResponsavel
                    )}
                </span>

            </div>


            <div class="cases-case-column due-column">

                <span class="cases-case-column-label">
                    Próxima ação
                </span>

                <strong>
                    ${escaparHtml(
                        caso.proxima_acao ||
                        "Não definida"
                    )}
                </strong>

                <span class="${prazo.classe}">
                    ${escaparHtml(
                        prazo.texto
                    )}
                </span>

            </div>


            <a
                href="./caso.html?id=${encodeURIComponent(
                    caso.id
                )}"
                class="cases-case-action"
            >
                Abrir caso
            </a>

        </article>
    `;

}


/* =========================================================
   Badge da etapa
   ========================================================= */

function criarBadgeEtapa(
    etapa,
    caso
) {

    let classe =
        "cases-badge";


    if (
        caso.etapa_atual ===
        "encerramento"
    ) {

        classe +=
            " closed";

    }


    return `
        <span class="${classe}">
            ${escaparHtml(
                etapa
            )}
        </span>
    `;

}


/* =========================================================
   Badge de atenção
   ========================================================= */

function criarBadgeAtencao(
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

        return `
            <span class="cases-badge urgent">
                Risco imediato
            </span>
        `;

    }


    if (
        caso.nivel_atencao ===
        "Urgente"
    ) {

        return `
            <span class="cases-badge urgent">
                Urgente
            </span>
        `;

    }


    if (
        caso.nivel_atencao ===
        "Alto"
    ) {

        return `
            <span class="cases-badge attention">
                Atenção alta
            </span>
        `;

    }


    if (
        caso.nivel_atencao
    ) {

        return `
            <span class="cases-badge">
                ${escaparHtml(
                    caso.nivel_atencao
                )}
            </span>
        `;

    }


    return "";

}


/* =========================================================
   Participantes
   ========================================================= */

function obterParticipantes(
    caso
) {

    if (!caso ||
        !caso.caso_participantes
    ) {

        return [];

    }


    if (!Array.isArray(
            caso.caso_participantes
        )) {

        return [];

    }


    return caso.caso_participantes;

}


/* =========================================================
   Aluno da relação
   ========================================================= */

function obterAlunoParticipante(
    participante
) {

    if (!participante ||
        !participante.alunos
    ) {

        return null;

    }


    if (
        Array.isArray(
            participante.alunos
        )
    ) {

        if (
            participante.alunos.length ===
            0
        ) {

            return null;

        }


        return participante.alunos[0];

    }


    return participante.alunos;

}


/* =========================================================
   Nomes principais
   ========================================================= */

function obterNomesPrincipais(
    caso
) {

    const participantes =
        obterParticipantes(
            caso
        );


    const vitimas = [];

    const autores = [];


    participantes.forEach(
        function(participante) {

            const aluno =
                obterAlunoParticipante(
                    participante
                );


            if (!aluno ||
                !aluno.nome
            ) {

                return;

            }


            if (
                participante.papel ===
                "possivel_vitima"
            ) {

                vitimas.push(
                    aluno.nome
                );

            }


            if (
                participante.papel ===
                "possivel_autor"
            ) {

                autores.push(
                    aluno.nome
                );

            }

        }
    );


    let texto =
        "";


    if (
        vitimas.length > 0
    ) {

        texto +=
            `Possível vítima: ${vitimas.join(", ")}`;

    }


    if (
        autores.length > 0
    ) {

        if (
            texto
        ) {

            texto +=
                " • ";

        }


        texto +=
            `Possível autor: ${autores.join(", ")}`;

    }


    if (
        texto
    ) {

        return texto;

    }


    if (
        caso.estudantes_envolvidos
    ) {

        return caso.estudantes_envolvidos;

    }


    return "Participantes não informados";

}


/* =========================================================
   Denúncia
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
            caso.denuncias.length ===
            0
        ) {

            return null;

        }


        return caso.denuncias[0];

    }


    return caso.denuncias;

}


/* =========================================================
   Responsável
   ========================================================= */

function obterResponsavel(
    caso
) {

    if (!caso ||
        !caso.responsavel
    ) {

        return null;

    }


    if (
        Array.isArray(
            caso.responsavel
        )
    ) {

        if (
            caso.responsavel.length ===
            0
        ) {

            return null;

        }


        return caso.responsavel[0];

    }


    return caso.responsavel;

}


/* =========================================================
   Prazo
   ========================================================= */

function montarPrazo(
    valor
) {

    if (!valor) {

        return {
            texto: "Sem prazo definido",

            classe: ""
        };

    }


    const dataPrazo =
        converterDataBanco(
            valor
        );


    if (!dataPrazo) {

        return {
            texto: "Prazo não informado",

            classe: ""
        };

    }


    const hoje =
        inicioDoDia(
            new Date()
        );


    const diferenca =
        Math.round(
            (
                dataPrazo.getTime() -
                hoje.getTime()
            ) /
            86400000
        );


    const dataFormatada =
        dataPrazo.toLocaleDateString(
            "pt-BR"
        );


    if (
        diferenca < 0
    ) {

        return {
            texto: `Vencido • ${dataFormatada}`,

            classe: "cases-due-overdue"
        };

    }


    if (
        diferenca === 0
    ) {

        return {
            texto: `Vence hoje • ${dataFormatada}`,

            classe: "cases-due-soon"
        };

    }


    if (
        diferenca <= 7
    ) {

        return {
            texto: `Prazo próximo • ${dataFormatada}`,

            classe: "cases-due-soon"
        };

    }


    return {
        texto: `Prazo • ${dataFormatada}`,

        classe: ""
    };

}


/* =========================================================
   Converter data do banco
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
        partes.length !==
        3
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
   Formatar data de abertura
   ========================================================= */

function formatarDataHora(
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
   Normalizar texto
   ========================================================= */

function normalizarTexto(
    texto
) {

    return String(
            texto ||
            ""
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
   Eventos dos filtros
   ========================================================= */

casesSearch.addEventListener(
    "input",
    aplicarFiltros
);


filterEtapa.addEventListener(
    "change",
    aplicarFiltros
);


filterAtencao.addEventListener(
    "change",
    aplicarFiltros
);


filterStatus.addEventListener(
    "change",
    aplicarFiltros
);


filterResponsavel.addEventListener(
    "change",
    aplicarFiltros
);


/* =========================================================
   Limpar filtros
   ========================================================= */

clearFiltersButton.addEventListener(
    "click",
    function() {

        casesSearch.value =
            "";


        filterEtapa.value =
            "";


        filterAtencao.value =
            "";


        filterStatus.value =
            "";


        filterResponsavel.value =
            "";


        aplicarFiltros();

    }
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

        }

    }
);


/* =========================================================
   Erro
   ========================================================= */

function mostrarErro() {

    casesCount.textContent =
        "—";


    casesList.innerHTML =
        `
        <div class="cases-empty-state">

            <span class="cases-empty-icon">
                !
            </span>

            <strong>
                Não foi possível carregar os casos.
            </strong>

            <span>
                Atualize a página e tente novamente.
            </span>

        </div>
        `;

}


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