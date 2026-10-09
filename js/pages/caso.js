/* =========================================================
   PEC - GESTÃO DE CASOS
   Detalhes do caso
   ========================================================= */


let usuarioAtual = null;
let perfilAtual = null;

let casoAtual = null;
let denunciaAtual = null;

let participantesAtuais = [];
let documentosAtuais = [];
let historicoAtual = [];

let arquivoEvidenciaSelecionado = null;
let uploadEvidenciaEmAndamento = false;

/* =========================================================
   Elementos gerais
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

const navMeusRegistros =
    document.getElementById(
        "navMeusRegistros"
    );


const mobileHomeButton =
    document.getElementById(
        "mobileHomeButton"
    );

const mobileNewCaseButton =
    document.getElementById(
        "mobileNewCaseButton"
    );

const mobileRecordsButton =
    document.getElementById(
        "mobileRecordsButton"
    );


/* =========================================================
   Estados da página
   ========================================================= */

const caseLoading =
    document.getElementById(
        "caseLoading"
    );

const caseError =
    document.getElementById(
        "caseError"
    );

const caseErrorText =
    document.getElementById(
        "caseErrorText"
    );

const caseContent =
    document.getElementById(
        "caseContent"
    );

const backErrorButton =
    document.getElementById(
        "backErrorButton"
    );


/* =========================================================
   Cabeçalho
   ========================================================= */

const backRecordsButton =
    document.getElementById(
        "backRecordsButton"
    );

const caseNumber =
    document.getElementById(
        "caseNumber"
    );

const caseStatus =
    document.getElementById(
        "caseStatus"
    );

const caseCreatedAt =
    document.getElementById(
        "caseCreatedAt"
    );

const caseCurrentStage =
    document.getElementById(
        "caseCurrentStage"
    );

const caseAttentionLevel =
    document.getElementById(
        "caseAttentionLevel"
    );


/* =========================================================
   Registro inicial
   ========================================================= */

const caseRiskAlert =
    document.getElementById(
        "caseRiskAlert"
    );

const caseOccurrenceDate =
    document.getElementById(
        "caseOccurrenceDate"
    );

const caseOrigin =
    document.getElementById(
        "caseOrigin"
    );

const caseEnvironment =
    document.getElementById(
        "caseEnvironment"
    );

const caseEnvironmentType =
    document.getElementById(
        "caseEnvironmentType"
    );

const caseHasEvidence =
    document.getElementById(
        "caseHasEvidence"
    );

const caseImmediateRisk =
    document.getElementById(
        "caseImmediateRisk"
    );

const caseDescription =
    document.getElementById(
        "caseDescription"
    );


/* =========================================================
   Participantes
   ========================================================= */

const victimsCount =
    document.getElementById(
        "victimsCount"
    );

const authorsCount =
    document.getElementById(
        "authorsCount"
    );

const witnessesCount =
    document.getElementById(
        "witnessesCount"
    );


const victimsList =
    document.getElementById(
        "victimsList"
    );

const authorsList =
    document.getElementById(
        "authorsList"
    );

const witnessesList =
    document.getElementById(
        "witnessesList"
    );


/* =========================================================
   Evidências
   ========================================================= */

const addEvidenceButton =
    document.getElementById(
        "addEvidenceButton"
    );

const evidenceEmpty =
    document.getElementById(
        "evidenceEmpty"
    );

const evidenceEmptyText =
    document.getElementById(
        "evidenceEmptyText"
    );

const evidenceList =
    document.getElementById(
        "evidenceList"
    );


/* =========================================================
   Modal de evidência
   ========================================================= */

const evidenceModal =
    document.getElementById(
        "evidenceModal"
    );

const evidenceModalBackdrop =
    document.getElementById(
        "evidenceModalBackdrop"
    );

const closeEvidenceModalButton =
    document.getElementById(
        "closeEvidenceModalButton"
    );

const cancelEvidenceButton =
    document.getElementById(
        "cancelEvidenceButton"
    );

const evidenceDropzone =
    document.getElementById(
        "evidenceDropzone"
    );

const selectEvidenceButton =
    document.getElementById(
        "selectEvidenceButton"
    );

const evidenceFileInput =
    document.getElementById(
        "evidenceFileInput"
    );

const evidenceSelectedFile =
    document.getElementById(
        "evidenceSelectedFile"
    );

const evidenceSelectedIcon =
    document.getElementById(
        "evidenceSelectedIcon"
    );

const evidenceSelectedName =
    document.getElementById(
        "evidenceSelectedName"
    );

const evidenceSelectedDetails =
    document.getElementById(
        "evidenceSelectedDetails"
    );

const removeEvidenceFileButton =
    document.getElementById(
        "removeEvidenceFileButton"
    );

const evidenceUploadMessage =
    document.getElementById(
        "evidenceUploadMessage"
    );

const uploadEvidenceButton =
    document.getElementById(
        "uploadEvidenceButton"
    );

const uploadEvidenceButtonText =
    document.getElementById(
        "uploadEvidenceButtonText"
    );

const evidenceUploadSpinner =
    document.getElementById(
        "evidenceUploadSpinner"
    );


/* =========================================================
   Timeline
   ========================================================= */

const caseTimeline =
    document.getElementById(
        "caseTimeline"
    );


/* =========================================================
   Toast
   ========================================================= */

const toast =
    document.getElementById(
        "toast"
    );

const toastText =
    document.getElementById(
        "toastText"
    );


/* =========================================================
   Modal remover evidência
   ========================================================= */

const removeEvidenceModal =
    document.getElementById(
        "removeEvidenceModal"
    );

const removeEvidenceBackdrop =
    document.getElementById(
        "removeEvidenceBackdrop"
    );

const removeEvidenceFileName =
    document.getElementById(
        "removeEvidenceFileName"
    );

const cancelRemoveEvidenceButton =
    document.getElementById(
        "cancelRemoveEvidenceButton"
    );

const confirmRemoveEvidenceButton =
    document.getElementById(
        "confirmRemoveEvidenceButton"
    );


let documentoAguardandoRemocao =
    null;


/* =========================================================
   Inicialização
   ========================================================= */

async function iniciarPagina() {

    configurarEventos();


    usuarioAtual =
        await window.pecSessao
        .exigirSessao(
            "../login.html"
        );


    if (!usuarioAtual) {
        return;
    }


    await carregarPerfil();


    const casoId =
        obterCasoIdDaUrl();


    if (!casoId) {

        mostrarErro(
            "O endereço deste registro está incompleto."
        );

        return;
    }


    await carregarCaso(
        casoId
    );

}


iniciarPagina();


/* =========================================================
   ID do caso vindo da URL
   ========================================================= */

function obterCasoIdDaUrl() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id =
        parametros.get(
            "id"
        );


    if (!id) {
        return null;
    }


    return id;

}


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


        return;
    }


    perfilAtual =
        resultado.data;


    atualizarPerfilVisual();

}


/* =========================================================
   Perfil visual
   ========================================================= */

function atualizarPerfilVisual() {

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
   Carregar caso
   ========================================================= */

async function carregarCaso(
    casoId
) {

    mostrarCarregamento();


    const resultado =
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
                "responsavel_id",
                "created_at"
            ].join(", ")
        )
        .eq(
            "id",
            casoId
        )
        .maybeSingle();


    if (resultado.error) {

        console.error(
            "Erro ao carregar caso:",
            resultado.error
        );


        mostrarErro(
            "Não foi possível carregar este registro."
        );

        return;
    }


    if (!resultado.data) {

        mostrarErro(
            "Este registro não foi encontrado ou você não possui acesso a ele."
        );

        return;
    }


    casoAtual =
        resultado.data;


    await Promise.all([
        carregarDenuncia(),
        carregarParticipantes(),
        carregarDocumentos(),
        carregarHistorico()
    ]);


    preencherCaso();

}


/* =========================================================
   Denúncia / registro inicial
   ========================================================= */

async function carregarDenuncia() {

    const resultado =
        await window.pecSupabase
        .from(
            "denuncias"
        )
        .select(
            [
                "id",
                "caso_id",
                "origem_informacao",
                "data_recebimento",
                "horario_recebimento",
                "quem_comunicou",
                "descricao_inicial",
                "ambiente",
                "tipo_ambiente",
                "existencia_evidencias_iniciais",
                "indicacao_risco_imediato",
                "data_ocorrencia",
                "horario_ocorrencia",
                "horario_ocorrencia_aproximado",
                "created_at"
            ].join(", ")
        )
        .eq(
            "caso_id",
            casoAtual.id
        )
        .maybeSingle();


    if (resultado.error) {

        console.error(
            "Erro ao carregar registro inicial:",
            resultado.error
        );


        denunciaAtual =
            null;

        return;
    }


    denunciaAtual =
        resultado.data ||
        null;

}


/* =========================================================
   Participantes
   ========================================================= */

async function carregarParticipantes() {

    const resultado =
        await window.pecSupabase
        .from(
            "caso_participantes"
        )
        .select(
            [
                "id",
                "papel",
                "tipo_participante",
                "aluno_id",
                "usuario_id",
                "funcionario_id",
                "nome_externo",
                "funcao_externa"
            ].join(", ")
        )
        .eq(
            "caso_id",
            casoAtual.id
        )
        .order(
            "created_at", {
                ascending: true
            }
        );


    if (resultado.error) {

        console.error(
            "Erro ao carregar participantes:",
            resultado.error
        );


        participantesAtuais = [];

        return;
    }


    participantesAtuais =
        resultado.data || [];


    await carregarDadosParticipantes();

}


/* =========================================================
   Dados dos participantes
   ========================================================= */

async function carregarDadosParticipantes() {

    const alunosIds =
        obterIdsUnicos(
            participantesAtuais,
            "aluno_id"
        );


    const usuariosIds =
        obterIdsUnicos(
            participantesAtuais,
            "usuario_id"
        );


    const funcionariosIds =
        obterIdsUnicos(
            participantesAtuais,
            "funcionario_id"
        );


    const resultados =
        await Promise.all([
            buscarAlunos(
                alunosIds
            ),
            buscarUsuarios(
                usuariosIds
            ),
            buscarFuncionarios(
                funcionariosIds
            )
        ]);


    const alunos =
        resultados[0];

    const usuarios =
        resultados[1];

    const funcionarios =
        resultados[2];


    participantesAtuais.forEach(
        function(
            participante
        ) {

            participante.nome_exibicao =
                "Participante";


            participante.detalhes_exibicao =
                "";


            if (
                participante.tipo_participante ===
                "aluno"
            ) {

                const aluno =
                    alunos.find(
                        function(item) {

                            return (
                                item.id ===
                                participante.aluno_id
                            );

                        }
                    );


                if (aluno) {

                    participante.nome_exibicao =
                        aluno.nome;


                    participante.detalhes_exibicao =
                        montarDetalhesAluno(
                            aluno
                        );

                }

            }


            if (
                participante.tipo_participante ===
                "usuario"
            ) {

                const usuario =
                    usuarios.find(
                        function(item) {

                            return (
                                item.id ===
                                participante.usuario_id
                            );

                        }
                    );


                if (usuario) {

                    participante.nome_exibicao =
                        usuario.nome;


                    participante.detalhes_exibicao =
                        usuario.cargo ||
                        "Equipe escolar";

                }

            }


            if (
                participante.tipo_participante ===
                "funcionario"
            ) {

                const funcionario =
                    funcionarios.find(
                        function(item) {

                            return (
                                item.id ===
                                participante.funcionario_id
                            );

                        }
                    );


                if (funcionario) {

                    participante.nome_exibicao =
                        funcionario.nome;


                    participante.detalhes_exibicao =
                        funcionario.funcao ||
                        "Profissional da escola";

                }

            }


            if (
                participante.tipo_participante ===
                "externo"
            ) {

                participante.nome_exibicao =
                    participante.nome_externo ||
                    "Pessoa externa";


                participante.detalhes_exibicao =
                    participante.funcao_externa ||
                    "Pessoa não cadastrada";

            }

        }
    );

}


/* =========================================================
   IDs únicos
   ========================================================= */

function obterIdsUnicos(
    lista,
    campo
) {

    return lista
        .map(
            function(item) {

                return item[campo];

            }
        )
        .filter(
            function(id) {

                return Boolean(id);

            }
        )
        .filter(
            function(
                id,
                indice,
                array
            ) {

                return (
                    array.indexOf(id) ===
                    indice
                );

            }
        );

}


/* =========================================================
   Buscar alunos
   ========================================================= */

async function buscarAlunos(
    ids
) {

    if (
        ids.length === 0
    ) {
        return [];
    }


    const resultado =
        await window.pecSupabase
        .from(
            "alunos"
        )
        .select(
            "id, nome, serie, turma, periodo"
        )
        .in(
            "id",
            ids
        );


    if (resultado.error) {

        console.error(
            "Erro ao carregar alunos:",
            resultado.error
        );


        return [];
    }


    return resultado.data || [];

}


/* =========================================================
   Buscar usuários
   ========================================================= */

async function buscarUsuarios(
    ids
) {

    if (
        ids.length === 0
    ) {
        return [];
    }


    const resultado =
        await window.pecSupabase
        .from(
            "profiles"
        )
        .select(
            "id, nome, cargo"
        )
        .in(
            "id",
            ids
        );


    if (resultado.error) {

        console.error(
            "Erro ao carregar usuários:",
            resultado.error
        );


        return [];
    }


    return resultado.data || [];

}


/* =========================================================
   Buscar funcionários
   ========================================================= */

async function buscarFuncionarios(
    ids
) {

    if (
        ids.length === 0
    ) {
        return [];
    }


    const resultado =
        await window.pecSupabase
        .from(
            "funcionarios"
        )
        .select(
            "id, nome, funcao"
        )
        .in(
            "id",
            ids
        );


    if (resultado.error) {

        console.error(
            "Erro ao carregar profissionais:",
            resultado.error
        );


        return [];
    }


    return resultado.data || [];

}


/* =========================================================
   Detalhes do aluno
   ========================================================= */

function montarDetalhesAluno(
    aluno
) {

    return [
            aluno.serie,
            aluno.turma,
            aluno.periodo
        ]
        .filter(
            function(item) {

                return (
                    item &&
                    String(item).trim() !== ""
                );

            }
        )
        .join(
            " • "
        );

}


/* =========================================================
   Documentos
   ========================================================= */

async function carregarDocumentos() {

    const resultado =
        await window.pecSupabase
        .from(
            "documentos"
        )
        .select(
            [
                "id",
                "caso_id",
                "etapa",
                "nome_arquivo",
                "storage_path",
                "uploaded_by",
                "created_at",
                "removido_em",
                "removido_por",
                "motivo_remocao"
            ].join(", ")
        )
        .eq(
            "caso_id",
            casoAtual.id
        )

    .is(
            "removido_em",
            null
        )
        .order(
            "created_at", {
                ascending: false
            }
        );


    if (resultado.error) {

        console.error(
            "Erro ao carregar evidências:",
            resultado.error
        );


        documentosAtuais = [];

        return;
    }


    documentosAtuais =
        resultado.data || [];

}

/* =========================================================
   Histórico do caso
   ========================================================= */

async function carregarHistorico() {

    const resultado =
        await window.pecSupabase
        .from(
            "caso_historico"
        )
        .select(
            [
                "id",
                "caso_id",
                "tipo_evento",
                "titulo",
                "descricao",
                "etapa",
                "usuario_id",
                "usuario_nome",
                "referencia_id",
                "dados",
                "created_at"
            ].join(", ")
        )
        .eq(
            "caso_id",
            casoAtual.id
        )
        .order(
            "created_at", {
                ascending: false
            }
        );


    if (
        resultado.error
    ) {

        console.error(
            "Erro ao carregar histórico:",
            resultado.error
        );


        historicoAtual = [];

        return;
    }


    historicoAtual =
        resultado.data || [];

}


/* =========================================================
   Preencher página
   ========================================================= */

function preencherCaso() {

    preencherCabecalho();

    preencherRegistroInicial();

    preencherParticipantes();

    preencherEvidencias();

    preencherTimeline();


    caseLoading.hidden =
        true;


    caseError.hidden =
        true;


    caseContent.hidden =
        false;


    document.title =
        casoAtual.numero_caso +
        " | PEC Gestão de Casos";

}


/* =========================================================
   Cabeçalho
   ========================================================= */

function preencherCabecalho() {

    caseNumber.textContent =
        casoAtual.numero_caso;


    caseStatus.textContent =
        casoAtual.status ||
        "Em andamento";


    caseCreatedAt.textContent =
        formatarData(
            casoAtual.data_abertura ||
            casoAtual.created_at
        );


    caseCurrentStage.textContent =
        formatarEtapa(
            casoAtual.etapa_atual
        );


    if (
        casoAtual.nivel_atencao
    ) {

        caseAttentionLevel.textContent =
            casoAtual.nivel_atencao;

    } else {

        caseAttentionLevel.textContent =
            "Ainda não definido";

    }

}


/* =========================================================
   Registro inicial
   ========================================================= */

function preencherRegistroInicial() {

    if (!denunciaAtual) {

        caseOccurrenceDate.textContent =
            "Não informado";

        caseOrigin.textContent =
            "Não informado";

        caseEnvironment.textContent =
            "Não informado";

        caseEnvironmentType.textContent =
            "Não informado";

        caseHasEvidence.textContent =
            "Não informado";

        caseImmediateRisk.textContent =
            "Não informado";

        caseDescription.textContent =
            "O registro inicial não está disponível.";

        caseRiskAlert.hidden =
            true;

        return;
    }


    caseOccurrenceDate.textContent =
        formatarOcorrencia(
            denunciaAtual
        );


    caseOrigin.textContent =
        formatarOrigem(
            denunciaAtual.origem_informacao
        );


    caseEnvironment.textContent =
        denunciaAtual.ambiente ||
        "Não informado";


    caseEnvironmentType.textContent =
        denunciaAtual.tipo_ambiente ||
        "Não informado";


    if (
        denunciaAtual
        .existencia_evidencias_iniciais ===
        true
    ) {

        caseHasEvidence.textContent =
            "Sim";

    } else {

        caseHasEvidence.textContent =
            "Não";

    }


    if (
        denunciaAtual
        .indicacao_risco_imediato ===
        true
    ) {

        caseImmediateRisk.textContent =
            "Sim • Atenção imediata";


        caseRiskAlert.hidden =
            false;

    } else {

        caseImmediateRisk.textContent =
            "Não";


        caseRiskAlert.hidden =
            true;

    }


    caseDescription.textContent =
        denunciaAtual.descricao_inicial ||
        "Não informado";

}


/* =========================================================
   Participantes
   ========================================================= */

function preencherParticipantes() {

    const vitimas =
        participantesAtuais.filter(
            function(
                participante
            ) {

                return (
                    participante.papel ===
                    "possivel_vitima"
                );

            }
        );


    const autores =
        participantesAtuais.filter(
            function(
                participante
            ) {

                return (
                    participante.papel ===
                    "possivel_autor"
                );

            }
        );


    const testemunhas =
        participantesAtuais.filter(
            function(
                participante
            ) {

                return (
                    participante.papel ===
                    "testemunha"
                );

            }
        );


    victimsCount.textContent =
        formatarQuantidade(
            vitimas.length
        );


    authorsCount.textContent =
        formatarQuantidade(
            autores.length
        );


    witnessesCount.textContent =
        formatarQuantidade(
            testemunhas.length
        );


    renderizarParticipantes(
        victimsList,
        vitimas
    );


    renderizarParticipantes(
        authorsList,
        autores
    );


    renderizarParticipantes(
        witnessesList,
        testemunhas
    );

}


/* =========================================================
   Quantidade
   ========================================================= */

function formatarQuantidade(
    quantidade
) {

    if (
        quantidade === 1
    ) {

        return "1 pessoa";

    }


    return (
        quantidade +
        " pessoas"
    );

}


/* =========================================================
   Cards dos participantes
   ========================================================= */

function renderizarParticipantes(
    container,
    participantes
) {

    if (
        participantes.length === 0
    ) {

        container.innerHTML =
            `
            <div class="case-participant">

                <div class="case-participant-info">

                    <span>
                        Nenhuma pessoa informada
                    </span>

                </div>

            </div>
            `;

        return;
    }


    container.innerHTML =
        participantes
        .map(
            function(
                participante
            ) {

                const nome =
                    participante.nome_exibicao ||
                    "Participante";


                const detalhes =
                    participante.detalhes_exibicao ||
                    "";


                const inicial =
                    nome
                    .charAt(0)
                    .toUpperCase();


                return `
                        <div class="case-participant">

                            <div class="case-participant-avatar">
                                ${escaparHtml(inicial)}
                            </div>


                            <div class="case-participant-info">

                                <strong
                                    title="${escaparHtml(nome)}"
                                >
                                    ${escaparHtml(nome)}
                                </strong>

                                <span
                                    title="${escaparHtml(detalhes)}"
                                >
                                    ${escaparHtml(detalhes)}
                                </span>

                            </div>

                        </div>
                    `;

            }
        )
        .join("");

}


/* =========================================================
   Evidências
   ========================================================= */

function preencherEvidencias() {

    if (
        documentosAtuais.length === 0
    ) {

        evidenceList.hidden =
            true;


        evidenceEmpty.hidden =
            false;


        if (
            denunciaAtual &&
            denunciaAtual
            .existencia_evidencias_iniciais ===
            true
        ) {

            evidenceEmptyText.textContent =
                "Foi informado que existem evidências relacionadas, mas nenhum arquivo foi anexado ainda.";

        } else {

            evidenceEmptyText.textContent =
                "Nenhum arquivo foi anexado a este caso.";

        }


        return;
    }


    evidenceEmpty.hidden =
        true;


    evidenceList.hidden =
        false;


    evidenceList.innerHTML =
        documentosAtuais
        .map(
            function(
                documento
            ) {

                const podeRemover =
                    podeRemoverDocumento(
                        documento
                    );


                let botaoRemover =
                    "";


                if (
                    podeRemover
                ) {

                    botaoRemover = `
                        <button
                            type="button"
                            class="evidence-delete-button"
                            data-action="remove-evidence"
                            data-document-id="${escaparHtml(
                                documento.id
                            )}"
                            aria-label="Remover evidência"
                            title="Remover arquivo enviado por engano"
                        >
                            ×
                        </button>
                    `;

                }


                return `
                    <div class="evidence-item">

                        <button
                            type="button"
                            class="evidence-open-button"
                            data-action="open-evidence"
                            data-document-id="${escaparHtml(
                                documento.id
                            )}"
                            title="Abrir ${escaparHtml(
                                documento.nome_arquivo
                            )}"
                        >

                            <div class="evidence-item-icon">
                                ${obterIconeArquivo(
                                    documento.nome_arquivo
                                )}
                            </div>


                            <div class="evidence-item-info">

                                <strong>
                                    ${escaparHtml(
                                        documento.nome_arquivo
                                    )}
                                </strong>

                                <span>
                                    ${escaparHtml(
                                        formatarEtapaDocumento(
                                            documento.etapa
                                        )
                                    )}
                                    •
                                    ${formatarData(
                                        documento.created_at
                                    )}
                                </span>

                            </div>

                        </button>


                        ${botaoRemover}

                    </div>
                `;

            }
        )
        .join("");

}


/* =========================================================
   Ícone do arquivo
   ========================================================= */

function obterIconeArquivo(
    nomeArquivo
) {

    const nome =
        String(
            nomeArquivo ||
            ""
        )
        .toLowerCase();


    if (
        nome.endsWith(".jpg") ||
        nome.endsWith(".jpeg") ||
        nome.endsWith(".png") ||
        nome.endsWith(".webp")
    ) {

        return "IMG";

    }


    if (
        nome.endsWith(".mp3") ||
        nome.endsWith(".m4a") ||
        nome.endsWith(".wav") ||
        nome.endsWith(".ogg")
    ) {

        return "ÁUD";

    }


    if (
        nome.endsWith(".pdf")
    ) {

        return "PDF";

    }


    return "DOC";

}


/* =========================================================
   Etapa do documento
   ========================================================= */

function formatarEtapaDocumento(
    etapa
) {

    if (
        etapa ===
        "registro_inicial"
    ) {

        return "Registro inicial";

    }


    if (!etapa) {

        return "Caso";

    }


    return formatarEtapa(
        etapa
    );

}


/* =========================================================
   Timeline
   ========================================================= */

function preencherTimeline() {

    if (
        historicoAtual.length === 0
    ) {

        caseTimeline.innerHTML =
            `
            <div class="timeline-empty">
                Nenhuma atualização registrada ainda.
            </div>
            `;

        return;
    }


    caseTimeline.innerHTML =
        historicoAtual
        .map(
            function(
                evento,
                indice
            ) {

                const maisRecente =
                    indice === 0;


                const icone =
                    obterIconeHistorico(
                        evento.tipo_evento
                    );


                const descricao =
                    montarDescricaoHistorico(
                        evento
                    );


                const usuario =
                    evento.usuario_nome ||
                    "Sistema";


                return `
                        <div
                            class="timeline-item ${
                                maisRecente
                                ? "active"
                                : ""
                            }"
                        >

                            <div class="timeline-marker">
                                ${escaparHtml(icone)}
                            </div>


                            <div>

                                <strong>
                                    ${escaparHtml(
                                        evento.titulo
                                    )}
                                </strong>

                                <span>
                                    ${escaparHtml(usuario)}
                                    •
                                    ${escaparHtml(
                                        formatarDataHora(
                                            evento.created_at
                                        )
                                    )}
                                </span>

                                <p>
                                    ${escaparHtml(
                                        descricao
                                    )}
                                </p>

                            </div>

                        </div>
                    `;

            }
        )
        .join("");

}


function obterIconeHistorico(
    tipoEvento
) {

    const icones = {

        registro_criado: "✓",

        evidencia_adicionada: "+",

        evidencia_removida: "×",

        evidencia_restaurada: "↺",

        etapa_alterada: "→",

        status_alterado: "•",

        nivel_atencao_alterado: "!"

    };


    return icones[tipoEvento] ||
        "•";

}


function montarDescricaoHistorico(
    evento
) {

    if (
        evento.tipo_evento ===
        "registro_criado"
    ) {

        return (
            evento.descricao ||
            "A situação foi registrada no sistema."
        );

    }


    if (
        evento.tipo_evento ===
        "evidencia_adicionada"
    ) {

        return (
            "Arquivo adicionado: " +
            (
                evento.descricao ||
                "evidência"
            )
        );

    }


    if (
        evento.tipo_evento ===
        "evidencia_removida"
    ) {

        return (
            "Arquivo removido: " +
            (
                evento.descricao ||
                "evidência"
            )
        );

    }


    if (
        evento.tipo_evento ===
        "evidencia_restaurada"
    ) {

        return (
            "A remoção do arquivo foi desfeita."
        );

    }


    if (
        evento.tipo_evento ===
        "etapa_alterada"
    ) {

        if (
            evento.dados &&
            evento.dados.etapa_nova
        ) {

            return (
                "O caso avançou para " +
                formatarEtapa(
                    evento.dados.etapa_nova
                ) +
                "."
            );

        }

    }


    if (
        evento.tipo_evento ===
        "status_alterado"
    ) {

        if (
            evento.dados &&
            evento.dados.status_novo
        ) {

            return (
                "Novo status: " +
                evento.dados.status_novo +
                "."
            );

        }

    }


    if (
        evento.tipo_evento ===
        "nivel_atencao_alterado"
    ) {

        if (
            evento.dados &&
            evento.dados.nivel_novo
        ) {

            return (
                "Nível de atenção definido como " +
                evento.dados.nivel_novo +
                "."
            );

        }

    }


    return (
        evento.descricao ||
        "Atualização registrada no caso."
    );

}


/* =========================================================
   Formatar etapa
   ========================================================= */

function formatarEtapa(
    etapa
) {

    const etapas = {

        denuncia: "Registro inicial",

        triagem: "Triagem",

        levantamento: "Levantamento",

        analise: "Análise",

        classificacao: "Classificação",

        intervencao: "Intervenção",

        monitoramento: "Monitoramento",

        reavaliacao: "Reavaliação",

        encerramento: "Encerramento"

    };


    if (
        etapa &&
        etapas[etapa]
    ) {

        return etapas[etapa];

    }


    return etapa ||
        "Registro inicial";

}


/* =========================================================
   Formatar origem
   ========================================================= */

function formatarOrigem(
    origem
) {

    const origens = {

        Professor: "Eu presenciei",

        Responsavel: "Responsável pelo estudante",

        Aluno: "Um estudante me contou",

        Gestao: "A gestão me informou",

        Colega: "Um colega comunicou",

        Canal: "Canal institucional",

        Outro: "Outra origem"

    };


    if (
        origem &&
        origens[origem]
    ) {

        return origens[origem];

    }


    return origem ||
        "Não informado";

}


/* =========================================================
   Ocorrência
   ========================================================= */

function formatarOcorrencia(
    denuncia
) {

    if (!denuncia.data_ocorrencia) {

        return "Não informado";

    }


    let texto =
        formatarData(
            denuncia.data_ocorrencia
        );


    if (
        denuncia.horario_ocorrencia
    ) {

        const horario =
            String(
                denuncia.horario_ocorrencia
            )
            .slice(
                0,
                5
            );


        texto +=
            " às " +
            horario;


        if (
            denuncia
            .horario_ocorrencia_aproximado ===
            true
        ) {

            texto +=
                " (aproximadamente)";

        }

    }


    return texto;

}


/* =========================================================
   Formatar data
   ========================================================= */

function formatarData(
    data
) {

    if (!data) {
        return "—";
    }


    const texto =
        String(data);


    if (
        texto.length === 10
    ) {

        const partes =
            texto.split(
                "-"
            );


        return (
            partes[2] +
            "/" +
            partes[1] +
            "/" +
            partes[0]
        );

    }


    const objeto =
        new Date(
            data
        );


    return objeto
        .toLocaleDateString(
            "pt-BR"
        );

}


/* =========================================================
   Data e hora
   ========================================================= */

function formatarDataHora(
    data
) {

    if (!data) {
        return "—";
    }


    const objeto =
        new Date(
            data
        );


    return objeto
        .toLocaleString(
            "pt-BR", {
                day: "2-digit",

                month: "2-digit",

                year: "numeric",

                hour: "2-digit",

                minute: "2-digit"
            }
        );

}


/* =========================================================
   Carregamento
   ========================================================= */

function mostrarCarregamento() {

    caseLoading.hidden =
        false;


    caseError.hidden =
        true;


    caseContent.hidden =
        true;

}


/* =========================================================
   Erro
   ========================================================= */

function mostrarErro(
    mensagem
) {

    caseLoading.hidden =
        true;


    caseContent.hidden =
        true;


    caseError.hidden =
        false;


    caseErrorText.textContent =
        mensagem;

}


/* =========================================================
   Eventos
   ========================================================= */

function configurarEventos() {

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


    navMeusRegistros.addEventListener(
        "click",
        abrirMeusRegistros
    );


    mobileRecordsButton.addEventListener(
        "click",
        abrirMeusRegistros
    );


    backRecordsButton.addEventListener(
        "click",
        abrirMeusRegistros
    );


    backErrorButton.addEventListener(
        "click",
        abrirMeusRegistros
    );


    /*
     * O upload será conectado no próximo passo.
     */

    /* =====================================================
   Abrir modal de evidência
   ===================================================== */

    addEvidenceButton.addEventListener(
        "click",
        abrirModalEvidencia
    );


    /* =====================================================
       Fechar modal
       ===================================================== */

    closeEvidenceModalButton.addEventListener(
        "click",
        fecharModalEvidencia
    );


    cancelEvidenceButton.addEventListener(
        "click",
        fecharModalEvidencia
    );


    evidenceModalBackdrop.addEventListener(
        "click",
        fecharModalEvidencia
    );


    cancelRemoveEvidenceButton.addEventListener(
        "click",
        fecharModalRemocao
    );


    removeEvidenceBackdrop.addEventListener(
        "click",
        fecharModalRemocao
    );


    confirmRemoveEvidenceButton.addEventListener(
        "click",
        confirmarRemocaoEvidencia
    );


    /* =====================================================
       Selecionar arquivo
       ===================================================== */

    selectEvidenceButton.addEventListener(
        "click",
        function() {

            evidenceFileInput.click();

        }
    );


    evidenceFileInput.addEventListener(
        "change",
        function() {

            if (
                evidenceFileInput.files.length === 0
            ) {
                return;
            }


            selecionarArquivoEvidencia(
                evidenceFileInput.files[0]
            );

        }
    );


    /* =====================================================
       Remover arquivo
       ===================================================== */

    removeEvidenceFileButton.addEventListener(
        "click",
        limparArquivoSelecionado
    );


    /* =====================================================
       Arrastar arquivo
       ===================================================== */

    evidenceDropzone.addEventListener(
        "dragover",
        function(event) {

            event.preventDefault();

            evidenceDropzone.classList.add(
                "dragging"
            );

        }
    );


    evidenceDropzone.addEventListener(
        "dragleave",
        function() {

            evidenceDropzone.classList.remove(
                "dragging"
            );

        }
    );


    evidenceDropzone.addEventListener(
        "drop",
        function(event) {

            event.preventDefault();


            evidenceDropzone.classList.remove(
                "dragging"
            );


            if (
                event.dataTransfer.files.length === 0
            ) {
                return;
            }


            selecionarArquivoEvidencia(
                event.dataTransfer.files[0]
            );

        }
    );


    /* =====================================================
       Escape fecha modal
       ===================================================== */

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape" &&
                evidenceModal.hidden === false
            ) {

                fecharModalEvidencia();

            }

        }
    );


    /* =====================================================
   Enviar evidência
   ===================================================== */

    uploadEvidenceButton.addEventListener(
        "click",
        enviarEvidencia
    );


    logoutButton.addEventListener(
        "click",
        executarLogout
    );

    evidenceList.addEventListener(
        "click",
        async function(
            event
        ) {

            const botaoRemover =
                event.target.closest(
                    '[data-action="remove-evidence"]'
                );


            if (
                botaoRemover
            ) {

                event.preventDefault();

                event.stopPropagation();


                await removerEvidencia(
                    botaoRemover.dataset.documentId
                );


                return;
            }


            const botaoAbrir =
                event.target.closest(
                    '[data-action="open-evidence"]'
                );


            if (
                botaoAbrir
            ) {

                await abrirEvidencia(
                    botaoAbrir.dataset.documentId
                );

            }

        }
    );

}

/* =========================================================
   Abrir modal de evidência
   ========================================================= */

function abrirModalEvidencia() {

    limparArquivoSelecionado();

    limparMensagemEvidencia();


    evidenceModal.hidden =
        false;


    document.body.style.overflow =
        "hidden";


    setTimeout(
        function() {

            selectEvidenceButton.focus();

        },
        50
    );

}


/* =========================================================
   Fechar modal de evidência
   ========================================================= */

function fecharModalEvidencia() {

    if (
        uploadEvidenciaEmAndamento
    ) {
        return;
    }


    evidenceModal.hidden =
        true;


    document.body.style.overflow =
        "";


    limparArquivoSelecionado();

    limparMensagemEvidencia();

}


/* =========================================================
   Receber arquivo
   ========================================================= */

function selecionarArquivoEvidencia(
    arquivo
) {

    limparMensagemEvidencia();


    const validacao =
        validarArquivoEvidencia(
            arquivo
        );


    if (
        validacao.valido === false
    ) {

        limparArquivoSelecionado();


        mostrarMensagemEvidencia(
            validacao.mensagem
        );


        return;
    }


    arquivoEvidenciaSelecionado =
        arquivo;


    evidenceSelectedIcon.textContent =
        obterIconeArquivo(
            arquivo.name
        );


    evidenceSelectedName.textContent =
        arquivo.name;


    evidenceSelectedName.title =
        arquivo.name;


    evidenceSelectedDetails.textContent =
        obterTipoArquivo(
            arquivo.name
        ) +
        " • " +
        formatarTamanhoArquivo(
            arquivo.size
        );


    evidenceSelectedFile.hidden =
        false;


    uploadEvidenceButton.disabled =
        false;

}


/* =========================================================
   Validar arquivo
   ========================================================= */

function validarArquivoEvidencia(
    arquivo
) {

    if (!arquivo) {

        return {
            valido: false,
            mensagem: "Selecione um arquivo."
        };

    }


    const limite =
        10 * 1024 * 1024;


    if (
        arquivo.size > limite
    ) {

        return {
            valido: false,
            mensagem: "O arquivo ultrapassa o limite de 10 MB."
        };

    }


    if (
        arquivo.size === 0
    ) {

        return {
            valido: false,
            mensagem: "O arquivo selecionado está vazio."
        };

    }


    const nome =
        String(
            arquivo.name ||
            ""
        )
        .toLowerCase();


    const extensoesPermitidas = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".pdf",
        ".doc",
        ".docx",
        ".mp3",
        ".m4a",
        ".wav",
        ".ogg"
    ];


    const permitido =
        extensoesPermitidas.some(
            function(extensao) {

                return nome.endsWith(
                    extensao
                );

            }
        );


    if (!permitido) {

        return {
            valido: false,
            mensagem: "Formato não permitido. Envie imagem, PDF, documento ou áudio."
        };

    }


    return {
        valido: true,
        mensagem: ""
    };

}


/* =========================================================
   Limpar arquivo selecionado
   ========================================================= */

function limparArquivoSelecionado() {

    arquivoEvidenciaSelecionado =
        null;


    evidenceFileInput.value =
        "";


    evidenceSelectedFile.hidden =
        true;


    evidenceSelectedName.textContent =
        "";


    evidenceSelectedName.title =
        "";


    evidenceSelectedDetails.textContent =
        "";


    uploadEvidenceButton.disabled =
        true;


    evidenceUploadSpinner.hidden =
        true;


    uploadEvidenceButtonText.textContent =
        "Enviar evidência";

}


/* =========================================================
   Mensagem do modal
   ========================================================= */

function mostrarMensagemEvidencia(
    mensagem
) {

    evidenceUploadMessage.textContent =
        mensagem;


    evidenceUploadMessage.hidden =
        false;

}


function limparMensagemEvidencia() {

    evidenceUploadMessage.textContent =
        "";


    evidenceUploadMessage.hidden =
        true;

}


/* =========================================================
   Tipo amigável do arquivo
   ========================================================= */

function obterTipoArquivo(
    nomeArquivo
) {

    const nome =
        String(
            nomeArquivo ||
            ""
        )
        .toLowerCase();


    if (
        nome.endsWith(".jpg") ||
        nome.endsWith(".jpeg") ||
        nome.endsWith(".png") ||
        nome.endsWith(".webp")
    ) {

        return "Imagem";

    }


    if (
        nome.endsWith(".mp3") ||
        nome.endsWith(".m4a") ||
        nome.endsWith(".wav") ||
        nome.endsWith(".ogg")
    ) {

        return "Áudio";

    }


    if (
        nome.endsWith(".pdf")
    ) {

        return "PDF";

    }


    if (
        nome.endsWith(".doc") ||
        nome.endsWith(".docx")
    ) {

        return "Documento";

    }


    return "Arquivo";

}


/* =========================================================
   Tamanho amigável
   ========================================================= */

function formatarTamanhoArquivo(
    bytes
) {

    if (
        bytes < 1024
    ) {

        return (
            bytes +
            " bytes"
        );

    }


    if (
        bytes <
        1024 * 1024
    ) {

        return (
            (
                bytes /
                1024
            )
            .toFixed(1)
            .replace(
                ".",
                ","
            ) +
            " KB"
        );

    }


    return (
        (
            bytes /
            1024 /
            1024
        )
        .toFixed(1)
        .replace(
            ".",
            ","
        ) +
        " MB"
    );

}

/* =========================================================
   Enviar evidência
   ========================================================= */

async function enviarEvidencia() {

    if (!arquivoEvidenciaSelecionado) {

        mostrarMensagemEvidencia(
            "Selecione um arquivo antes de enviar."
        );

        return;
    }


    if (!casoAtual ||
        !casoAtual.id
    ) {

        mostrarMensagemEvidencia(
            "Não foi possível identificar o caso."
        );

        return;
    }


    if (!usuarioAtual ||
        !usuarioAtual.id
    ) {

        mostrarMensagemEvidencia(
            "Não foi possível identificar o usuário."
        );

        return;
    }


    limparMensagemEvidencia();


    definirEstadoUpload(
        true
    );


    const arquivo =
        arquivoEvidenciaSelecionado;


    const storagePath =
        criarCaminhoEvidencia(
            arquivo
        );


    /* =====================================================
       1. Upload no Storage
       ===================================================== */

    const resultadoUpload =
        await window.pecSupabase
        .storage
        .from(
            "documentos-casos"
        )
        .upload(
            storagePath,
            arquivo, {
                cacheControl: "3600",

                upsert: false,

                contentType: arquivo.type ||
                    "application/octet-stream"
            }
        );


    if (
        resultadoUpload.error
    ) {

        console.error(
            "Erro no upload da evidência:",
            resultadoUpload.error
        );


        mostrarMensagemEvidencia(
            "Não foi possível enviar o arquivo. Tente novamente."
        );


        definirEstadoUpload(
            false
        );


        return;
    }


    /* =====================================================
       2. Registrar documento no banco
       ===================================================== */

    const resultadoDocumento =
        await window.pecSupabase
        .from(
            "documentos"
        )
        .insert({

            caso_id: casoAtual.id,

            etapa: "registro_inicial",

            nome_arquivo: arquivo.name,

            storage_path: storagePath,

            uploaded_by: usuarioAtual.id

        })
        .select(
            [
                "id",
                "caso_id",
                "etapa",
                "nome_arquivo",
                "storage_path",
                "uploaded_by",
                "created_at"
            ].join(", ")
        )
        .single();


    /* =====================================================
       Se banco falhar, remover arquivo órfão
       ===================================================== */

    if (
        resultadoDocumento.error
    ) {

        console.error(
            "Erro ao registrar evidência:",
            resultadoDocumento.error
        );


        const resultadoLimpeza =
            await window.pecSupabase
            .storage
            .from(
                "documentos-casos"
            )
            .remove(
                [
                    storagePath
                ]
            );


        if (
            resultadoLimpeza.error
        ) {

            console.error(
                "Erro ao limpar arquivo órfão:",
                resultadoLimpeza.error
            );

        }


        mostrarMensagemEvidencia(
            "O arquivo não pôde ser vinculado ao caso. Tente novamente."
        );


        definirEstadoUpload(
            false
        );


        return;
    }


    /* =====================================================
       3. Atualizar a tela imediatamente
       ===================================================== */

    documentosAtuais.unshift(
        resultadoDocumento.data
    );


    preencherEvidencias();


    /*
     * Atualiza também o histórico,
     * porque o banco acabou de criar
     * um novo evento automaticamente.
     */

    await carregarHistorico();

    preencherTimeline();


    definirEstadoUpload(
        false
    );


    fecharModalEvidencia();


    mostrarToast(
        "Evidência adicionada com sucesso."
    );

}

/* =========================================================
   Criar caminho seguro da evidência
   ========================================================= */

function criarCaminhoEvidencia(
    arquivo
) {

    const nomeOriginal =
        String(
            arquivo.name ||
            "arquivo"
        );


    const ultimoPonto =
        nomeOriginal.lastIndexOf(
            "."
        );


    let extensao =
        "";


    if (
        ultimoPonto >= 0
    ) {

        extensao =
            nomeOriginal
            .substring(
                ultimoPonto
            )
            .toLowerCase();

    }


    let identificador =
        "";


    if (
        window.crypto &&
        typeof window.crypto.randomUUID ===
        "function"
    ) {

        identificador =
            window.crypto.randomUUID();

    } else {

        identificador =
            String(
                Date.now()
            ) +
            "-" +
            Math.random()
            .toString(36)
            .substring(2);

    }


    return (
        casoAtual.id +
        "/" +
        identificador +
        extensao
    );

}

/* =========================================================
   Estado do upload
   ========================================================= */

function definirEstadoUpload(
    enviando
) {

    uploadEvidenciaEmAndamento =
        enviando;


    selectEvidenceButton.disabled =
        enviando;


    removeEvidenceFileButton.disabled =
        enviando;


    cancelEvidenceButton.disabled =
        enviando;


    closeEvidenceModalButton.disabled =
        enviando;


    if (enviando) {

        uploadEvidenceButton.disabled =
            true;


        uploadEvidenceButtonText.textContent =
            "Enviando...";


        evidenceUploadSpinner.hidden =
            false;

    } else {

        uploadEvidenceButton.disabled = !arquivoEvidenciaSelecionado;


        uploadEvidenceButtonText.textContent =
            "Enviar evidência";


        evidenceUploadSpinner.hidden =
            true;

    }

}

/* =========================================================
   Permissão visual para remover evidência
   ========================================================= */

function podeRemoverDocumento(
    documento
) {

    if (!usuarioAtual ||
        !casoAtual
    ) {
        return false;
    }


    if (
        documento.uploaded_by !==
        usuarioAtual.id
    ) {
        return false;
    }


    if (
        casoAtual.etapa_atual !==
        "denuncia"
    ) {
        return false;
    }


    return true;

}

/* =========================================================
   Buscar documento carregado
   ========================================================= */

function obterDocumentoPorId(
    documentoId
) {

    return documentosAtuais.find(
        function(
            documento
        ) {

            return (
                documento.id ===
                documentoId
            );

        }
    );

}


/* =========================================================
   Abrir evidência privada
   ========================================================= */

async function abrirEvidencia(
    documentoId
) {

    const documento =
        obterDocumentoPorId(
            documentoId
        );


    if (!documento) {

        mostrarToast(
            "Não foi possível localizar essa evidência."
        );

        return;
    }


    const resultado =
        await window.pecSupabase
        .storage
        .from(
            "documentos-casos"
        )
        .createSignedUrl(
            documento.storage_path,
            60
        );


    if (
        resultado.error
    ) {

        console.error(
            "Erro ao abrir evidência:",
            resultado.error
        );


        mostrarToast(
            "Não foi possível abrir essa evidência."
        );

        return;
    }


    if (!resultado.data ||
        !resultado.data.signedUrl
    ) {

        mostrarToast(
            "Não foi possível gerar o acesso ao arquivo."
        );

        return;
    }


    window.open(
        resultado.data.signedUrl,
        "_blank",
        "noopener,noreferrer"
    );

}

/* =========================================================
   Solicitar remoção da evidência
   ========================================================= */

async function removerEvidencia(
    documentoId
) {

    const documento =
        obterDocumentoPorId(
            documentoId
        );


    if (!documento) {

        mostrarToast(
            "Não foi possível localizar essa evidência."
        );

        return;
    }


    if (!podeRemoverDocumento(
            documento
        )) {

        mostrarToast(
            "Esta evidência não pode mais ser removida."
        );

        return;
    }


    documentoAguardandoRemocao =
        documento;


    removeEvidenceFileName.textContent =
        documento.nome_arquivo;


    removeEvidenceFileName.title =
        documento.nome_arquivo;


    removeEvidenceModal.hidden =
        false;


    document.body.style.overflow =
        "hidden";

}

/* =========================================================
   Confirmar remoção
   ========================================================= */

async function confirmarRemocaoEvidencia() {

    if (!documentoAguardandoRemocao) {
        return;
    }


    const documento =
        documentoAguardandoRemocao;


    confirmRemoveEvidenceButton.disabled =
        true;


    confirmRemoveEvidenceButton.textContent =
        "Removendo...";


    const agora =
        new Date()
        .toISOString();


    const resultadoMarcacao =
        await window.pecSupabase
        .from(
            "documentos"
        )
        .update({

            removido_em: agora,

            removido_por: usuarioAtual.id,

            motivo_remocao: "Arquivo enviado por engano"

        })
        .eq(
            "id",
            documento.id
        )
        .eq(
            "uploaded_by",
            usuarioAtual.id
        )
        .select(
            "id"
        )
        .maybeSingle();


    if (
        resultadoMarcacao.error ||
        !resultadoMarcacao.data
    ) {

        console.error(
            "Erro ao marcar evidência como removida:",
            resultadoMarcacao.error
        );


        restaurarBotaoRemocao();


        mostrarToast(
            "Não foi possível remover essa evidência."
        );


        return;
    }


    const resultadoStorage =
        await window.pecSupabase
        .storage
        .from(
            "documentos-casos"
        )
        .remove(
            [
                documento.storage_path
            ]
        );


    if (
        resultadoStorage.error
    ) {

        console.error(
            "Erro ao remover arquivo do Storage:",
            resultadoStorage.error
        );


        await window.pecSupabase
            .from(
                "documentos"
            )
            .update({

                removido_em: null,

                removido_por: null,

                motivo_remocao: null

            })
            .eq(
                "id",
                documento.id
            );


        restaurarBotaoRemocao();


        mostrarToast(
            "Não foi possível remover o arquivo."
        );


        return;
    }


    documentosAtuais =
        documentosAtuais.filter(
            function(
                item
            ) {

                return (
                    item.id !==
                    documento.id
                );

            }
        );


    preencherEvidencias();


    /*
     * Atualiza o histórico imediatamente
     * após a remoção.
     */

    await carregarHistorico();

    preencherTimeline();


    fecharModalRemocao();


    mostrarToast(
        "Evidência removida."
    );

}

function fecharModalRemocao() {

    removeEvidenceModal.hidden =
        true;


    document.body.style.overflow =
        "";


    documentoAguardandoRemocao =
        null;


    restaurarBotaoRemocao();

}


function restaurarBotaoRemocao() {

    confirmRemoveEvidenceButton.disabled =
        false;


    confirmRemoveEvidenceButton.textContent =
        "Remover evidência";

}

/* =========================================================
   Navegação
   ========================================================= */

function abrirDashboard() {

    window.location.href =
        "./dashboard.html";

}


function abrirNovaSituacao() {

    window.location.href =
        "./nova-situacao.html";

}


function abrirMeusRegistros() {

    window.location.href =
        "./meus-registros.html";

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
            function() {

                toast.classList
                    .remove(
                        "show"
                    );

            },
            3500
        );

}


/* =========================================================
   Segurança HTML
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