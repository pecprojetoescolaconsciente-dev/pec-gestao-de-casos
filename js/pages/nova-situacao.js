/* =========================================================
   PEC - GESTÃO DE CASOS
   Nova situação
   ========================================================= */

let usuarioAtual = null;

let alunosDisponiveis = [];
let funcionariosDisponiveis = [];

let etapaAtual = 1;

/* =========================================================
   Ditado por voz do relato
   ========================================================= */

let reconhecimentoRelato = null;

let ditadoRelatoAtivo = false;
let ditadoRelatoCancelado = false;

let textoAntesDitado = "";
let textoFinalDitado = "";

let inicioDitadoRelato = null;
let intervaloTempoRelato = null;

const TOTAL_ETAPAS = 4;


/* =========================================================
   Estado
   ========================================================= */

let formulario = {

    origem: "",
    origemLabel: "",
    quemComunicou: "",

    vitimas: [],
    autores: [],
    testemunhas: [],

    dataOcorrencia: "",
    horarioOcorrencia: "",
    horarioAproximado: false,

    descricao: "",
    ambiente: "",
    tipoAmbiente: "",

    evidencias: null,
    risco: null

};


/* =========================================================
   Elementos principais
   ========================================================= */

const situationForm =
    document.getElementById("situationForm");

const formSteps =
    document.querySelectorAll(".form-step");

const stepDots =
    document.querySelectorAll(".step-dot");

const stepText =
    document.getElementById("stepText");

const stepName =
    document.getElementById("stepName");

const progressBar =
    document.getElementById("progressBar");

const previousButton =
    document.getElementById("previousButton");

const nextButton =
    document.getElementById("nextButton");

const submitButton =
    document.getElementById("submitButton");

const submitText =
    document.getElementById("submitText");

const submitSpinner =
    document.getElementById("submitSpinner");

const saveDraftButton =
    document.getElementById("saveDraftButton");

const backDashboard =
    document.getElementById("backDashboard");

const saveStatus =
    document.getElementById("saveStatus");

const formMessage =
    document.getElementById("formMessage");


/* =========================================================
   Etapa 1
   ========================================================= */

const quemComunicouGroup =
    document.getElementById("quemComunicouGroup");

const quemComunicou =
    document.getElementById("quemComunicou");


/* =========================================================
   Etapa 2
   ========================================================= */

const victimSearch =
    document.getElementById("victimSearch");

const victimList =
    document.getElementById("victimList");

const victimCount =
    document.getElementById("victimCount");

const selectedVictims =
    document.getElementById("selectedVictims");

const authorSearch =
    document.getElementById("authorSearch");

const authorList =
    document.getElementById("authorList");

const authorCount =
    document.getElementById("authorCount");

const selectedAuthors =
    document.getElementById("selectedAuthors");

const witnessCount =
    document.getElementById("witnessCount");

const witnessStudentButton =
    document.getElementById("witnessStudentButton");

const witnessStaffButton =
    document.getElementById("witnessStaffButton");

const witnessSelfButton =
    document.getElementById("witnessSelfButton");

const witnessExternalButton =
    document.getElementById("witnessExternalButton");

const witnessStudentPanel =
    document.getElementById("witnessStudentPanel");

const witnessStaffPanel =
    document.getElementById("witnessStaffPanel");

const witnessExternalPanel =
    document.getElementById("witnessExternalPanel");

const witnessStudentSearch =
    document.getElementById("witnessStudentSearch");

const witnessStudentList =
    document.getElementById("witnessStudentList");

const witnessStaffSearch =
    document.getElementById("witnessStaffSearch");

const witnessStaffList =
    document.getElementById("witnessStaffList");

const externalWitnessName =
    document.getElementById("externalWitnessName");

const externalWitnessRole =
    document.getElementById("externalWitnessRole");

const addExternalWitnessButton =
    document.getElementById("addExternalWitnessButton");

const selectedWitnesses =
    document.getElementById("selectedWitnesses");


/* =========================================================
   Etapa 3
   ========================================================= */

const occurrenceDate =
    document.getElementById("occurrenceDate");

const occurrenceTime =
    document.getElementById("occurrenceTime");

const approximateTime =
    document.getElementById("approximateTime");

const descricao =
    document.getElementById("descricao");

const descriptionCounter =
    document.getElementById("descriptionCounter");

const ambiente =
    document.getElementById("ambiente");


/* =========================================================
   Etapa 4
   ========================================================= */

const riskAlert =
    document.getElementById("riskAlert");

const reviewVictims =
    document.getElementById("reviewVictims");

const reviewAuthors =
    document.getElementById("reviewAuthors");

const reviewWitnesses =
    document.getElementById("reviewWitnesses");

const reviewOccurrence =
    document.getElementById("reviewOccurrence");

const reviewOrigin =
    document.getElementById("reviewOrigin");

const reviewEnvironment =
    document.getElementById("reviewEnvironment");

const reviewType =
    document.getElementById("reviewType");

const reviewEvidence =
    document.getElementById("reviewEvidence");

const reviewRisk =
    document.getElementById("reviewRisk");


/* =========================================================
   Sucesso
   ========================================================= */

const successCard =
    document.getElementById("successCard");

const createdCaseNumber =
    document.getElementById("createdCaseNumber");

const successDashboardButton =
    document.getElementById("successDashboardButton");

/* =========================================================
   Elementos - relato por áudio
   ========================================================= */

const startVoiceRecordButton =
    document.getElementById(
        "startVoiceRecordButton"
    );

const voiceRecordingPanel =
    document.getElementById(
        "voiceRecordingPanel"
    );

const voiceRecordingTime =
    document.getElementById(
        "voiceRecordingTime"
    );

const cancelVoiceRecordButton =
    document.getElementById(
        "cancelVoiceRecordButton"
    );

const stopVoiceRecordButton =
    document.getElementById(
        "stopVoiceRecordButton"
    );

const voiceTranscribing =
    document.getElementById(
        "voiceTranscribing"
    );

const voiceReportSupportText =
    document.getElementById(
        "voiceReportSupportText"
    );

/* =========================================================
   Compatibilidade do ditado por voz
   ========================================================= */

function navegadorCompativelComDitado() {

    const SpeechRecognitionAPI =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognitionAPI) {
        return false;
    }


    const userAgent =
        navigator.userAgent;


    /*
     * O Opera pode expor webkitSpeechRecognition,
     * mas em nossos testes não executou o serviço
     * corretamente.
     */

    const opera =
        userAgent.includes(
            "OPR/"
        ) ||
        userAgent.includes(
            "Opera"
        );


    if (opera) {
        return false;
    }


    /*
     * Para o MVP, priorizamos Chrome e Edge,
     * onde já validamos o funcionamento.
     */

    const chrome =
        userAgent.includes(
            "Chrome/"
        );


    const edge =
        userAgent.includes(
            "Edg/"
        );


    return (
        chrome ||
        edge
    );

}


/* =========================================================
   Preparar interface do ditado
   ========================================================= */

function prepararInterfaceDitado() {

    const compativel =
        navegadorCompativelComDitado();


    if (compativel) {

        startVoiceRecordButton.disabled =
            false;


        startVoiceRecordButton.innerHTML =
            `
            <span class="voice-button-icon">
                ●
            </span>

            Gravar relato
            `;


        voiceReportSupportText.textContent =
            "Revise o texto reconhecido antes de continuar. O ditado por voz está disponível neste navegador.";


        return;
    }


    startVoiceRecordButton.disabled =
        true;


    startVoiceRecordButton.innerHTML =
        `
        <span class="voice-button-icon">
            ●
        </span>

        Ditado indisponível
        `;


    voiceReportSupportText.textContent =
        "O ditado por voz está disponível no Google Chrome e Microsoft Edge. Você ainda pode preencher o relato normalmente pelo teclado.";

}


/* =========================================================
   Iniciar ditado do relato
   ========================================================= */

function iniciarGravacaoRelato() {

    const SpeechRecognitionAPI =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognitionAPI) {

        mostrarMensagem(
            "O ditado por voz não está disponível neste navegador. Para este teste, use Google Chrome ou Microsoft Edge."
        );

        return;
    }


    if (ditadoRelatoAtivo) {
        return;
    }


    reconhecimentoRelato =
        new SpeechRecognitionAPI();


    reconhecimentoRelato.lang =
        "pt-BR";


    /*
     * Mantém o reconhecimento funcionando
     * enquanto a pessoa estiver falando.
     */

    reconhecimentoRelato.continuous =
        true;


    /*
     * Faz o texto parcial aparecer
     * antes mesmo da frase terminar.
     */

    reconhecimentoRelato.interimResults =
        true;


    reconhecimentoRelato.maxAlternatives =
        1;


    /*
     * Guardamos o texto que já existia
     * para não apagá-lo.
     */

    textoAntesDitado =
        descricao.value.trimEnd();


    textoFinalDitado =
        "";


    ditadoRelatoAtivo =
        true;


    ditadoRelatoCancelado =
        false;


    /* =====================================================
       Reconhecimento iniciado
       ===================================================== */

    reconhecimentoRelato.onstart =
        function() {

            startVoiceRecordButton.hidden =
                true;


            voiceRecordingPanel.hidden =
                false;


            voiceTranscribing.hidden =
                true;


            voiceRecordingTime.textContent =
                "00:00";


            iniciarContadorDitadoRelato();

        };


    /* =====================================================
       Texto reconhecido
       ===================================================== */

    reconhecimentoRelato.onresult =
        function(
            event
        ) {

            let textoParcial =
                "";


            for (
                let indice =
                    event.resultIndex;

                indice <
                event.results.length;

                indice++
            ) {

                const resultado =
                    event.results[
                        indice
                    ];


                if (!resultado ||
                    !resultado[0]
                ) {
                    continue;
                }


                const trecho =
                    normalizarPontuacaoDitado(
                        String(
                            resultado[0]
                            .transcript ||
                            ""
                        )
                    );


                if (!trecho) {
                    continue;
                }


                if (
                    resultado.isFinal
                ) {

                    const trechoFinal =
                        finalizarPontuacaoDitado(
                            trecho
                        );


                    textoFinalDitado =
                        juntarTrechosDitado(
                            textoFinalDitado,
                            trechoFinal
                        );

                } else {

                    textoParcial =
                        juntarTrechosDitado(
                            textoParcial,
                            trecho
                        );

                }

            }


            atualizarTextoDitadoRelato(
                textoParcial
            );

        };


    /* =====================================================
       Erros do reconhecimento
       ===================================================== */

    reconhecimentoRelato.onerror =
        function(
            event
        ) {

            console.error(
                "Erro no reconhecimento de voz:",
                event.error
            );


            if (
                event.error ===
                "aborted" &&
                ditadoRelatoCancelado
            ) {

                return;

            }


            if (
                event.error ===
                "no-speech"
            ) {

                return;

            }


            ditadoRelatoAtivo =
                false;


            pararContadorDitadoRelato();


            restaurarInterfaceDitadoRelato(
                true
            );


            if (
                event.error ===
                "not-allowed"
            ) {

                mostrarMensagem(
                    "O acesso ao microfone foi bloqueado. Permita o uso do microfone no navegador e tente novamente."
                );

                return;
            }


            mostrarMensagem(
                "O reconhecimento de voz foi interrompido. O texto reconhecido até agora foi preservado."
            );

        };


    /* =====================================================
       Reconhecimento encerrado
       ===================================================== */

    reconhecimentoRelato.onend =
        function() {

            if (
                ditadoRelatoCancelado
            ) {

                finalizarCancelamentoDitado();

                return;
            }


            ditadoRelatoAtivo =
                false;


            pararContadorDitadoRelato();


            finalizarDitadoRelato();

        };


    /* =====================================================
       Iniciar
       ===================================================== */

    try {

        limparMensagem();


        reconhecimentoRelato.start();

    } catch (
        erro
    ) {

        console.error(
            "Erro ao iniciar reconhecimento:",
            erro
        );


        ditadoRelatoAtivo =
            false;


        restaurarInterfaceDitadoRelato(
            true
        );


        mostrarMensagem(
            "Não foi possível iniciar o ditado. Tente novamente."
        );

    }

}


/* =========================================================
   Parar ditado
   ========================================================= */

function pararGravacaoRelato() {

    if (!reconhecimentoRelato ||
        !ditadoRelatoAtivo
    ) {
        return;
    }


    ditadoRelatoAtivo =
        false;


    ditadoRelatoCancelado =
        false;


    pararContadorDitadoRelato();


    stopVoiceRecordButton.disabled =
        true;


    cancelVoiceRecordButton.disabled =
        true;


    try {

        reconhecimentoRelato.stop();

    } catch (
        erro
    ) {

        console.error(
            "Erro ao parar ditado:",
            erro
        );


        finalizarDitadoRelato();

    }

}


/* =========================================================
   Cancelar ditado
   ========================================================= */

function cancelarGravacaoRelato() {

    ditadoRelatoCancelado =
        true;


    ditadoRelatoAtivo =
        false;


    pararContadorDitadoRelato();


    if (
        reconhecimentoRelato
    ) {

        try {

            reconhecimentoRelato.abort();

        } catch (
            erro
        ) {

            console.error(
                "Erro ao cancelar ditado:",
                erro
            );

        }

    }


    finalizarCancelamentoDitado();

}


/* =========================================================
   Atualizar texto enquanto fala
   ========================================================= */

function atualizarTextoDitadoRelato(
    textoParcial
) {

    let textoDitado =
        textoFinalDitado;


    if (
        textoParcial &&
        textoParcial.trim()
    ) {

        textoDitado =
            juntarTrechosDitado(
                textoDitado,
                textoParcial
            );

    }


    let textoCompleto =
        textoAntesDitado;


    if (
        textoDitado.trim()
    ) {

        if (
            textoCompleto.trim()
        ) {

            textoCompleto +=
                "\n\n";

        }


        textoCompleto +=
            textoDitado;

    }


    /*
     * Mantém o limite já existente
     * no textarea.
     */

    if (
        textoCompleto.length >
        3000
    ) {

        textoCompleto =
            textoCompleto.slice(
                0,
                3000
            );

    }


    descricao.value =
        textoCompleto;


    formulario.descricao =
        textoCompleto;


    descriptionCounter.textContent =
        `${textoCompleto.length} / 3000`;


    /*
     * Reaproveita o salvamento automático
     * que o formulário já possui.
     */

    marcarAlteracao();

}


/* =========================================================
   Pontuação do ditado
   ========================================================= */

function normalizarPontuacaoDitado(
    texto
) {

    let resultado =
        String(
            texto ||
            ""
        )
        .trim();


    if (!resultado) {
        return "";
    }


    /*
     * Comandos falados.
     */

    resultado =
        resultado.replace(
            /\s+vírgula\b/gi,
            ","
        );


    resultado =
        resultado.replace(
            /\s+ponto final\b/gi,
            "."
        );


    resultado =
        resultado.replace(
            /\s+ponto\b/gi,
            "."
        );


    resultado =
        resultado.replace(
            /\s+interrogação\b/gi,
            "?"
        );


    resultado =
        resultado.replace(
            /\s+ponto de interrogação\b/gi,
            "?"
        );


    resultado =
        resultado.replace(
            /\s+exclamação\b/gi,
            "!"
        );


    resultado =
        resultado.replace(
            /\s+nova linha\b/gi,
            "\n"
        );


    resultado =
        resultado.replace(
            /\s+novo parágrafo\b/gi,
            "\n\n"
        );


    /*
     * Remove espaços antes da pontuação.
     */

    resultado =
        resultado.replace(
            /\s+([,.!?])/g,
            "$1"
        );


    /*
     * Primeira letra maiúscula.
     */

    resultado =
        resultado.charAt(0)
        .toUpperCase() +
        resultado.slice(1);


    return resultado;

}

function finalizarPontuacaoDitado(
    texto
) {

    let resultado =
        String(
            texto ||
            ""
        )
        .trim();


    if (!resultado) {
        return "";
    }


    const ultimoCaractere =
        resultado.charAt(
            resultado.length - 1
        );


    const jaTemPontuacao =
        ultimoCaractere === "." ||
        ultimoCaractere === "!" ||
        ultimoCaractere === "?";


    if (!jaTemPontuacao) {

        resultado += ".";

    }


    return resultado;

}


/* =========================================================
   Juntar frases reconhecidas
   ========================================================= */

function juntarTrechosDitado(
    atual,
    novoTrecho
) {

    const primeiro =
        String(
            atual ||
            ""
        )
        .trim();


    const segundo =
        String(
            novoTrecho ||
            ""
        )
        .trim();


    if (!primeiro) {
        return segundo;
    }


    if (!segundo) {
        return primeiro;
    }


    return (
        primeiro +
        " " +
        segundo
    );

}


/* =========================================================
   Finalizar ditado
   ========================================================= */

function finalizarDitadoRelato() {

    atualizarTextoDitadoRelato(
        ""
    );


    voiceRecordingPanel.hidden =
        true;


    voiceTranscribing.hidden =
        true;


    startVoiceRecordButton.hidden =
        false;


    startVoiceRecordButton.innerHTML =
        `
        <span class="voice-button-icon">
            ●
        </span>

        Gravar outro trecho
        `;


    stopVoiceRecordButton.disabled =
        false;


    cancelVoiceRecordButton.disabled =
        false;


    voiceRecordingTime.textContent =
        "00:00";


    reconhecimentoRelato =
        null;


    /*
     * Força o mesmo fluxo do textarea:
     * formulário + contador + rascunho.
     */

    descricao.dispatchEvent(
        new Event(
            "input", {
                bubbles: true
            }
        )
    );

}


/* =========================================================
   Finalizar cancelamento
   ========================================================= */

function finalizarCancelamentoDitado() {

    descricao.value =
        textoAntesDitado;


    formulario.descricao =
        textoAntesDitado;


    descriptionCounter.textContent =
        `${textoAntesDitado.length} / 3000`;


    voiceRecordingPanel.hidden =
        true;


    voiceTranscribing.hidden =
        true;


    startVoiceRecordButton.hidden =
        false;


    startVoiceRecordButton.innerHTML =
        `
        <span class="voice-button-icon">
            ●
        </span>

        Gravar relato
        `;


    stopVoiceRecordButton.disabled =
        false;


    cancelVoiceRecordButton.disabled =
        false;


    voiceRecordingTime.textContent =
        "00:00";


    reconhecimentoRelato =
        null;


    ditadoRelatoCancelado =
        false;


    marcarAlteracao();

}


/* =========================================================
   Restaurar interface
   ========================================================= */

function restaurarInterfaceDitadoRelato(
    manterTexto
) {

    voiceRecordingPanel.hidden =
        true;


    voiceTranscribing.hidden =
        true;


    startVoiceRecordButton.hidden =
        false;


    startVoiceRecordButton.innerHTML =
        `
        <span class="voice-button-icon">
            ●
        </span>

        Gravar relato
        `;


    stopVoiceRecordButton.disabled =
        false;


    cancelVoiceRecordButton.disabled =
        false;


    voiceRecordingTime.textContent =
        "00:00";


    if (!manterTexto) {

        descricao.value =
            textoAntesDitado;


        formulario.descricao =
            textoAntesDitado;

    }


    reconhecimentoRelato =
        null;

}


/* =========================================================
   Contador
   ========================================================= */

function iniciarContadorDitadoRelato() {

    inicioDitadoRelato =
        Date.now();


    atualizarContadorDitadoRelato();


    intervaloTempoRelato =
        setInterval(
            atualizarContadorDitadoRelato,
            1000
        );

}


function atualizarContadorDitadoRelato() {

    if (!inicioDitadoRelato) {
        return;
    }


    const totalSegundos =
        Math.floor(
            (
                Date.now() -
                inicioDitadoRelato
            ) /
            1000
        );


    const minutos =
        Math.floor(
            totalSegundos /
            60
        );


    const segundos =
        totalSegundos %
        60;


    voiceRecordingTime.textContent =
        String(
            minutos
        )
        .padStart(
            2,
            "0"
        ) +
        ":" +
        String(
            segundos
        )
        .padStart(
            2,
            "0"
        );

}


function pararContadorDitadoRelato() {

    if (
        intervaloTempoRelato
    ) {

        clearInterval(
            intervaloTempoRelato
        );

    }


    intervaloTempoRelato =
        null;

    inicioDitadoRelato =
        null;

}


/* =========================================================
   Eventos do ditado
   ========================================================= */

startVoiceRecordButton.addEventListener(
    "click",
    iniciarGravacaoRelato
);


stopVoiceRecordButton.addEventListener(
    "click",
    pararGravacaoRelato
);


cancelVoiceRecordButton.addEventListener(
    "click",
    cancelarGravacaoRelato
);

/* =========================================================
   Inicialização
   ========================================================= */

async function iniciarPagina() {

    usuarioAtual =
        await window.pecSessao.exigirSessao(
            "../login.html"
        );


    if (!usuarioAtual) {
        return;
    }


    definirDataHoraPadrao();


    await Promise.all([
        carregarAlunos(),
        carregarFuncionarios(),
        carregarRascunho()
    ]);


    restaurarInterface();

    prepararInterfaceDitado();

    atualizarEtapa();


}


iniciarPagina();


/* =========================================================
   Data e hora padrão
   ========================================================= */

function definirDataHoraPadrao() {

    const agora =
        new Date();


    const ano =
        agora.getFullYear();

    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            agora.getDate()
        ).padStart(2, "0");

    const horas =
        String(
            agora.getHours()
        ).padStart(2, "0");

    const minutos =
        String(
            agora.getMinutes()
        ).padStart(2, "0");


    formulario.dataOcorrencia =
        `${ano}-${mes}-${dia}`;

    formulario.horarioOcorrencia =
        `${horas}:${minutos}`;


    occurrenceDate.max =
        formulario.dataOcorrencia;

}


/* =========================================================
   Alunos
   ========================================================= */

async function carregarAlunos() {

    const resultado =
        await window.pecSupabase
        .from("alunos")
        .select(
            "id, nome, serie, turma, periodo"
        )
        .eq(
            "ativo",
            true
        )
        .order(
            "nome", {
                ascending: true
            }
        );


    if (resultado.error) {

        console.error(
            "Erro ao carregar alunos:",
            resultado.error
        );

        return;
    }


    alunosDisponiveis =
        resultado.data || [];

}


/* =========================================================
   Funcionários
   ========================================================= */

async function carregarFuncionarios() {

    const resultado =
        await window.pecSupabase
        .from("funcionarios")
        .select(
            "id, nome, funcao"
        )
        .eq(
            "ativo",
            true
        )
        .order(
            "nome", {
                ascending: true
            }
        );


    if (resultado.error) {

        console.error(
            "Erro ao carregar profissionais:",
            resultado.error
        );

        return;
    }


    funcionariosDisponiveis =
        resultado.data || [];

}


/* =========================================================
   Salvar rascunho no Supabase
   ========================================================= */

async function salvarRascunhoSupabase() {

    if (!usuarioAtual) {
        return false;
    }


    const resultado =
        await window.pecSupabase
        .from("rascunhos_situacao")
        .upsert({
            usuario_id: usuarioAtual.id,

            dados: formulario
        }, {
            onConflict: "usuario_id"
        });


    if (resultado.error) {

        console.error(
            "Erro ao salvar rascunho:",
            resultado.error
        );


        saveStatus.innerHTML =
            '<span class="save-dot"></span> Erro ao salvar';


        return false;
    }


    saveStatus.innerHTML =
        '<span class="save-dot"></span> Rascunho salvo';


    return true;

}


/* =========================================================
   Carregar rascunho
   ========================================================= */

async function carregarRascunho() {

    const resultado =
        await window.pecSupabase
        .from("rascunhos_situacao")
        .select(
            "dados"
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
        return;
    }


    formulario = {
        ...formulario,
        ...resultado.data.dados
    };


    saveStatus.innerHTML =
        '<span class="save-dot"></span> Rascunho recuperado';

}


/* =========================================================
   Excluir rascunho
   ========================================================= */

async function excluirRascunho() {

    const resultado =
        await window.pecSupabase
        .from("rascunhos_situacao")
        .delete()
        .eq(
            "usuario_id",
            usuarioAtual.id
        );


    if (resultado.error) {

        console.error(
            "Erro ao excluir rascunho:",
            resultado.error
        );

    }

}


/* =========================================================
   Origem
   ========================================================= */

document
    .querySelectorAll(
        'input[name="origem"]'
    )
    .forEach(
        function(input) {

            input.addEventListener(
                "change",
                function() {

                    formulario.origem =
                        input.value;


                    formulario.origemLabel =
                        input.dataset.label ||
                        input.value;


                    const presenciou =
                        input.value ===
                        "Professor";


                    quemComunicouGroup.hidden =
                        presenciou;


                    if (presenciou) {

                        formulario.quemComunicou =
                            "Professor registrante";


                        quemComunicou.value =
                            "";

                    }


                    marcarAlteracao();

                }
            );

        }
    );


quemComunicou.addEventListener(
    "input",
    function() {

        formulario.quemComunicou =
            quemComunicou.value.trim();


        marcarAlteracao();

    }
);


/* =========================================================
   Renderizar estudantes
   ========================================================= */

function renderizarListaEstudantes(
    container,
    filtro,
    tipo
) {

    const termo =
        normalizarTexto(
            filtro
        );


    /*
     * Para possível vítima e possível autor,
     * não mostramos todos os alunos automaticamente.
     * A lista só abre quando houver uma busca.
     */

    if (
        tipo !== "testemunha" &&
        termo.length === 0
    ) {

        container.innerHTML =
            "";

        container.hidden =
            true;

        return;
    }


    const lista =
        alunosDisponiveis.filter(
            function(aluno) {

                const textoBusca =
                    `${aluno.nome} ${aluno.serie} ${aluno.turma} ${aluno.periodo}`;


                return normalizarTexto(
                    textoBusca
                ).includes(
                    termo
                );

            }
        );


    container.hidden =
        false;


    if (lista.length === 0) {

        container.innerHTML =
            `
            <div class="no-results">
                Nenhum estudante encontrado.
            </div>
            `;

        return;
    }


    container.innerHTML =
        lista
        .map(
            function(aluno) {

                const selecionado =
                    estudanteSelecionado(
                        aluno.id,
                        tipo
                    );


                const bloqueado =
                    estudanteBloqueado(
                        aluno.id,
                        tipo
                    );


                const inicial =
                    aluno.nome
                    .charAt(0)
                    .toUpperCase();


                return `
                        <div
                            class="
                                student-card
                                ${selecionado ? "selected" : ""}
                                ${bloqueado ? "unavailable" : ""}
                            "
                            data-id="${aluno.id}"
                        >

                            <div class="student-avatar">
                                ${inicial}
                            </div>


                            <div class="student-info">

                                <strong>
                                    ${escaparHtml(aluno.nome)}
                                </strong>

                                <span>
                                    ${escaparHtml(aluno.serie || "")}
                                    ${aluno.turma ? " • " + escaparHtml(aluno.turma) : ""}
                                    ${aluno.periodo ? " • " + escaparHtml(aluno.periodo) : ""}
                                </span>

                            </div>


                            <div class="student-select-mark">
                                ${bloqueado ? "—" : "✓"}
                            </div>

                        </div>
                    `;

            }
        )
        .join("");


    container
        .querySelectorAll(
            ".student-card"
        )
        .forEach(
            function(card) {

                card.addEventListener(
                    "click",
                    function() {

                        if (
                            card.classList.contains(
                                "unavailable"
                            )
                        ) {
                            return;
                        }


                        alternarEstudante(
                            card.dataset.id,
                            tipo
                        );

                    }
                );

            }
        );

}


/* =========================================================
   Estudante selecionado?
   ========================================================= */

function estudanteSelecionado(
    alunoId,
    tipo
) {

    if (tipo === "vitima") {

        return formulario.vitimas.includes(
            alunoId
        );

    }


    if (tipo === "autor") {

        return formulario.autores.includes(
            alunoId
        );

    }


    if (tipo === "testemunha") {

        return formulario.testemunhas.some(
            function(item) {

                return (
                    item.tipo === "aluno" &&
                    item.aluno_id === alunoId
                );

            }
        );

    }


    return false;

}


/* =========================================================
   Bloquear vítima como autor
   ========================================================= */

function estudanteBloqueado(
    alunoId,
    tipo
) {

    if (tipo === "vitima") {

        return formulario.autores.includes(
            alunoId
        );

    }


    if (tipo === "autor") {

        return formulario.vitimas.includes(
            alunoId
        );

    }


    return false;

}


/* =========================================================
   Alternar estudante
   ========================================================= */

function alternarEstudante(
    alunoId,
    tipo
) {

    if (tipo === "vitima") {

        formulario.vitimas =
            alternarId(
                formulario.vitimas,
                alunoId
            );


        victimSearch.value =
            "";


        victimList.hidden =
            true;

    }


    if (tipo === "autor") {

        formulario.autores =
            alternarId(
                formulario.autores,
                alunoId
            );


        authorSearch.value =
            "";


        authorList.hidden =
            true;

    }


    if (tipo === "testemunha") {

        alternarTestemunhaAluno(
            alunoId
        );


        witnessStudentSearch.value =
            "";


        witnessStudentPanel.hidden =
            true;

    }


    atualizarParticipantes();

    marcarAlteracao();

}


/* =========================================================
   Alternar ID
   ========================================================= */

function alternarId(
    lista,
    id
) {

    if (lista.includes(id)) {

        return lista.filter(
            function(item) {
                return item !== id;
            }
        );

    }


    return [
        ...lista,
        id
    ];

}


/* =========================================================
   Testemunha aluno
   ========================================================= */

function alternarTestemunhaAluno(
    alunoId
) {

    const indice =
        formulario.testemunhas
        .findIndex(
            function(item) {

                return (
                    item.tipo === "aluno" &&
                    item.aluno_id === alunoId
                );

            }
        );


    if (indice >= 0) {

        formulario.testemunhas.splice(
            indice,
            1
        );

        return;
    }


    const aluno =
        alunosDisponiveis.find(
            function(item) {

                return (
                    item.id === alunoId
                );

            }
        );


    if (!aluno) {
        return;
    }


    const informacoes = [
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
        .join(" • ");


    formulario.testemunhas.push({

        tipo: "aluno",

        aluno_id: alunoId,

        nome: aluno.nome,

        descricao: informacoes || "Aluno"

    });

}


/* =========================================================
   Atualizar participantes
   ========================================================= */

/* =========================================================
   Participantes selecionados
   ========================================================= */

function renderizarParticipantesSelecionados(
    container,
    ids,
    tipo
) {

    if (ids.length === 0) {

        container.innerHTML =
            "";

        return;
    }


    container.innerHTML =
        ids
        .map(
            function(id) {

                const aluno =
                    alunosDisponiveis.find(
                        function(item) {

                            return (
                                item.id === id
                            );

                        }
                    );


                if (!aluno) {
                    return "";
                }


                const inicial =
                    aluno.nome
                    .charAt(0)
                    .toUpperCase();


                return `
                        <div
                            class="selected-participant"
                        >

                            <div
                                class="selected-participant-avatar"
                            >
                                ${escaparHtml(inicial)}
                            </div>


                            <div
                                class="selected-participant-info"
                            >

                                <strong
                                    title="${escaparHtml(aluno.nome)}"
                                >
                                    ${escaparHtml(aluno.nome)}
                                </strong>

                                <span>
                                    ${escaparHtml(aluno.serie || "")}
                                    ${aluno.turma ? " • " + escaparHtml(aluno.turma) : ""}
                                    ${aluno.periodo ? " • " + escaparHtml(aluno.periodo) : ""}
                                </span>

                            </div>


                            <button
                                type="button"
                                class="remove-participant"
                                data-id="${aluno.id}"
                                data-type="${tipo}"
                                aria-label="Remover ${escaparHtml(aluno.nome)}"
                            >
                                ×
                            </button>

                        </div>
                    `;

            }
        )
        .join("");


    container
        .querySelectorAll(
            ".remove-participant"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        removerParticipante(
                            button.dataset.id,
                            button.dataset.type
                        );

                    }
                );

            }
        );

}


/* =========================================================
   Remover vítima ou autor
   ========================================================= */

function removerParticipante(
    alunoId,
    tipo
) {

    if (tipo === "vitima") {

        formulario.vitimas =
            formulario.vitimas.filter(
                function(id) {

                    return (
                        id !== alunoId
                    );

                }
            );

    }


    if (tipo === "autor") {

        formulario.autores =
            formulario.autores.filter(
                function(id) {

                    return (
                        id !== alunoId
                    );

                }
            );

    }


    atualizarParticipantes();

    marcarAlteracao();

}


/* =========================================================
   Formatar quantidade selecionada
   ========================================================= */

function formatarQuantidadeSelecionada(
    quantidade
) {

    if (quantidade === 0) {

        return "Nenhum selecionado";

    }


    if (quantidade === 1) {

        return "1 selecionado";

    }


    return `${quantidade} selecionados`;

}

/* =========================================================
   Atualizar participantes
   ========================================================= */

function atualizarParticipantes() {

    victimCount.textContent =
        formatarQuantidadeSelecionada(
            formulario.vitimas.length
        );


    authorCount.textContent =
        formatarQuantidadeSelecionada(
            formulario.autores.length
        );


    witnessCount.textContent =
        formatarQuantidadeSelecionada(
            formulario.testemunhas.length
        );


    /* =====================================================
       Cards das possíveis vítimas selecionadas
       ===================================================== */

    renderizarParticipantesSelecionados(
        selectedVictims,
        formulario.vitimas,
        "vitima"
    );


    /* =====================================================
       Cards dos possíveis autores selecionados
       ===================================================== */

    renderizarParticipantesSelecionados(
        selectedAuthors,
        formulario.autores,
        "autor"
    );


    /* =====================================================
       Resultados da busca de possíveis vítimas
       ===================================================== */

    renderizarListaEstudantes(
        victimList,
        victimSearch.value,
        "vitima"
    );


    /* =====================================================
       Resultados da busca de possíveis autores
       ===================================================== */

    renderizarListaEstudantes(
        authorList,
        authorSearch.value,
        "autor"
    );


    /* =====================================================
       Busca de testemunhas-alunos
       ===================================================== */

    if (!witnessStudentPanel.hidden) {

        renderizarListaEstudantes(
            witnessStudentList,
            witnessStudentSearch.value,
            "testemunha"
        );

    }


    /* =====================================================
       Testemunhas já adicionadas
       ===================================================== */

    renderizarTestemunhasSelecionadas();

}


/* =========================================================
   Pesquisas
   ========================================================= */

victimSearch.addEventListener(
    "input",
    function() {

        renderizarListaEstudantes(
            victimList,
            victimSearch.value,
            "vitima"
        );

    }
);


authorSearch.addEventListener(
    "input",
    function() {

        renderizarListaEstudantes(
            authorList,
            authorSearch.value,
            "autor"
        );

    }
);


witnessStudentSearch.addEventListener(
    "input",
    function() {

        renderizarListaEstudantes(
            witnessStudentList,
            witnessStudentSearch.value,
            "testemunha"
        );

    }
);


/* =========================================================
   Painéis de testemunha
   ========================================================= */

function esconderPaineisTestemunha() {

    witnessStudentPanel.hidden =
        true;

    witnessStaffPanel.hidden =
        true;

    witnessExternalPanel.hidden =
        true;

}


witnessStudentButton.addEventListener(
    "click",
    function() {

        const abrir =
            witnessStudentPanel.hidden;


        esconderPaineisTestemunha();


        witnessStudentPanel.hidden = !abrir;


        if (abrir) {

            renderizarListaEstudantes(
                witnessStudentList,
                "",
                "testemunha"
            );

        }

    }
);


witnessStaffButton.addEventListener(
    "click",
    function() {

        const abrir =
            witnessStaffPanel.hidden;


        esconderPaineisTestemunha();


        witnessStaffPanel.hidden = !abrir;


        if (abrir) {

            renderizarFuncionarios();

        }

    }
);


witnessExternalButton.addEventListener(
    "click",
    function() {

        const abrir =
            witnessExternalPanel.hidden;


        esconderPaineisTestemunha();


        witnessExternalPanel.hidden = !abrir;

    }
);


/* =========================================================
   Eu presenciei
   ========================================================= */

witnessSelfButton.addEventListener(
    "click",
    function() {

        const indice =
            formulario.testemunhas
            .findIndex(
                function(item) {

                    return (
                        item.tipo === "usuario" &&
                        item.usuario_id === usuarioAtual.id
                    );

                }
            );


        if (indice >= 0) {

            formulario.testemunhas.splice(
                indice,
                1
            );

        } else {

            formulario.testemunhas.push({
                tipo: "usuario",
                usuario_id: usuarioAtual.id,
                nome: "Você",
                descricao: "Pessoa que está registrando"
            });

        }


        atualizarParticipantes();

        marcarAlteracao();

    }
);


/* =========================================================
   Funcionários
   ========================================================= */

function renderizarFuncionarios(
    filtro = ""
) {

    const termo =
        normalizarTexto(
            filtro
        );


    const lista =
        funcionariosDisponiveis.filter(
            function(item) {

                const textoBusca =
                    `${item.nome} ${item.funcao || ""}`;


                return normalizarTexto(
                    textoBusca
                ).includes(
                    termo
                );

            }
        );


    if (lista.length === 0) {

        witnessStaffList.innerHTML =
            `
            <div class="no-results">
                Nenhum profissional encontrado.
            </div>
            `;

        return;
    }


    witnessStaffList.innerHTML =
        lista
        .map(
            function(item) {

                const selecionado =
                    formulario.testemunhas
                    .some(
                        function(testemunha) {

                            return (
                                testemunha.tipo === "funcionario" &&
                                testemunha.funcionario_id === item.id
                            );

                        }
                    );


                return `
                        <div
                            class="student-card ${selecionado ? "selected" : ""}"
                            data-id="${item.id}"
                        >

                            <div class="student-avatar">
                                ${escaparHtml(item.nome.charAt(0).toUpperCase())}
                            </div>

                            <div class="student-info">

                                <strong>
                                    ${escaparHtml(item.nome)}
                                </strong>

                                <span>
                                    ${escaparHtml(item.funcao || "Profissional da escola")}
                                </span>

                            </div>

                            <div class="student-select-mark">
                                ✓
                            </div>

                        </div>
                    `;

            }
        )
        .join("");


    witnessStaffList
        .querySelectorAll(
            ".student-card"
        )
        .forEach(
            function(card) {

                card.addEventListener(
                    "click",
                    function() {

                        alternarFuncionario(
                            card.dataset.id
                        );

                    }
                );

            }
        );

}


/* =========================================================
   Pesquisa de funcionários
   ========================================================= */

witnessStaffSearch.addEventListener(
    "input",
    function() {

        renderizarFuncionarios(
            witnessStaffSearch.value
        );

    }
);


/* =========================================================
   Alternar funcionário
   ========================================================= */

function alternarFuncionario(
    funcionarioId
) {

    const indice =
        formulario.testemunhas
        .findIndex(
            function(item) {

                return (
                    item.tipo === "funcionario" &&
                    item.funcionario_id === funcionarioId
                );

            }
        );


    if (indice >= 0) {

        formulario.testemunhas.splice(
            indice,
            1
        );

    } else {

        const funcionario =
            funcionariosDisponiveis.find(
                function(item) {

                    return (
                        item.id === funcionarioId
                    );

                }
            );


        let nomeFuncionario =
            "Profissional";


        let funcaoFuncionario =
            "Profissional da escola";


        if (
            funcionario &&
            funcionario.nome
        ) {

            nomeFuncionario =
                funcionario.nome;

        }


        if (
            funcionario &&
            funcionario.funcao
        ) {

            funcaoFuncionario =
                funcionario.funcao;

        }


        formulario.testemunhas.push({
            tipo: "funcionario",
            funcionario_id: funcionarioId,
            nome: nomeFuncionario,
            descricao: funcaoFuncionario
        });

    }


    witnessStaffSearch.value =
        "";


    witnessStaffPanel.hidden =
        true;


    atualizarParticipantes();

    marcarAlteracao();

}


/* =========================================================
   Testemunha externa
   ========================================================= */

addExternalWitnessButton.addEventListener(
    "click",
    function() {

        const nome =
            externalWitnessName
            .value
            .trim();


        const funcao =
            externalWitnessRole
            .value
            .trim();


        if (!nome) {

            mostrarMensagem(
                "Informe o nome da testemunha."
            );

            return;
        }


        formulario.testemunhas.push({
            tipo: "externo",
            nome_externo: nome,
            funcao_externa: funcao,
            nome: nome,
            descricao: funcao ||
                "Pessoa não cadastrada"
        });


        externalWitnessName.value =
            "";

        externalWitnessRole.value =
            "";


        witnessExternalPanel.hidden =
            true;


        atualizarParticipantes();

        marcarAlteracao();

        limparMensagem();

    }
);


/* =========================================================
   Renderizar testemunhas selecionadas
   ========================================================= */

function renderizarTestemunhasSelecionadas() {

    if (
        formulario.testemunhas.length === 0
    ) {

        selectedWitnesses.innerHTML =
            `
            <div class="witness-empty">
                Nenhuma testemunha adicionada.
            </div>
            `;

        return;
    }


    selectedWitnesses.innerHTML =
        formulario.testemunhas
        .map(
            function(item, index) {

                return `
                        <div class="selected-witness">

                            <div class="selected-witness-info">

                                <strong>
                                    ${escaparHtml(item.nome || "Testemunha")}
                                </strong>

                                <span>
                                    ${escaparHtml(item.descricao || "")}
                                </span>

                            </div>

                            <button
                                type="button"
                                class="remove-witness"
                                data-index="${index}"
                                aria-label="Remover testemunha"
                            >
                                ×
                            </button>

                        </div>
                    `;

            }
        )
        .join("");


    selectedWitnesses
        .querySelectorAll(
            ".remove-witness"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        formulario.testemunhas.splice(
                            Number(
                                button.dataset.index
                            ),
                            1
                        );


                        atualizarParticipantes();

                        marcarAlteracao();

                    }
                );

            }
        );

}


/* =========================================================
   Data
   ========================================================= */

occurrenceDate.addEventListener(
    "change",
    function() {

        formulario.dataOcorrencia =
            occurrenceDate.value;

        marcarAlteracao();

    }
);


occurrenceTime.addEventListener(
    "change",
    function() {

        formulario.horarioOcorrencia =
            occurrenceTime.value;

        marcarAlteracao();

    }
);


approximateTime.addEventListener(
    "change",
    function() {

        formulario.horarioAproximado =
            approximateTime.checked;

        marcarAlteracao();

    }
);


/* =========================================================
   Descrição
   ========================================================= */

descricao.addEventListener(
    "input",
    function() {

        formulario.descricao =
            descricao.value;


        descriptionCounter.textContent =
            `${descricao.value.length} / 3000`;


        marcarAlteracao();

    }
);


/* =========================================================
   Ambiente
   ========================================================= */

ambiente.addEventListener(
    "change",
    function() {

        formulario.ambiente =
            ambiente.value;

        marcarAlteracao();

    }
);


/* =========================================================
   Modalidade
   ========================================================= */

document
    .querySelectorAll(
        'input[name="tipoAmbiente"]'
    )
    .forEach(
        function(input) {

            input.addEventListener(
                "change",
                function() {

                    formulario.tipoAmbiente =
                        input.value;

                    marcarAlteracao();

                }
            );

        }
    );


/* =========================================================
   Evidências
   ========================================================= */

document
    .querySelectorAll(
        'input[name="evidencias"]'
    )
    .forEach(
        function(input) {

            input.addEventListener(
                "change",
                function() {

                    formulario.evidencias =
                        input.value ===
                        "true";


                    marcarAlteracao();

                    atualizarRevisao();

                    atualizarEstadoEnvio();

                }
            );

        }
    );


/* =========================================================
   Risco
   ========================================================= */

document
    .querySelectorAll(
        'input[name="risco"]'
    )
    .forEach(
        function(input) {

            input.addEventListener(
                "change",
                function() {

                    formulario.risco =
                        input.value ===
                        "true";


                    riskAlert.hidden = !formulario.risco;


                    marcarAlteracao();

                    atualizarRevisao();

                    atualizarEstadoEnvio();

                }
            );

        }
    );


/* =========================================================
   Alterações e salvamento automático
   ========================================================= */

let timerRascunho =
    null;


function marcarAlteracao() {

    saveStatus.innerHTML =
        '<span class="save-dot"></span> Alterações não salvas';


    clearTimeout(
        timerRascunho
    );


    timerRascunho =
        setTimeout(
            salvarRascunhoSupabase,
            1200
        );

}


/* =========================================================
   Restaurar interface
   ========================================================= */

function restaurarInterface() {

    if (formulario.origem) {

        const origem =
            document.querySelector(
                `input[name="origem"][value="${CSS.escape(formulario.origem)}"]`
            );


        if (origem) {
            origem.checked = true;
        }

    }


    quemComunicouGroup.hidden =
        formulario.origem ===
        "Professor";


    if (
        formulario.quemComunicou &&
        formulario.quemComunicou !==
        "Professor registrante"
    ) {

        quemComunicou.value =
            formulario.quemComunicou;

    }


    occurrenceDate.value =
        formulario.dataOcorrencia ||
        "";


    occurrenceTime.value =
        formulario.horarioOcorrencia ||
        "";


    approximateTime.checked =
        formulario.horarioAproximado ===
        true;


    descricao.value =
        formulario.descricao ||
        "";


    descriptionCounter.textContent =
        `${descricao.value.length} / 3000`;


    ambiente.value =
        formulario.ambiente ||
        "";


    restaurarRadio(
        "tipoAmbiente",
        formulario.tipoAmbiente
    );


    restaurarRadioBooleano(
        "evidencias",
        formulario.evidencias
    );


    restaurarRadioBooleano(
        "risco",
        formulario.risco
    );


    riskAlert.hidden =
        formulario.risco !==
        true;


    atualizarParticipantes();

}


/* =========================================================
   Restaurar radios
   ========================================================= */

function restaurarRadio(
    nome,
    valor
) {

    if (!valor) {
        return;
    }


    const input =
        document.querySelector(
            `input[name="${nome}"][value="${CSS.escape(valor)}"]`
        );


    if (input) {
        input.checked = true;
    }

}


function restaurarRadioBooleano(
    nome,
    valor
) {

    if (
        valor !== true &&
        valor !== false
    ) {
        return;
    }


    const input =
        document.querySelector(
            `input[name="${nome}"][value="${String(valor)}"]`
        );


    if (input) {
        input.checked = true;
    }

}


/* =========================================================
   Navegação
   ========================================================= */

const nomesEtapas = {

    1: "Como você soube?",

    2: "Quem está envolvido?",

    3: "O que aconteceu e quando?",

    4: "Segurança e revisão"

};


function atualizarEtapa() {

    formSteps.forEach(
        function(step) {

            step.classList.toggle(
                "active",
                Number(
                    step.dataset.step
                ) ===
                etapaAtual
            );

        }
    );


    stepDots.forEach(
        function(dot, index) {

            dot.classList.toggle(
                "active",
                index < etapaAtual
            );

        }
    );


    stepText.textContent =
        `Etapa ${etapaAtual} de ${TOTAL_ETAPAS}`;


    stepName.textContent =
        nomesEtapas[
            etapaAtual
        ];


    progressBar.style.width =
        `${(etapaAtual / TOTAL_ETAPAS) * 100}%`;


    previousButton.hidden =
        etapaAtual === 1;


    nextButton.hidden =
        etapaAtual ===
        TOTAL_ETAPAS;


    if (
        etapaAtual ===
        TOTAL_ETAPAS
    ) {

        atualizarRevisao();

        atualizarEstadoEnvio();

    } else {

        submitButton.hidden =
            true;

    }


    limparMensagem();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   Continuar
   ========================================================= */

nextButton.addEventListener(
    "click",
    function() {

        if (
            etapaAtual >=
            TOTAL_ETAPAS
        ) {
            return;
        }


        if (!validarEtapa(
                etapaAtual
            )) {
            return;
        }


        etapaAtual++;


        atualizarEtapa();

    }
);


/* =========================================================
   Voltar
   ========================================================= */

previousButton.addEventListener(
    "click",
    function() {

        if (
            etapaAtual <= 1
        ) {
            return;
        }


        etapaAtual--;


        atualizarEtapa();

    }
);


/* =========================================================
   Validação
   ========================================================= */

function validarEtapa(
    etapa
) {

    limparMensagem();


    if (
        etapa === 1 &&
        !formulario.origem
    ) {

        mostrarMensagem(
            "Escolha como a situação chegou até você."
        );

        return false;
    }


    if (etapa === 2) {

        if (
            formulario.vitimas.length === 0
        ) {

            mostrarMensagem(
                "Selecione pelo menos uma possível vítima."
            );

            return false;
        }


        if (
            formulario.autores.length === 0
        ) {

            mostrarMensagem(
                "Selecione pelo menos um possível autor."
            );

            return false;
        }

    }


    if (etapa === 3) {

        if (!formulario.dataOcorrencia) {

            mostrarMensagem(
                "Informe a data da situação."
            );

            return false;
        }


        if (
            formulario.dataOcorrencia >
            dataHoje()
        ) {

            mostrarMensagem(
                "A data da situação não pode estar no futuro."
            );

            return false;
        }


        if (
            formulario.descricao
            .trim()
            .length < 10
        ) {

            mostrarMensagem(
                "Conte um pouco mais sobre o que aconteceu."
            );

            return false;
        }


        if (!formulario.ambiente) {

            mostrarMensagem(
                "Informe onde a situação aconteceu."
            );

            return false;
        }


        if (!formulario.tipoAmbiente) {

            mostrarMensagem(
                "Informe se ocorreu presencialmente ou no ambiente digital."
            );

            return false;
        }

    }


    if (etapa === 4) {

        if (
            formulario.evidencias ===
            null
        ) {

            mostrarMensagem(
                "Informe se existem evidências iniciais."
            );

            return false;
        }


        if (
            formulario.risco ===
            null
        ) {

            mostrarMensagem(
                "Informe se existe indicação de risco imediato."
            );

            return false;
        }

    }


    return true;

}


/* =========================================================
   Formulário completo
   ========================================================= */

function formularioCompleto() {

    return (
        formulario.origem &&
        formulario.vitimas.length > 0 &&
        formulario.autores.length > 0 &&
        formulario.dataOcorrencia &&
        formulario.descricao.trim().length >= 10 &&
        formulario.ambiente &&
        formulario.tipoAmbiente &&
        formulario.evidencias !== null &&
        formulario.risco !== null
    );

}


/* =========================================================
   Estado do botão enviar
   ========================================================= */

function atualizarEstadoEnvio() {

    submitButton.hidden = !formularioCompleto();

}


/* =========================================================
   Revisão
   ========================================================= */

function atualizarRevisao() {

    reviewVictims.textContent =
        nomesEstudantes(
            formulario.vitimas
        ) || "—";


    reviewAuthors.textContent =
        nomesEstudantes(
            formulario.autores
        ) || "—";


    if (
        formulario.testemunhas.length > 0
    ) {

        reviewWitnesses.textContent =
            formulario.testemunhas
            .map(
                function(item) {
                    return item.nome;
                }
            )
            .join(", ");

    } else {

        reviewWitnesses.textContent =
            "Nenhuma informada";

    }


    reviewOccurrence.textContent =
        formatarOcorrencia();


    reviewOrigin.textContent =
        formulario.origemLabel ||
        formulario.origem ||
        "—";


    reviewEnvironment.textContent =
        formulario.ambiente ||
        "—";


    reviewType.textContent =
        formulario.tipoAmbiente ||
        "—";

    /* =====================================================
   Evidências
   ===================================================== */

    if (
        formulario.evidencias === true
    ) {

        reviewEvidence.textContent =
            "Sim • poderão ser anexadas após o registro";

    } else if (
        formulario.evidencias === false
    ) {

        reviewEvidence.textContent =
            "Não";

    } else {

        reviewEvidence.textContent =
            "—";

    }


    /* =====================================================
       Risco imediato
       ===================================================== */

    if (
        formulario.risco === true
    ) {

        reviewRisk.textContent =
            "Sim • Atenção imediata";

    } else if (
        formulario.risco === false
    ) {

        reviewRisk.textContent =
            "Não";

    } else {

        reviewRisk.textContent =
            "—";

    }

}


/* =========================================================
   Nomes de estudantes
   ========================================================= */

function nomesEstudantes(
    ids
) {

    const nomes =
        ids.map(
            function(id) {

                const aluno =
                    alunosDisponiveis.find(
                        function(item) {
                            return item.id === id;
                        }
                    );


                if (
                    aluno &&
                    aluno.nome
                ) {

                    return aluno.nome;

                }


                return null;

            }
        );


    return nomes
        .filter(
            function(nome) {
                return nome !== null;
            }
        )
        .join(", ");

}


/* =========================================================
   Ocorrência formatada
   ========================================================= */

function formatarOcorrencia() {

    if (!formulario.dataOcorrencia) {
        return "—";
    }


    const partes =
        formulario.dataOcorrencia
        .split("-");


    const ano =
        partes[0];

    const mes =
        partes[1];

    const dia =
        partes[2];


    let texto =
        `${dia}/${mes}/${ano}`;


    if (
        formulario.horarioOcorrencia
    ) {

        texto +=
            ` às ${formulario.horarioOcorrencia}`;


        if (
            formulario.horarioAproximado
        ) {

            texto +=
                " (aproximadamente)";

        }

    }


    return texto;

}


/* =========================================================
   Montar participantes
   ========================================================= */

function montarParticipantes() {

    const participantes = [];


    formulario.vitimas.forEach(
        function(id) {

            participantes.push({

                papel: "possivel_vitima",

                tipo: "aluno",

                aluno_id: id

            });

        }
    );


    formulario.autores.forEach(
        function(id) {

            participantes.push({

                papel: "possivel_autor",

                tipo: "aluno",

                aluno_id: id

            });

        }
    );


    formulario.testemunhas.forEach(
        function(item) {

            participantes.push({

                papel: "testemunha",

                tipo: item.tipo,

                aluno_id: item.aluno_id ||
                    null,

                usuario_id: item.usuario_id ||
                    null,

                funcionario_id: item.funcionario_id ||
                    null,

                nome_externo: item.nome_externo ||
                    null,

                funcao_externa: item.funcao_externa ||
                    null

            });

        }
    );


    return participantes;

}


/* =========================================================
   Enviar registro
   ========================================================= */

situationForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        if (!formularioCompleto()) {

            mostrarMensagem(
                "Complete as informações obrigatórias antes de enviar."
            );


            atualizarEstadoEnvio();

            return;
        }


        definirCarregamento(
            true
        );


        const resultado =
            await window.pecSupabase
            .rpc(
                "registrar_nova_situacao", {

                    p_origem_informacao: formulario.origem,

                    p_quem_comunicou: formulario.quemComunicou,

                    p_descricao_inicial: formulario.descricao.trim(),

                    p_ambiente: formulario.ambiente,

                    p_tipo_ambiente: formulario.tipoAmbiente,

                    p_existencia_evidencias: formulario.evidencias,

                    p_indicacao_risco_imediato: formulario.risco,

                    p_data_ocorrencia: formulario.dataOcorrencia,

                    p_horario_ocorrencia: formulario.horarioOcorrencia ||
                        null,

                    p_horario_aproximado: formulario.horarioAproximado,

                    p_participantes: montarParticipantes()

                }
            );


        if (
            resultado.error
        ) {

            console.error(
                "Erro ao registrar situação:",
                resultado.error
            );


            mostrarMensagem(
                "Não foi possível enviar o registro. Seu rascunho foi preservado."
            );


            await salvarRascunhoSupabase();


            definirCarregamento(
                false
            );


            return;
        }


        let registro =
            resultado.data;


        if (
            Array.isArray(
                resultado.data
            )
        ) {

            registro =
                resultado.data[0];

        }


        if (!registro) {

            mostrarMensagem(
                "O registro foi processado, mas não conseguimos confirmar o número do caso."
            );


            definirCarregamento(
                false
            );


            return;
        }


        await excluirRascunho();


        situationForm.hidden =
            true;


        const progressArea =
            document.querySelector(
                ".progress-area"
            );


        if (progressArea) {

            progressArea.hidden =
                true;

        }


        successCard.hidden =
            false;


        createdCaseNumber.textContent =
            registro.numero_caso;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   Salvar e sair
   ========================================================= */

saveDraftButton.addEventListener(
    "click",
    async function() {

        saveDraftButton.disabled =
            true;


        saveDraftButton.textContent =
            "Salvando...";


        const salvo =
            await salvarRascunhoSupabase();


        if (salvo) {

            window.location.href =
                "./dashboard.html";

            return;
        }


        saveDraftButton.disabled =
            false;


        saveDraftButton.textContent =
            "Salvar rascunho e sair";


        mostrarMensagem(
            "Não foi possível salvar o rascunho. Tente novamente."
        );

    }
);


/* =========================================================
   Loading
   ========================================================= */

function definirCarregamento(
    carregando
) {

    submitButton.disabled =
        carregando;


    submitSpinner.hidden = !carregando;


    if (carregando) {

        submitText.textContent =
            "Enviando...";

    } else {

        submitText.textContent =
            "Enviar para a equipe responsável";

    }

}


/* =========================================================
   Mensagens
   ========================================================= */

function mostrarMensagem(
    mensagem
) {

    formMessage.textContent =
        mensagem;


    formMessage.classList.add(
        "show"
    );

}


function limparMensagem() {

    formMessage.textContent =
        "";


    formMessage.classList.remove(
        "show"
    );

}


/* =========================================================
   Voltar
   ========================================================= */

backDashboard.addEventListener(
    "click",
    async function() {

        await salvarRascunhoSupabase();


        window.location.href =
            "./dashboard.html";

    }
);


successDashboardButton.addEventListener(
    "click",
    function() {

        window.location.href =
            "./dashboard.html";

    }
);


/* =========================================================
   Utilidades
   ========================================================= */

function dataHoje() {

    const agora =
        new Date();


    const ano =
        agora.getFullYear();

    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            agora.getDate()
        ).padStart(2, "0");


    return `${ano}-${mes}-${dia}`;

}


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