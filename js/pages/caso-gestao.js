/* =========================================================
   PEC - GESTÃO DE CASOS
   Página do caso - Controlador geral
   ========================================================= */


/* =========================================================
   Estado da página
   ========================================================= */

let usuarioAtual = null;

let perfilAtual = null;

let casoAtual = null;

let gestoresDisponiveis = [];

let documentosCaso = [];

let historicoCaso = [];


const casoId =
    new URLSearchParams(
        window.location.search
    )
    .get("id");


/* =========================================================
   Elementos gerais
   ========================================================= */

const casePageLoading =
    document.getElementById(
        "casePageLoading"
    );


const casePageContent =
    document.getElementById(
        "casePageContent"
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


/* =========================================================
   Cabeçalho
   ========================================================= */

const caseNumber =
    document.getElementById(
        "caseNumber"
    );


const caseStageBadge =
    document.getElementById(
        "caseStageBadge"
    );


const caseAttentionBadge =
    document.getElementById(
        "caseAttentionBadge"
    );


const caseOpeningInfo =
    document.getElementById(
        "caseOpeningInfo"
    );


const caseInitialRiskAlert =
    document.getElementById(
        "caseInitialRiskAlert"
    );


/* =========================================================
   Etapas
   ========================================================= */

const caseInitialStage =
    document.getElementById(
        "caseInitialStage"
    );


const triageStage =
    document.getElementById(
        "triageStage"
    );

const levantamentoStage =
    document.getElementById(
        "levantamentoStage"
    );


/* =========================================================
   Registro inicial
   ========================================================= */

const caseOccurrenceDate =
    document.getElementById(
        "caseOccurrenceDate"
    );


const caseEnvironment =
    document.getElementById(
        "caseEnvironment"
    );


const caseEnvironmentType =
    document.getElementById(
        "caseEnvironmentType"
    );


const caseOrigin =
    document.getElementById(
        "caseOrigin"
    );


const caseCommunicator =
    document.getElementById(
        "caseCommunicator"
    );


const caseInitialEvidence =
    document.getElementById(
        "caseInitialEvidence"
    );


const caseParticipants =
    document.getElementById(
        "caseParticipants"
    );


const caseInitialReport =
    document.getElementById(
        "caseInitialReport"
    );


const caseInitialDocuments =
    document.getElementById(
        "caseInitialDocuments"
    );


/* =========================================================
   Histórico
   ========================================================= */

const caseHistory =
    document.getElementById(
        "caseHistory"
    );


/* =========================================================
   Iniciar triagem
   ========================================================= */

const startTriageButton =
    document.getElementById(
        "startTriageButton"
    );


const startTriageModal =
    document.getElementById(
        "startTriageModal"
    );


const closeStartTriageModalButton =
    document.getElementById(
        "closeStartTriageModalButton"
    );


const takeTriageButton =
    document.getElementById(
        "takeTriageButton"
    );


const startTriageOwnerSelect =
    document.getElementById(
        "startTriageOwnerSelect"
    );


const cancelStartTriageButton =
    document.getElementById(
        "cancelStartTriageButton"
    );


const confirmStartTriageButton =
    document.getElementById(
        "confirmStartTriageButton"
    );


/* =========================================================
   Inicialização
   ========================================================= */

async function iniciarPaginaCaso() {

    mostrarCarregamento();


    try {

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


        if (!casoId) {

            window.location.href =
                "./casos.html";

            return;

        }


        await Promise.all([
            carregarCaso(),
            carregarGestores(),
            carregarDocumentos(),
            carregarHistorico()
        ]);


        if (!casoAtual) {

            mostrarErroCarregamento(
                "Caso não encontrado."
            );

            return;

        }


        preencherPagina();


        esconderCarregamento();


        avisarEtapaAtual();

    } catch (erro) {

        console.error(
            "Erro ao iniciar página do caso:",
            erro
        );


        mostrarErroCarregamento(
            "Não foi possível carregar o caso."
        );

    }

}


/* =========================================================
   Carregamento visual
   ========================================================= */

function mostrarCarregamento() {

    if (
        casePageLoading
    ) {

        casePageLoading.hidden =
            false;

    }


    if (
        casePageContent
    ) {

        casePageContent.hidden =
            true;

    }

}


function esconderCarregamento() {

    if (
        casePageLoading
    ) {

        casePageLoading.hidden =
            true;

    }


    if (
        casePageContent
    ) {

        casePageContent.hidden =
            false;

    }

}


function mostrarErroCarregamento(
    mensagem
) {

    if (
        casePageContent
    ) {

        casePageContent.hidden =
            true;

    }


    if (!casePageLoading) {

        return;

    }


    casePageLoading.hidden =
        false;


    casePageLoading.innerHTML =
        `
            <span>
                ${escaparHtml(
                    mensagem
                )}
            </span>
        `;

}


/* =========================================================
   Perfil
   ========================================================= */

function preencherPerfil() {

    if (!usuarioAtual ||
        !perfilAtual
    ) {

        return;

    }


    const nome =
        perfilAtual.nome ||
        usuarioAtual.email ||
        "Gestão";


    if (
        managementProfileName
    ) {

        managementProfileName.textContent =
            nome;

    }


    if (
        managementProfileRole
    ) {

        managementProfileRole.textContent =
            perfilAtual.cargo ||
            "Gestão";

    }


    if (
        managementProfileAvatar
    ) {

        managementProfileAvatar.textContent =
            String(
                nome
            )
            .charAt(0)
            .toUpperCase();

    }

}


/* =========================================================
   Buscar caso
   ========================================================= */

async function carregarCaso() {

    const resultado =
        await window.pecSupabase
        .from(
            "casos"
        )
        .select(
            `
                id,
                numero_caso,
                data_abertura,
                unidade_escolar,
                responsavel_id,
                status,
                etapa_atual,
                nivel_atencao,
                proxima_acao,
                prazo_proxima_acao,

                responsavel:profiles (
                    id,
                    nome,
                    cargo,
                    nivel_acesso
                ),

                denuncias (
                    id,
                    origem_informacao,
                    data_recebimento,
                    horario_recebimento,
                    quem_recebeu,
                    quem_comunicou,
                    estudantes_envolvidos,
                    descricao_inicial,
                    ambiente,
                    tipo_ambiente,
                    existencia_evidencias_iniciais,
                    indicacao_risco_imediato,
                    data_ocorrencia,
                    horario_ocorrencia,
                    horario_ocorrencia_aproximado
                ),

                caso_participantes (
                    id,
                    papel,
                    tipo_participante,
                    nome_externo,
                    funcao_externa,

                    alunos (
                        id,
                        nome,
                        serie,
                        turma,
                        periodo
                    ),

                    usuario:profiles (
                        id,
                        nome,
                        cargo
                    ),

                    funcionarios (
                        id,
                        nome,
                        funcao
                    )
                )
            `
        )
        .eq(
            "id",
            casoId
        )
        .single();


    if (
        resultado.error
    ) {

        console.error(
            "Erro ao carregar caso:",
            resultado.error
        );


        casoAtual =
            null;


        return;

    }


    casoAtual =
        resultado.data;

}


/* =========================================================
   Buscar gestores
   ========================================================= */

async function carregarGestores() {

    const resultado =
        await window.pecSupabase
        .from(
            "profiles"
        )
        .select(
            `
                id,
                nome,
                cargo,
                nivel_acesso
            `
        )
        .in(
            "nivel_acesso", [
                "gestao",
                "administrador"
            ]
        )
        .order(
            "nome", {
                ascending: true
            }
        );


    if (
        resultado.error
    ) {

        console.error(
            "Erro ao carregar gestores:",
            resultado.error
        );


        gestoresDisponiveis = [];


        return;

    }


    gestoresDisponiveis =
        resultado.data || [];

}


/* =========================================================
   Buscar documentos
   ========================================================= */

async function carregarDocumentos() {

    const resultado =
        await window.pecSupabase
        .from(
            "documentos"
        )
        .select(
            `
                id,
                caso_id,
                etapa,
                nome_arquivo,
                storage_path,
                uploaded_by,
                created_at,
                removido_em
            `
        )
        .eq(
            "caso_id",
            casoId
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


    if (
        resultado.error
    ) {

        console.error(
            "Erro ao carregar documentos:",
            resultado.error
        );


        documentosCaso = [];


        return;

    }


    documentosCaso =
        resultado.data || [];

}


/* =========================================================
   Buscar histórico
   ========================================================= */

async function carregarHistorico() {

    const resultado =
        await window.pecSupabase
        .from(
            "caso_historico"
        )
        .select(
            `
                id,
                caso_id,
                tipo_evento,
                titulo,
                descricao,
                etapa,
                usuario_id,
                usuario_nome,
                referencia_id,
                created_at
            `
        )
        .eq(
            "caso_id",
            casoId
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


        historicoCaso = [];


        return;

    }


    historicoCaso =
        resultado.data || [];

}


/* =========================================================
   Preencher página
   ========================================================= */

function preencherPagina() {

    preencherCabecalho();

    preencherFluxo();

    preencherRegistroInicial();

    preencherDocumentosIniciais();

    preencherHistorico();

    preencherGestoresInicioTriagem();

    mostrarEtapaAtual();

}


/* =========================================================
   Cabeçalho
   ========================================================= */

function preencherCabecalho() {

    if (!casoAtual) {

        return;

    }


    if (
        caseNumber
    ) {

        caseNumber.textContent =
            casoAtual.numero_caso ||
            "Caso";

    }


    if (
        caseStageBadge
    ) {

        caseStageBadge.textContent =
            formatarEtapa(
                casoAtual.etapa_atual
            );

    }


    preencherBadgeAtencao();


    if (
        caseOpeningInfo
    ) {

        caseOpeningInfo.textContent =
            montarInformacaoAbertura();

    }


    const denuncia =
        obterDenuncia();


    if (
        caseInitialRiskAlert
    ) {

        caseInitialRiskAlert.hidden = !(
            denuncia &&
            denuncia.indicacao_risco_imediato ===
            true
        );

    }

}


/* =========================================================
   Informações de abertura
   ========================================================= */

function montarInformacaoAbertura() {

    if (!casoAtual) {

        return "";

    }


    const partes = [];


    if (
        casoAtual.data_abertura
    ) {

        partes.push(
            "Aberto em " +
            formatarDataHora(
                casoAtual.data_abertura
            )
        );

    }


    if (
        casoAtual.unidade_escolar
    ) {

        partes.push(
            casoAtual.unidade_escolar
        );

    }


    if (
        casoAtual.status
    ) {

        partes.push(
            casoAtual.status
        );

    }


    return partes.join(
        " • "
    );

}


/* =========================================================
   Badge de atenção
   ========================================================= */

function preencherBadgeAtencao() {

    if (!caseAttentionBadge ||
        !casoAtual
    ) {

        return;

    }


    const denuncia =
        obterDenuncia();


    let texto =
        "";


    let urgente =
        false;


    if (
        casoAtual.nivel_atencao
    ) {

        texto =
            casoAtual.nivel_atencao;


        urgente =
            casoAtual.nivel_atencao ===
            "Urgente";

    } else if (
        denuncia &&
        denuncia.indicacao_risco_imediato ===
        true
    ) {

        texto =
            "Risco imediato";


        urgente =
            true;

    }


    caseAttentionBadge.hidden = !texto;


    if (!texto) {

        return;

    }


    caseAttentionBadge.textContent =
        texto;


    caseAttentionBadge.classList.toggle(
        "urgent",
        urgente
    );

}


/* =========================================================
   Fluxo
   ========================================================= */

function preencherFluxo() {

    if (!casoAtual) {

        return;

    }


    const ordemEtapas = [
        "denuncia",
        "triagem",
        "levantamento",
        "analise",
        "classificacao",
        "intervencao",
        "monitoramento",
        "reavaliacao",
        "encerramento"
    ];


    const indiceAtual =
        ordemEtapas.indexOf(
            casoAtual.etapa_atual
        );


    const passos =
        document.querySelectorAll(
            ".case-flow-step"
        );


    passos.forEach(
        function(
            passo
        ) {

            const etapa =
                passo.dataset.stage;


            const indice =
                ordemEtapas.indexOf(
                    etapa
                );


            passo.classList.remove(
                "active",
                "completed"
            );


            if (
                indiceAtual >= 0 &&
                indice < indiceAtual
            ) {

                passo.classList.add(
                    "completed"
                );

            }


            if (
                indice === indiceAtual
            ) {

                passo.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   Mostrar etapa atual
   ========================================================= */

function mostrarEtapaAtual() {

    if (!casoAtual) {

        return;

    }


    if (
        caseInitialStage
    ) {

        caseInitialStage.hidden =
            casoAtual.etapa_atual !==
            "denuncia";

    }


    if (
        triageStage
    ) {

        triageStage.hidden =
            casoAtual.etapa_atual !==
            "triagem";

    }

    if (
        levantamentoStage
    ) {

        levantamentoStage.hidden =
            casoAtual.etapa_atual !==
            "levantamento";

    }

}


/* =========================================================
   Registro inicial
   ========================================================= */

function preencherRegistroInicial() {

    const denuncia =
        obterDenuncia();


    if (!denuncia) {

        return;

    }


    if (
        caseOccurrenceDate
    ) {

        caseOccurrenceDate.textContent =
            formatarOcorrencia(
                denuncia
            );

    }


    if (
        caseEnvironment
    ) {

        caseEnvironment.textContent =
            denuncia.ambiente ||
            "Não informado";

    }


    if (
        caseEnvironmentType
    ) {

        caseEnvironmentType.textContent =
            denuncia.tipo_ambiente ||
            "Não informado";

    }


    if (
        caseOrigin
    ) {

        caseOrigin.textContent =
            denuncia.origem_informacao ||
            "Não informada";

    }


    if (
        caseCommunicator
    ) {

        caseCommunicator.textContent =
            denuncia.quem_comunicou ||
            "Não informado";

    }


    if (
        caseInitialEvidence
    ) {

        caseInitialEvidence.textContent =
            denuncia.existencia_evidencias_iniciais ===
            true ?
            "Sim" :
            "Não";

    }


    if (
        caseInitialReport
    ) {

        caseInitialReport.textContent =
            denuncia.descricao_inicial ||
            "Nenhum relato inicial informado.";

    }


    preencherParticipantes();

}


/* =========================================================
   Participantes
   ========================================================= */

function preencherParticipantes() {

    if (!caseParticipants) {

        return;

    }


    const participantes =
        obterParticipantes();


    if (
        participantes.length ===
        0
    ) {

        caseParticipants.innerHTML =
            `
                <div class="case-empty-state">
                    Nenhum participante encontrado.
                </div>
            `;


        return;

    }


    caseParticipants.innerHTML =
        participantes
        .map(
            function(
                participante
            ) {

                const dados =
                    obterDadosParticipante(
                        participante
                    );


                return `
                    <article class="case-participant">

                        <span class="case-participant-role">
                            ${escaparHtml(
                                formatarPapel(
                                    participante.papel
                                )
                            )}
                        </span>

                        <strong
                            title="${escaparHtml(
                                dados.nome
                            )}"
                        >
                            ${escaparHtml(
                                dados.nome
                            )}
                        </strong>

                        <span>
                            ${escaparHtml(
                                dados.descricao
                            )}
                        </span>

                    </article>
                `;

            }
        )
        .join("");

}


/* =========================================================
   Dados do participante
   ========================================================= */

function obterDadosParticipante(
    participante
) {

    const aluno =
        obterRelacaoUnica(
            participante.alunos
        );


    if (
        aluno
    ) {

        const detalhes = [
                aluno.serie,
                aluno.turma,
                aluno.periodo
            ]
            .filter(
                function(
                    item
                ) {

                    return (
                        item &&
                        String(
                            item
                        )
                        .trim()
                    );

                }
            )
            .join(
                " • "
            );


        return {

            nome: aluno.nome ||
                "Estudante",

            descricao: detalhes ||
                "Estudante"

        };

    }


    const usuario =
        obterRelacaoUnica(
            participante.usuario
        );


    if (
        usuario
    ) {

        return {

            nome: usuario.nome ||
                "Usuário",

            descricao: usuario.cargo ||
                "Equipe escolar"

        };

    }


    const funcionario =
        obterRelacaoUnica(
            participante.funcionarios
        );


    if (
        funcionario
    ) {

        return {

            nome: funcionario.nome ||
                "Profissional",

            descricao: funcionario.funcao ||
                "Profissional da escola"

        };

    }


    return {

        nome: participante.nome_externo ||
            "Participante externo",

        descricao: participante.funcao_externa ||
            "Pessoa não cadastrada"

    };

}


/* =========================================================
   Documentos iniciais
   ========================================================= */

function preencherDocumentosIniciais() {

    if (!caseInitialDocuments) {

        return;

    }


    const documentosIniciais =
        documentosCaso.filter(
            function(
                documento
            ) {

                return (
                    documento.etapa ===
                    "registro_inicial" ||

                    documento.etapa ===
                    "denuncia"
                );

            }
        );


    if (
        documentosIniciais.length ===
        0
    ) {

        caseInitialDocuments.innerHTML =
            `
                <div class="case-empty-state">
                    Nenhuma evidência inicial anexada.
                </div>
            `;


        return;

    }


    caseInitialDocuments.innerHTML =
        documentosIniciais
        .map(
            function(
                documento
            ) {

                return `
                    <div class="case-document-item">

                        <div class="case-document-info">

                            <strong
                                title="${escaparHtml(
                                    documento.nome_arquivo
                                )}"
                            >
                                ${escaparHtml(
                                    documento.nome_arquivo
                                )}
                            </strong>

                            <span>
                                ${escaparHtml(
                                    formatarDataHora(
                                        documento.created_at
                                    )
                                )}
                            </span>

                        </div>

                        <button
                            type="button"
                            class="case-document-open-button"
                            data-document-id="${escaparHtml(
                                documento.id
                            )}"
                        >
                            Abrir
                        </button>

                    </div>
                `;

            }
        )
        .join("");


    caseInitialDocuments
        .querySelectorAll(
            ".case-document-open-button"
        )
        .forEach(
            function(
                botao
            ) {

                botao.addEventListener(
                    "click",
                    function() {

                        abrirDocumento(
                            botao.dataset.documentId
                        );

                    }
                );

            }
        );

}


/* =========================================================
   Abrir documento privado
   ========================================================= */

async function abrirDocumento(
    documentoId
) {

    const documento =
        documentosCaso.find(
            function(
                item
            ) {

                return (
                    item.id ===
                    documentoId
                );

            }
        );


    if (!documento) {

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
            "Erro ao abrir documento:",
            resultado.error
        );


        alert(
            "Não foi possível abrir o arquivo."
        );


        return;

    }


    if (
        resultado.data &&
        resultado.data.signedUrl
    ) {

        window.open(
            resultado.data.signedUrl,
            "_blank",
            "noopener,noreferrer"
        );

    }

}


/* =========================================================
   Histórico
   ========================================================= */

function preencherHistorico() {

    if (!caseHistory) {

        return;

    }


    if (
        historicoCaso.length ===
        0
    ) {

        caseHistory.innerHTML =
            `
                <div class="case-empty-state">
                    Nenhum histórico registrado.
                </div>
            `;


        return;

    }


    caseHistory.innerHTML =
        historicoCaso
        .map(
            function(
                evento
            ) {

                let descricao =
                    evento.descricao ||
                    "";


                if (
                    evento.usuario_nome
                ) {

                    if (
                        descricao
                    ) {

                        descricao +=
                            " • ";

                    }


                    descricao +=
                        "Por " +
                        evento.usuario_nome;

                }


                return `
                    <article class="case-history-item">

                        <strong>
                            ${escaparHtml(
                                evento.titulo ||
                                "Atualização"
                            )}
                        </strong>

                        ${
                            descricao
                                ?
                                `
                                    <p>
                                        ${escaparHtml(
                                            descricao
                                        )}
                                    </p>
                                `
                                :
                                ""
                        }

                        <time>
                            ${escaparHtml(
                                formatarDataHoraCompleta(
                                    evento.created_at
                                )
                            )}
                        </time>

                    </article>
                `;

            }
        )
        .join("");

}


/* =========================================================
   Gestores para iniciar triagem
   ========================================================= */

function preencherGestoresInicioTriagem() {

    if (
        !startTriageOwnerSelect
    ) {

        return;

    }


    startTriageOwnerSelect.innerHTML =
        `
            <option value="">
                Selecione um gestor
            </option>
        `;


    gestoresDisponiveis.forEach(
        function (
            gestor
        ) {

            const opcao =
                document.createElement(
                    "option"
                );


            opcao.value =
                gestor.id;


            opcao.textContent =
                gestor.nome +
                (
                    gestor.cargo
                        ?
                        " • " +
                        gestor.cargo
                        :
                        ""
                );


            startTriageOwnerSelect.appendChild(
                opcao
            );

        }
    );

}


/* =========================================================
   Modal de início da triagem
   ========================================================= */

function abrirModalInicioTriagem() {

    if (
        !startTriageModal
    ) {

        return;

    }


    if (
        startTriageOwnerSelect
    ) {

        startTriageOwnerSelect.value =
            "";

    }


    startTriageModal.hidden =
        false;


    document.body.style.overflow =
        "hidden";

}


function fecharModalInicioTriagem() {

    if (
        !startTriageModal
    ) {

        return;

    }


    startTriageModal.hidden =
        true;


    document.body.style.overflow =
        "";

}


/* =========================================================
   Iniciar triagem
   ========================================================= */

async function iniciarTriagemDoCaso(
    responsavelId
) {

    if (
        !casoAtual ||
        !responsavelId
    ) {

        return;

    }

    if (
    casoAtual.etapa_atual !==
    "denuncia"
) {

    console.warn(
        "A triagem já foi iniciada para este caso."
    );


    fecharModalInicioTriagem();


    mostrarEtapaAtual();


    avisarEtapaAtual();


    return;

}


    definirCarregamentoInicioTriagem(
        true
    );


    const resultado =
        await window.pecSupabase
        .rpc(
            "iniciar_triagem",
            {

                p_caso_id:
                    casoAtual.id,

                p_responsavel_id:
                    responsavelId

            }
        );


    if (
        resultado.error
    ) {

        console.error(
            "Erro ao iniciar triagem:",
            resultado.error
        );


        definirCarregamentoInicioTriagem(
            false
        );


        alert(
            "Não foi possível iniciar a triagem."
        );


        return;

    }


    fecharModalInicioTriagem();


    await atualizarCaso();


    definirCarregamentoInicioTriagem(
        false
    );

}


/* =========================================================
   Loading - início da triagem
   ========================================================= */

function definirCarregamentoInicioTriagem(
    carregando
) {

    if (
        takeTriageButton
    ) {

        takeTriageButton.disabled =
            carregando;


        takeTriageButton.textContent =
            carregando
                ?
                "Iniciando..."
                :
                "Eu vou assumir este caso";

    }


    if (
        confirmStartTriageButton
    ) {

        confirmStartTriageButton.disabled =
            carregando;


        confirmStartTriageButton.textContent =
            carregando
                ?
                "Iniciando..."
                :
                "Iniciar triagem";

    }


    if (
        cancelStartTriageButton
    ) {

        cancelStartTriageButton.disabled =
            carregando;

    }


    if (
        closeStartTriageModalButton
    ) {

        closeStartTriageModalButton.disabled =
            carregando;

    }

}


/* =========================================================
   Atualizar caso
   ========================================================= */

async function atualizarCaso() {

    await Promise.all([
        carregarCaso(),
        carregarDocumentos(),
        carregarHistorico()
    ]);


    if (
        !casoAtual
    ) {

        return;

    }


    preencherPagina();


    avisarEtapaAtual();

}


/* =========================================================
   Comunicar com o JS da etapa
   ========================================================= */

function avisarEtapaAtual() {

    if (
        !casoAtual
    ) {

        return;

    }


    const contexto = {

        caso:
            casoAtual,

        usuario:
            usuarioAtual,

        perfil:
            perfilAtual,

        gestores:
            gestoresDisponiveis.slice(),

        documentos:
            documentosCaso.slice(),

        historico:
            historicoCaso.slice()

    };


    document.dispatchEvent(
        new CustomEvent(
            "pec:caso-atualizado",
            {
                detail:
                    contexto
            }
        )
    );


    if (
        casoAtual.etapa_atual ===
        "triagem" &&
        window.pecTriagem &&
        typeof window.pecTriagem.iniciar ===
        "function"
    ) {

        window.pecTriagem.iniciar(
            contexto
        );

    }

    if (
    casoAtual.etapa_atual ===
    "levantamento" &&
    window.pecLevantamento &&
    typeof window.pecLevantamento.iniciar ===
    "function"
    ) {

        window.pecLevantamento.iniciar(
            contexto
        );

    }

}


/* =========================================================
   API compartilhada com as etapas
   ========================================================= */

window.pecCasoGestao = {

    obterCaso:
        function () {

            return casoAtual;

        },


    obterUsuario:
        function () {

            return usuarioAtual;

        },


    obterPerfil:
        function () {

            return perfilAtual;

        },


    obterGestores:
        function () {

            return gestoresDisponiveis.slice();

        },


    obterDocumentos:
        function () {

            return documentosCaso.slice();

        },


    obterHistorico:
        function () {

            return historicoCaso.slice();

        },


    recarregar:
        async function () {

            await atualizarCaso();

        },


    abrirDocumento:
        async function (
            documentoId
        ) {

            await abrirDocumento(
                documentoId
            );

        }

};


/* =========================================================
   Eventos - iniciar triagem
   ========================================================= */

if (
    startTriageButton
) {

    startTriageButton.addEventListener(
        "click",
        abrirModalInicioTriagem
    );

}


if (
    closeStartTriageModalButton
) {

    closeStartTriageModalButton.addEventListener(
        "click",
        fecharModalInicioTriagem
    );

}


if (
    cancelStartTriageButton
) {

    cancelStartTriageButton.addEventListener(
        "click",
        fecharModalInicioTriagem
    );

}


if (
    startTriageModal
) {

    startTriageModal.addEventListener(
        "click",
        function (
            event
        ) {

            if (
                event.target ===
                startTriageModal
            ) {

                fecharModalInicioTriagem();

            }

        }
    );

}


/* =========================================================
   Assumir pessoalmente
   ========================================================= */

if (
    takeTriageButton
) {

    takeTriageButton.addEventListener(
        "click",
        async function () {

            if (
                !usuarioAtual
            ) {

                return;

            }


            await iniciarTriagemDoCaso(
                usuarioAtual.id
            );

        }
    );

}


/* =========================================================
   Designar outro gestor
   ========================================================= */

if (
    confirmStartTriageButton
) {

    confirmStartTriageButton.addEventListener(
        "click",
        async function () {

            if (
                !startTriageOwnerSelect ||
                !startTriageOwnerSelect.value
            ) {

                alert(
                    "Selecione o responsável pelo caso."
                );


                return;

            }


                await iniciarTriagemDoCaso(
                    startTriageOwnerSelect.value
                );

        }
    );

}


/* =========================================================
   Escape fecha modal
   ========================================================= */

document.addEventListener(
    "keydown",
    function (
        event
    ) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (
            startTriageModal &&
            startTriageModal.hidden ===
            false
        ) {

            fecharModalInicioTriagem();

        }

    }
);


/* =========================================================
   Logout
   ========================================================= */

if (
    logoutButton
) {

    logoutButton.addEventListener(
        "click",
        async function () {

            logoutButton.disabled =
                true;


            logoutButton.textContent =
                "Saindo...";


            const saiu =
                await window.pecSessao
                .encerrarSessao(
                    "../login.html"
                );


            if (
                !saiu
            ) {

                logoutButton.disabled =
                    false;


                logoutButton.textContent =
                    "Sair";

            }

        }
    );

}


/* =========================================================
   Relações
   ========================================================= */

function obterDenuncia() {

    if (
        !casoAtual ||
        !casoAtual.denuncias
    ) {

        return null;

    }


    return obterRelacaoUnica(
        casoAtual.denuncias
    );

}


function obterParticipantes() {

    if (
        !casoAtual ||
        !Array.isArray(
            casoAtual.caso_participantes
        )
    ) {

        return [];

    }


    return casoAtual.caso_participantes;

}


function obterRelacaoUnica(
    valor
) {

    if (
        !valor
    ) {

        return null;

    }


    if (
        Array.isArray(
            valor
        )
    ) {

        return (
            valor.length > 0
                ?
                valor[0]
                :
                null
        );

    }


    return valor;

}


/* =========================================================
   Formatação - papel
   ========================================================= */

function formatarPapel(
    papel
) {

    const papeis = {

        possivel_vitima:
            "Possível vítima",

        possivel_autor:
            "Possível autor",

        testemunha:
            "Testemunha"

    };


    return (
        papeis[papel] ||
        papel ||
        "Participante"
    );

}


/* =========================================================
   Formatação - etapa
   ========================================================= */

function formatarEtapa(
    etapa
) {

    const etapas = {

        denuncia:
            "Caso",

        triagem:
            "Triagem",

        levantamento:
            "Levantamento",

        analise:
            "Análise",

        classificacao:
            "Classificação",

        intervencao:
            "Intervenção",

        monitoramento:
            "Monitoramento",

        reavaliacao:
            "Reavaliação",

        encerramento:
            "Encerramento"

    };


    return (
        etapas[etapa] ||
        etapa ||
        "Não informada"
    );

}


/* =========================================================
   Formatação - ocorrência
   ========================================================= */

function formatarOcorrencia(
    denuncia
) {

    if (
        !denuncia ||
        !denuncia.data_ocorrencia
    ) {

        return "Não informada";

    }


    let texto =
        formatarDataBanco(
            denuncia.data_ocorrencia
        );


    if (
        denuncia.horario_ocorrencia
    ) {

        texto +=
            " às " +
            String(
                denuncia.horario_ocorrencia
            )
            .slice(
                0,
                5
            );


        if (
            denuncia.horario_ocorrencia_aproximado ===
            true
        ) {

            texto +=
                " aproximadamente";

        }

    }


    return texto;

}


/* =========================================================
   Formatação - data do banco
   ========================================================= */

function formatarDataBanco(
    valor
) {

    if (
        !valor
    ) {

        return "—";

    }


    const partes =
        String(
            valor
        )
        .split(
            "-"
        );


    if (
        partes.length !==
        3
    ) {

        return valor;

    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


/* =========================================================
   Formatação - data
   ========================================================= */

function formatarDataHora(
    valor
) {

    if (
        !valor
    ) {

        return "Não informado";

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

        return "Não informado";

    }


    return data.toLocaleDateString(
        "pt-BR"
    );

}


/* =========================================================
   Formatação - data e hora
   ========================================================= */

function formatarDataHoraCompleta(
    valor
) {

    if (
        !valor
    ) {

        return "";

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

        return "";

    }


    return data.toLocaleString(
        "pt-BR",
        {

            dateStyle:
                "short",

            timeStyle:
                "short"

        }
    );

}


/* =========================================================
   Segurança de HTML
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

iniciarPaginaCaso();