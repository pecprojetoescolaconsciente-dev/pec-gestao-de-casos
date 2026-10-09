/* =========================================================
   PEC - GESTÃO DE CASOS
   ETAPA 2 - TRIAGEM
   ========================================================= */

(function() {

    "use strict";


    /* =========================================================
       Estado da triagem
       ========================================================= */

    let fatoresSelecionados = [];
    let outrosFatoresSelecionados = [];

    let providenciasSelecionadas = [];
    let outrasProvidenciasSelecionadas = [];

    let encaminhamentosSelecionados = [];
    let outrosEncaminhamentosSelecionados = [];

    let arquivoTriagemSelecionado = null;

    let documentoTriagemParaRemover = null;

    let gestoresDisponiveis = [];
    let casoAtualTriagem = null;

    let eventosConfigurados = false;


    /* =========================================================
       Inicializar
       ========================================================= */

    function iniciar(contexto) {

        if (!contexto ||
            !contexto.caso
        ) {

            return;

        }

        casoAtualTriagem =
            contexto.caso;


        gestoresDisponiveis =
            contexto.gestores || [];


        console.log(
            "Triagem carregada:",
            contexto.caso.numero_caso
        );

        preencherResponsavelEscuta(
            casoAtualLevantamento
        );


        preencherResponsavel(
            contexto.caso
        );


        configurarEventos();

        renderizarFatores();

        renderizarOutrosFatores();

        carregarDocumentosSalvosTriagem();

    }


    /* =========================================================
       Responsável
       ========================================================= */

    function preencherResponsavel(caso) {

        const nome =
            document.getElementById(
                "triageOwnerName"
            );


        const cargo =
            document.getElementById(
                "triageOwnerRole"
            );


        const avatar =
            document.getElementById(
                "triageOwnerAvatar"
            );


        let responsavel =
            caso.responsavel;


        if (
            Array.isArray(responsavel)
        ) {

            responsavel =
                responsavel.length > 0 ?
                responsavel[0] :
                null;

        }


        if (!responsavel) {

            if (nome) {

                nome.textContent =
                    "Sem responsável";

            }


            if (cargo) {

                cargo.textContent =
                    "Responsável não definido";

            }


            if (avatar) {

                avatar.textContent =
                    "?";

            }


            return;

        }


        const nomeResponsavel =
            responsavel.nome ||
            "Responsável";


        if (nome) {

            nome.textContent =
                nomeResponsavel;

        }


        if (cargo) {

            cargo.textContent =
                responsavel.cargo ||
                "Gestão";

        }


        if (avatar) {

            avatar.textContent =
                nomeResponsavel
                .charAt(0)
                .toUpperCase();

        }

    }


    /* =========================================================
       Eventos
       ========================================================= */

    function configurarEventos() {

        if (
            eventosConfigurados
        ) {

            return;

        }


        eventosConfigurados = true;


        const select =
            document.getElementById(
                "triageRiskFactorsSelect"
            );


        if (!select) {

            return;

        }


        select.addEventListener(
            "change",
            function() {

                const valor =
                    select.value;


                if (!valor) {

                    return;

                }


                adicionarFator(
                    valor
                );


                select.value =
                    "";

            }
        );


        const outroInput =
            document.getElementById(
                "triageRiskFactorOther"
            );


        const outroBotao =
            document.getElementById(
                "triageRiskFactorOtherAddButton"
            );


        if (
            outroBotao &&
            outroInput
        ) {

            outroBotao.addEventListener(
                "click",
                function() {

                    adicionarOutroFator();

                }
            );


            outroInput.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        adicionarOutroFator();

                    }

                }
            );

        }

        const alterarResponsavelBotao =
            document.getElementById(
                "changeTriageOwnerButton"
            );


        const fecharResponsavelBotao =
            document.getElementById(
                "closeChangeTriageOwnerModalButton"
            );


        const responsavelModal =
            document.getElementById(
                "changeTriageOwnerModal"
            );


        if (
            alterarResponsavelBotao
        ) {

            alterarResponsavelBotao.addEventListener(
                "click",
                function() {

                    abrirModalResponsavel();

                }
            );

        }


        if (
            fecharResponsavelBotao
        ) {

            fecharResponsavelBotao.addEventListener(
                "click",
                function() {

                    fecharModalResponsavel();

                }
            );

        }


        if (
            responsavelModal
        ) {

            responsavelModal.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        responsavelModal
                    ) {

                        fecharModalResponsavel();

                    }

                }
            );

        }

        const providenciasSelect =
            document.getElementById(
                "triageActionsSelect"
            );


        if (
            providenciasSelect
        ) {

            providenciasSelect.addEventListener(
                "change",
                function() {

                    const valor =
                        providenciasSelect.value;


                    if (!valor) {

                        return;

                    }


                    adicionarProvidencia(
                        valor
                    );


                    providenciasSelect.value =
                        "";

                }
            );

        }

        const outraProvidenciaInput =
            document.getElementById(
                "triageActionsOther"
            );


        const outraProvidenciaBotao =
            document.getElementById(
                "triageActionsOtherAddButton"
            );


        if (
            outraProvidenciaInput &&
            outraProvidenciaBotao
        ) {

            outraProvidenciaBotao.addEventListener(
                "click",
                function() {

                    adicionarOutraProvidencia();

                }
            );


            outraProvidenciaInput.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        adicionarOutraProvidencia();

                    }

                }
            );

        }

        const encaminhamentosSelect =
            document.getElementById(
                "triageReferralsSelect"
            );


        if (
            encaminhamentosSelect
        ) {

            encaminhamentosSelect.addEventListener(
                "change",
                function() {

                    const valor =
                        encaminhamentosSelect.value;


                    if (!valor) {

                        return;

                    }


                    adicionarEncaminhamento(
                        valor
                    );


                    encaminhamentosSelect.value =
                        "";

                }
            );

        }

        const outroEncaminhamentoInput =
            document.getElementById(
                "triageReferralsOther"
            );


        const outroEncaminhamentoBotao =
            document.getElementById(
                "triageReferralsOtherAddButton"
            );


        if (
            outroEncaminhamentoInput &&
            outroEncaminhamentoBotao
        ) {

            outroEncaminhamentoBotao.addEventListener(
                "click",
                function() {

                    adicionarOutroEncaminhamento();

                }
            );


            outroEncaminhamentoInput.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        adicionarOutroEncaminhamento();

                    }

                }
            );

        }

        const evidenciaBotao =
            document.getElementById(
                "triageEvidenceButton"
            );


        const evidenciaInput =
            document.getElementById(
                "triageEvidenceInput"
            );


        if (
            evidenciaBotao &&
            evidenciaInput
        ) {

            evidenciaBotao.addEventListener(
                "click",
                function() {

                    evidenciaInput.click();

                }
            );

        }

        if (
            evidenciaInput
        ) {

            evidenciaInput.addEventListener(
                "change",
                function() {

                    const arquivo =
                        evidenciaInput.files[0];


                    if (!arquivo) {

                        return;

                    }


                    mostrarArquivoSelecionado(
                        arquivo
                    );

                }
            );

        }

        const removerDocumentoModal =
            document.getElementById(
                "removeTriageDocumentModal"
            );


        const fecharRemoverDocumentoBotao =
            document.getElementById(
                "closeRemoveTriageDocumentModalButton"
            );


        const cancelarRemoverDocumentoBotao =
            document.getElementById(
                "cancelRemoveTriageDocumentButton"
            );


        if (
            fecharRemoverDocumentoBotao
        ) {

            fecharRemoverDocumentoBotao.addEventListener(
                "click",
                function() {

                    fecharModalRemoverDocumentoTriagem();

                }
            );

        }


        if (
            cancelarRemoverDocumentoBotao
        ) {

            cancelarRemoverDocumentoBotao.addEventListener(
                "click",
                function() {

                    fecharModalRemoverDocumentoTriagem();

                }
            );

        }


        if (
            removerDocumentoModal
        ) {

            removerDocumentoModal.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        removerDocumentoModal
                    ) {

                        fecharModalRemoverDocumentoTriagem();

                    }

                }
            );

        }

        /* =========================================================
            Confirmar remoção do documento
            ========================================================= */

        const confirmarRemoverDocumentoBotao =
            document.getElementById(
                "confirmRemoveTriageDocumentButton"
            );


        if (
            confirmarRemoverDocumentoBotao
        ) {

            confirmarRemoverDocumentoBotao.addEventListener(
                "click",
                async function() {

                    if (!documentoTriagemParaRemover) {

                        return;

                    }


                    confirmarRemoverDocumentoBotao.disabled =
                        true;


                    confirmarRemoverDocumentoBotao.textContent =
                        "Removendo...";


                    await removerDocumentoTriagem(
                        documentoTriagemParaRemover.id,
                        documentoTriagemParaRemover.nome
                    );


                    confirmarRemoverDocumentoBotao.disabled =
                        false;


                    confirmarRemoverDocumentoBotao.textContent =
                        "Remover documento";


                    fecharModalRemoverDocumentoTriagem();

                }
            );

        }

        const formularioTriagem =
            document.getElementById(
                "triageForm"
            );


        if (
            formularioTriagem
        ) {

            formularioTriagem.addEventListener(
                "submit",
                async function(event) {

                    event.preventDefault();

                    const botao =
                        document.getElementById(
                            "triageSubmitButton"
                        );


                    const texto =
                        document.getElementById(
                            "triageSubmitText"
                        );


                    const carregando =
                        document.getElementById(
                            "triageSubmitLoading"
                        );


                    const seta =
                        document.getElementById(
                            "triageSubmitArrow"
                        );


                    if (
                        botao &&
                        botao.disabled
                    ) {

                        return;

                    }


                    if (
                        botao
                    ) {

                        botao.disabled =
                            true;

                    }


                    if (
                        texto
                    ) {

                        texto.hidden =
                            true;

                    }


                    if (
                        carregando
                    ) {

                        carregando.hidden =
                            false;

                    }


                    if (
                        seta
                    ) {

                        seta.hidden =
                            true;

                    }


                    const dados =
                        coletarDadosTriagem();


                    console.log(
                        "Dados da triagem:",
                        dados
                    );


                    const resultado =
                        await window.pecSupabase
                        .rpc(
                            "concluir_triagem", {

                                p_caso_id: dados.caso_id,

                                p_risco_imediato: dados.risco_imediato,

                                p_nivel_atencao: dados.nivel_atencao,

                                p_fatores_risco: dados.fatores_risco,

                                p_avaliacao_gestor: dados.avaliacao_gestor,

                                p_observacoes: dados.observacoes,

                                p_providencias_adotadas: dados.providencias_adotadas,

                                p_encaminhamentos: dados.encaminhamentos,

                                p_prazo: dados.prazo

                            }
                        );


                    if (
                        resultado.error
                    ) {

                        console.error(
                            "Erro ao concluir triagem:",
                            resultado.error
                        );


                        alert(
                            resultado.error.message ||
                            "Não foi possível concluir a triagem."
                        );

                        if (
                            botao
                        ) {

                            botao.disabled =
                                false;

                        }


                        if (
                            texto
                        ) {

                            texto.hidden =
                                false;

                        }


                        if (
                            carregando
                        ) {

                            carregando.hidden =
                                true;

                        }


                        if (
                            seta
                        ) {

                            seta.hidden =
                                false;

                        }


                        return;

                    }


                    console.log(
                        "Triagem concluída com sucesso:",
                        resultado.data
                    );

                }
            );

        }

    }

    /* =========================================================
   Arquivo selecionado
   ========================================================= */

    function mostrarArquivoSelecionado(
        arquivo
    ) {

        const lista =
            document.getElementById(
                "triageEvidenceList"
            );


        const mensagem =
            document.getElementById(
                "triageEvidenceMessage"
            );


        if (!lista) {

            return;

        }


        const limite =
            10 * 1024 * 1024;


        if (
            arquivo.size >
            limite
        ) {

            if (
                mensagem
            ) {

                mensagem.textContent =
                    "O arquivo ultrapassa o limite de 10 MB.";

            }


            removerArquivoSelecionado();

            return;

        }

        arquivoTriagemSelecionado =
            arquivo;


        lista.innerHTML =
            "";


        if (
            mensagem
        ) {

            mensagem.textContent =
                "";

        }


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "triage-document-item";


        const nome =
            document.createElement(
                "span"
            );


        nome.textContent =
            arquivo.name;

        const enviar =
            document.createElement(
                "button"
            );


        enviar.type =
            "button";


        enviar.className =
            "triage-secondary-button";


        enviar.textContent =
            "Enviar";


        enviar.addEventListener(
            "click",
            async function() {

                enviar.disabled =
                    true;


                enviar.textContent =
                    "Enviando...";


                const documento =
                    await registrarDocumentoTriagem();


                if (!documento) {

                    enviar.disabled =
                        false;


                    enviar.textContent =
                        "Enviar";


                    if (
                        mensagem
                    ) {

                        mensagem.textContent =
                            "Não foi possível enviar o arquivo.";

                    }


                    return;

                }


                if (
                    mensagem
                ) {

                    mensagem.textContent =
                        "Arquivo enviado com sucesso.";

                }


                removerArquivoSelecionado();


                await carregarDocumentosSalvosTriagem();

            }
        );

        const remover =
            document.createElement(
                "button"
            );


        remover.type =
            "button";


        remover.className =
            "triage-tag-remove";


        remover.textContent =
            "×";


        remover.setAttribute(
            "aria-label",
            "Remover arquivo " + arquivo.name
        );


        remover.addEventListener(
            "click",
            function() {

                removerArquivoSelecionado();

            }
        );


        item.appendChild(
            nome
        );


        item.appendChild(
            enviar
        );


        item.appendChild(
            remover
        );


        lista.appendChild(
            item
        );

    }


    function removerArquivoSelecionado() {


        arquivoTriagemSelecionado =
            null;

        const input =
            document.getElementById(
                "triageEvidenceInput"
            );


        const lista =
            document.getElementById(
                "triageEvidenceList"
            );


        const mensagem =
            document.getElementById(
                "triageEvidenceMessage"
            );


        if (
            input
        ) {

            input.value =
                "";

        }


        if (
            lista
        ) {

            lista.innerHTML =
                "";

        }

    }


    /* =========================================================
   Enviar arquivo da triagem
   ========================================================= */

    async function enviarArquivoTriagem() {

        if (!arquivoTriagemSelecionado ||
            !casoAtualTriagem
        ) {

            return null;

        }


        const extensao =
            arquivoTriagemSelecionado.name
            .split(".")
            .pop()
            .toLowerCase();


        const nomeUnico =
            crypto.randomUUID() +
            "." +
            extensao;


        const caminho =
            casoAtualTriagem.id +
            "/" +
            nomeUnico;


        const resultadoUpload =
            await window.pecSupabase
            .storage
            .from(
                "documentos-casos"
            )
            .upload(
                caminho,
                arquivoTriagemSelecionado, {
                    cacheControl: "3600",
                    upsert: false
                }
            );


        if (
            resultadoUpload.error
        ) {

            console.error(
                "Erro ao enviar arquivo:",
                resultadoUpload.error
            );


            return null;

        }


        return {
            caminho: caminho,
            nome: arquivoTriagemSelecionado.name
        };

    }

    /* =========================================================
   Registrar documento da triagem
   ========================================================= */

    async function registrarDocumentoTriagem() {

        if (!arquivoTriagemSelecionado ||
            !casoAtualTriagem
        ) {

            return null;

        }


        const upload =
            await enviarArquivoTriagem();


        if (!upload) {

            return null;

        }


        const usuarioResultado =
            await window.pecSupabase
            .auth
            .getUser();


        if (
            usuarioResultado.error ||
            !usuarioResultado.data ||
            !usuarioResultado.data.user
        ) {

            console.error(
                "Não foi possível identificar o usuário."
            );


            await window.pecSupabase
                .storage
                .from(
                    "documentos-casos"
                )
                .remove(
                    [
                        upload.caminho
                    ]
                );


            return null;

        }


        const usuario =
            usuarioResultado.data.user;


        const resultadoDocumento =
            await window.pecSupabase
            .from(
                "documentos"
            )
            .insert({

                caso_id: casoAtualTriagem.id,

                etapa: "triagem",

                nome_arquivo: upload.nome,

                storage_path: upload.caminho,

                uploaded_by: usuario.id

            })
            .select(
                "id, nome_arquivo, storage_path"
            )
            .single();


        if (
            resultadoDocumento.error
        ) {

            console.error(
                "Erro ao registrar documento:",
                resultadoDocumento.error
            );


            await window.pecSupabase
                .storage
                .from(
                    "documentos-casos"
                )
                .remove(
                    [
                        upload.caminho
                    ]
                );


            return null;

        }


        return resultadoDocumento.data;

    }

    /* =========================================================
   Carregar documentos salvos da triagem
   ========================================================= */

    async function carregarDocumentosSalvosTriagem() {

        const lista =
            document.getElementById(
                "triageSavedEvidenceList"
            );


        if (!lista ||
            !casoAtualTriagem
        ) {

            return;

        }


        lista.innerHTML =
            "Carregando documentos...";


        const resultado =
            await window.pecSupabase
            .from(
                "documentos"
            )
            .select(
                "id, nome_arquivo, storage_path, created_at"
            )
            .eq(
                "caso_id",
                casoAtualTriagem.id
            )
            .eq(
                "etapa",
                "triagem"
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
                "Erro ao carregar documentos da triagem:",
                resultado.error
            );


            lista.textContent =
                "Não foi possível carregar os documentos.";

            return;

        }


        lista.innerHTML =
            "";


        const documentos =
            resultado.data || [];


        if (
            documentos.length ===
            0
        ) {

            return;

        }


        documentos.forEach(
            function(documento) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "triage-document-item";


                const nome =
                    document.createElement(
                        "button"
                    );


                nome.type =
                    "button";


                nome.className =
                    "triage-document-open";


                nome.textContent =
                    documento.nome_arquivo;


                nome.addEventListener(
                    "click",
                    function() {

                        abrirDocumentoTriagem(
                            documento.storage_path
                        );

                    }
                );


                item.appendChild(
                    nome
                );


                const remover =
                    document.createElement(
                        "button"
                    );


                remover.type =
                    "button";


                remover.className =
                    "triage-document-remove";


                remover.textContent =
                    "×";


                remover.setAttribute(
                    "aria-label",
                    "Remover " + documento.nome_arquivo
                );


                remover.addEventListener(
                    "click",
                    function() {

                        abrirModalRemoverDocumentoTriagem(
                            documento.id,
                            documento.nome_arquivo
                        );

                    }
                );


                item.appendChild(
                    remover
                );


                lista.appendChild(
                    item
                );

            }
        );

    }


    /* =========================================================
   Abrir documento da triagem
   ========================================================= */

    async function abrirDocumentoTriagem(
        caminho
    ) {

        if (!caminho) {

            return;

        }


        const aba =
            window.open(
                "",
                "_blank"
            );


        const resultado =
            await window.pecSupabase
            .storage
            .from(
                "documentos-casos"
            )
            .createSignedUrl(
                caminho,
                60
            );


        if (
            resultado.error ||
            !resultado.data ||
            !resultado.data.signedUrl
        ) {

            console.error(
                "Erro ao abrir documento:",
                resultado.error
            );


            if (
                aba
            ) {

                aba.close();

            }


            alert(
                "Não foi possível abrir o documento."
            );


            return;

        }


        if (
            aba
        ) {

            aba.location.href =
                resultado.data.signedUrl;

        }

    }


    /* =========================================================
   Modal remover documento
   ========================================================= */

    function abrirModalRemoverDocumentoTriagem(
        documentoId,
        nomeArquivo
    ) {

        const modal =
            document.getElementById(
                "removeTriageDocumentModal"
            );


        const nome =
            document.getElementById(
                "removeTriageDocumentName"
            );


        if (!modal) {

            return;

        }


        documentoTriagemParaRemover = {
            id: documentoId,
            nome: nomeArquivo
        };


        if (
            nome
        ) {

            nome.textContent =
                nomeArquivo;

        }


        modal.hidden =
            false;


        document.body.style.overflow =
            "hidden";

    }


    function fecharModalRemoverDocumentoTriagem() {

        const modal =
            document.getElementById(
                "removeTriageDocumentModal"
            );


        if (!modal) {

            return;

        }


        modal.hidden =
            true;


        documentoTriagemParaRemover =
            null;


        document.body.style.overflow =
            "";

    }

    /* =========================================================
   Remover documento da triagem
   ========================================================= */

    async function removerDocumentoTriagem(
        documentoId,
        nomeArquivo
    ) {

        const usuarioResultado =
            await window.pecSupabase
            .auth
            .getUser();


        if (
            usuarioResultado.error ||
            !usuarioResultado.data ||
            !usuarioResultado.data.user
        ) {

            alert(
                "Não foi possível identificar o usuário."
            );

            return;

        }


        const usuario =
            usuarioResultado.data.user;


        const resultado =
            await window.pecSupabase
            .from(
                "documentos"
            )
            .update({

                removido_em: new Date().toISOString(),

                removido_por: usuario.id,

                motivo_remocao: "Removido pela Gestão durante a triagem"

            })
            .eq(
                "id",
                documentoId
            );


        if (
            resultado.error
        ) {

            console.error(
                "Erro ao remover documento:",
                resultado.error
            );


            alert(
                "Não foi possível remover o documento."
            );

            return;

        }


        await carregarDocumentosSalvosTriagem();

    }

    /* =========================================================
   Modal responsável
   ========================================================= */

    function abrirModalResponsavel() {

        const modal =
            document.getElementById(
                "changeTriageOwnerModal"
            );


        if (!modal) {

            return;

        }

        renderizarResponsaveis();


        modal.hidden =
            false;


        document.body.style.overflow =
            "hidden";

    }


    function fecharModalResponsavel() {

        const modal =
            document.getElementById(
                "changeTriageOwnerModal"
            );


        if (!modal) {

            return;

        }


        modal.hidden =
            true;


        document.body.style.overflow =
            "";

    }


    /* =========================================================
   Lista de responsáveis
   ========================================================= */

    function renderizarResponsaveis() {

        const lista =
            document.getElementById(
                "changeTriageOwnerList"
            );


        if (!lista) {

            return;

        }


        lista.innerHTML =
            "";


        if (
            gestoresDisponiveis.length ===
            0
        ) {

            lista.textContent =
                "Nenhum responsável disponível.";

            return;

        }


        gestoresDisponiveis.forEach(
            function(gestor) {

                const item =
                    document.createElement(
                        "button"
                    );


                item.type =
                    "button";


                item.className =
                    "case-owner-list-item";


                item.dataset.ownerId =
                    gestor.id;


                const pessoa =
                    document.createElement(
                        "div"
                    );


                pessoa.className =
                    "case-owner-list-person";


                const nome =
                    document.createElement(
                        "strong"
                    );


                nome.textContent =
                    gestor.nome ||
                    "Gestor";


                const cargo =
                    document.createElement(
                        "span"
                    );


                cargo.textContent =
                    gestor.cargo ||
                    "Gestão";


                pessoa.appendChild(
                    nome
                );


                pessoa.appendChild(
                    cargo
                );


                const status =
                    document.createElement(
                        "span"
                    );


                status.className =
                    "case-owner-list-status";


                if (
                    casoAtualTriagem &&
                    casoAtualTriagem.responsavel_id ===
                    gestor.id
                ) {

                    status.textContent =
                        "Responsável atual";


                    item.disabled =
                        true;


                    item.classList.add(
                        "current"
                    );

                } else {

                    status.textContent =
                        "Selecionar";

                }

                item.addEventListener(
                    "click",
                    async function() {

                        await trocarResponsavel(
                            gestor.id,
                            item
                        );

                    }
                );


                item.appendChild(
                    pessoa
                );


                item.appendChild(
                    status
                );


                lista.appendChild(
                    item
                );

            }
        );

    }

    /* =========================================================
   Trocar responsável
   ========================================================= */

    async function trocarResponsavel(
        responsavelId,
        botao
    ) {

        if (!casoAtualTriagem ||
            !responsavelId
        ) {

            return;

        }


        if (
            botao
        ) {

            botao.disabled =
                true;

        }


        const resultado =
            await window.pecSupabase
            .rpc(
                "atribuir_responsavel_caso", {

                    p_caso_id: casoAtualTriagem.id,

                    p_responsavel_id: responsavelId

                }
            );


        if (
            resultado.error
        ) {

            console.error(
                "Erro ao alterar responsável:",
                resultado.error
            );


            if (
                botao
            ) {

                botao.disabled =
                    false;

            }


            alert(
                "Não foi possível alterar o responsável."
            );


            return;

        }


        fecharModalResponsavel();


        if (
            window.pecCasoGestao &&
            typeof window.pecCasoGestao.recarregar ===
            "function"
        ) {

            await window.pecCasoGestao
                .recarregar();

        }

    }

    /* =========================================================
       Adicionar fator
       ========================================================= */

    function adicionarFator(valor) {

        if (
            fatoresSelecionados.includes(
                valor
            )
        ) {

            return;

        }


        fatoresSelecionados.push(
            valor
        );


        renderizarFatores();

    }


    /* =========================================================
       Remover fator
       ========================================================= */

    function removerFator(valor) {

        fatoresSelecionados =
            fatoresSelecionados.filter(
                function(fator) {

                    return (
                        fator !==
                        valor
                    );

                }
            );


        renderizarFatores();

    }

    /* =========================================================
   Adicionar outro fator
   ========================================================= */

    function adicionarOutroFator() {

        const input =
            document.getElementById(
                "triageRiskFactorOther"
            );


        if (!input) {

            return;

        }


        const valor =
            input.value.trim();


        if (!valor) {

            return;

        }


        const jaExiste =
            outrosFatoresSelecionados.some(
                function(item) {

                    return (
                        item.toLowerCase() ===
                        valor.toLowerCase()
                    );

                }
            );


        if (!jaExiste) {

            outrosFatoresSelecionados.push(
                valor
            );

        }


        input.value =
            "";


        fatoresSelecionados =
            fatoresSelecionados.filter(
                function(fator) {

                    return (
                        fator !==
                        "Outro fator de risco"
                    );

                }
            );


        renderizarFatores();

    }


    /* =========================================================
       Remover outro fator
       ========================================================= */

    function removerOutroFator(
        valor
    ) {

        outrosFatoresSelecionados =
            outrosFatoresSelecionados.filter(
                function(item) {

                    return (
                        item !==
                        valor
                    );

                }
            );


        renderizarOutrosFatores();

    }


    /* =========================================================
       Renderizar outros fatores
       ========================================================= */

    function renderizarOutrosFatores() {

        const container =
            document.getElementById(
                "triageRiskFactorOtherTags"
            );


        if (!container) {

            return;

        }


        container.innerHTML =
            "";


        outrosFatoresSelecionados.forEach(
            function(fator) {

                const tag =
                    document.createElement(
                        "span"
                    );


                tag.className =
                    "triage-tag";


                const texto =
                    document.createElement(
                        "span"
                    );


                texto.className =
                    "triage-tag-text";


                texto.textContent =
                    fator;


                const remover =
                    document.createElement(
                        "button"
                    );


                remover.type =
                    "button";


                remover.className =
                    "triage-tag-remove";


                remover.textContent =
                    "×";


                remover.setAttribute(
                    "aria-label",
                    "Remover " + fator
                );


                remover.addEventListener(
                    "click",
                    function() {

                        removerOutroFator(
                            fator
                        );

                    }
                );


                tag.appendChild(
                    texto
                );


                tag.appendChild(
                    remover
                );


                container.appendChild(
                    tag
                );

            }
        );

    }


    /* =========================================================
       Renderizar fatores
       ========================================================= */

    function renderizarFatores() {

        const select =
            document.getElementById(
                "triageRiskFactorsSelect"
            );


        const container =
            document.getElementById(
                "triageRiskFactorsTags"
            );


        const outroWrap =
            document.getElementById(
                "triageRiskFactorOtherWrap"
            );


        const outroInput =
            document.getElementById(
                "triageRiskFactorOther"
            );


        if (!select ||
            !container
        ) {

            return;

        }


        container.innerHTML =
            "";


        const fatoresParaExibir = [];


        /* Fatores normais */

        fatoresSelecionados.forEach(
            function(fator) {

                if (
                    fator !==
                    "Outro fator de risco"
                ) {

                    fatoresParaExibir.push({
                        texto: fator,
                        tipo: "normal"
                    });

                }

            }
        );


        /* Outros fatores digitados */

        outrosFatoresSelecionados.forEach(
            function(fator) {

                fatoresParaExibir.push({
                    texto: fator,
                    tipo: "outro"
                });

            }
        );


        /* Criar os cardzinhos */

        fatoresParaExibir.forEach(
            function(item) {

                const tag =
                    document.createElement(
                        "span"
                    );


                tag.className =
                    "triage-tag";


                const texto =
                    document.createElement(
                        "span"
                    );


                texto.className =
                    "triage-tag-text";


                texto.textContent =
                    item.texto;


                const remover =
                    document.createElement(
                        "button"
                    );


                remover.type =
                    "button";


                remover.className =
                    "triage-tag-remove";


                remover.textContent =
                    "×";


                remover.setAttribute(
                    "aria-label",
                    "Remover " + item.texto
                );


                remover.addEventListener(
                    "click",
                    function() {

                        if (
                            item.tipo ===
                            "outro"
                        ) {

                            removerOutroFator(
                                item.texto
                            );

                        } else {

                            removerFator(
                                item.texto
                            );

                        }

                    }
                );


                tag.appendChild(
                    texto
                );


                tag.appendChild(
                    remover
                );


                container.appendChild(
                    tag
                );

            }
        );


        /* =====================================================
           Esconder opções já escolhidas
           ===================================================== */

        Array
            .from(
                select.options
            )
            .forEach(
                function(option) {

                    if (!option.value) {

                        return;

                    }


                    const selecionado =
                        fatoresSelecionados.includes(
                            option.value
                        );


                    option.hidden =
                        selecionado;


                    option.disabled =
                        selecionado;

                }
            );


        /* =====================================================
           Campo "Outro fator"
           ===================================================== */

        const possuiOutro =
            fatoresSelecionados.includes(
                "Outro fator de risco"
            );


        if (
            outroWrap
        ) {

            outroWrap.hidden = !possuiOutro;

        }


        if (!possuiOutro &&
            outroInput
        ) {

            outroInput.value =
                "";

        }

    }


    /* =========================================================
   Providências imediatas
   ========================================================= */

    function adicionarProvidencia(
        valor
    ) {

        if (
            valor ===
            "Outra providência"
        ) {

            const campoOutro =
                document.getElementById(
                    "triageActionsOtherWrap"
                );


            const inputOutro =
                document.getElementById(
                    "triageActionsOther"
                );


            if (
                campoOutro
            ) {

                campoOutro.hidden =
                    false;

            }


            if (
                inputOutro
            ) {

                inputOutro.value =
                    "";

                inputOutro.focus();

            }


            return;

        }


        if (
            providenciasSelecionadas.includes(
                valor
            )
        ) {

            return;

        }


        providenciasSelecionadas.push(
            valor
        );


        renderizarProvidencias();

    }


    function removerProvidencia(
        valor
    ) {

        providenciasSelecionadas =
            providenciasSelecionadas.filter(
                function(item) {

                    return (
                        item !==
                        valor
                    );

                }
            );


        renderizarProvidencias();

    }

    function adicionarOutraProvidencia() {

        const input =
            document.getElementById(
                "triageActionsOther"
            );


        const wrap =
            document.getElementById(
                "triageActionsOtherWrap"
            );


        if (!input) {

            return;

        }


        const valor =
            input.value.trim();


        if (!valor) {

            return;

        }


        const jaExiste =
            outrasProvidenciasSelecionadas.some(
                function(item) {

                    return (
                        item.toLowerCase() ===
                        valor.toLowerCase()
                    );

                }
            );


        if (!jaExiste) {

            outrasProvidenciasSelecionadas.push(
                valor
            );

        }


        input.value =
            "";


        if (
            wrap
        ) {

            wrap.hidden =
                true;

        }


        renderizarProvidencias();

    }


    function removerOutraProvidencia(
        valor
    ) {

        outrasProvidenciasSelecionadas =
            outrasProvidenciasSelecionadas.filter(
                function(item) {

                    return (
                        item !==
                        valor
                    );

                }
            );


        renderizarProvidencias();

    }


    function renderizarProvidencias() {

        const select =
            document.getElementById(
                "triageActionsSelect"
            );


        const container =
            document.getElementById(
                "triageActionsTags"
            );


        if (!select ||
            !container
        ) {

            return;

        }


        container.innerHTML =
            "";


        const providenciasParaExibir = [];


        providenciasSelecionadas.forEach(
            function(providencia) {

                providenciasParaExibir.push({
                    texto: providencia,
                    tipo: "normal"
                });

            }
        );


        outrasProvidenciasSelecionadas.forEach(
            function(providencia) {

                providenciasParaExibir.push({
                    texto: providencia,
                    tipo: "outra"
                });

            }
        );


        providenciasParaExibir.forEach(
            function(item) {

                const tag =
                    document.createElement(
                        "span"
                    );


                tag.className =
                    "triage-tag";


                const texto =
                    document.createElement(
                        "span"
                    );


                texto.className =
                    "triage-tag-text";


                texto.textContent =
                    item.texto;


                const remover =
                    document.createElement(
                        "button"
                    );


                remover.type =
                    "button";


                remover.className =
                    "triage-tag-remove";


                remover.textContent =
                    "×";


                remover.setAttribute(
                    "aria-label",
                    "Remover " + item.texto
                );


                remover.addEventListener(
                    "click",
                    function() {

                        if (
                            item.tipo ===
                            "outra"
                        ) {

                            removerOutraProvidencia(
                                item.texto
                            );

                        } else {

                            removerProvidencia(
                                item.texto
                            );

                        }

                    }
                );


                tag.appendChild(
                    texto
                );


                tag.appendChild(
                    remover
                );


                container.appendChild(
                    tag
                );

            }
        );


        Array
            .from(
                select.options
            )
            .forEach(
                function(option) {

                    if (!option.value) {

                        return;

                    }


                    const selecionada =
                        providenciasSelecionadas.includes(
                            option.value
                        );


                    option.hidden =
                        selecionada;


                    option.disabled =
                        selecionada;

                }
            );

    }


    /* =========================================================
   Encaminhamentos imediatos
   ========================================================= */

    function adicionarEncaminhamento(
        valor
    ) {

        if (
            valor ===
            "Outro encaminhamento"
        ) {

            encaminhamentosSelecionados =
                encaminhamentosSelecionados.filter(
                    function(item) {

                        return (
                            item !==
                            "Nenhum encaminhamento neste momento"
                        );

                    }
                );


            const campoOutro =
                document.getElementById(
                    "triageReferralsOtherWrap"
                );


            const inputOutro =
                document.getElementById(
                    "triageReferralsOther"
                );


            if (
                campoOutro
            ) {

                campoOutro.hidden =
                    false;

            }


            if (
                inputOutro
            ) {

                inputOutro.value =
                    "";

                inputOutro.focus();

            }


            renderizarEncaminhamentos();

            return;

        }


        if (
            valor ===
            "Nenhum encaminhamento neste momento"
        ) {

            encaminhamentosSelecionados = [
                "Nenhum encaminhamento neste momento"
            ];


            outrosEncaminhamentosSelecionados = [];


            renderizarEncaminhamentos();

            return;

        }


        encaminhamentosSelecionados =
            encaminhamentosSelecionados.filter(
                function(item) {

                    return (
                        item !==
                        "Nenhum encaminhamento neste momento"
                    );

                }
            );


        if (
            encaminhamentosSelecionados.includes(
                valor
            )
        ) {

            return;

        }


        encaminhamentosSelecionados.push(
            valor
        );


        renderizarEncaminhamentos();

    }


    function removerEncaminhamento(
        valor
    ) {

        encaminhamentosSelecionados =
            encaminhamentosSelecionados.filter(
                function(item) {

                    return (
                        item !==
                        valor
                    );

                }
            );


        renderizarEncaminhamentos();

    }


    function adicionarOutroEncaminhamento() {

        const input =
            document.getElementById(
                "triageReferralsOther"
            );


        const wrap =
            document.getElementById(
                "triageReferralsOtherWrap"
            );


        if (!input) {

            return;

        }


        const valor =
            input.value.trim();


        if (!valor) {

            return;

        }


        const jaExiste =
            outrosEncaminhamentosSelecionados.some(
                function(item) {

                    return (
                        item.toLowerCase() ===
                        valor.toLowerCase()
                    );

                }
            );


        if (!jaExiste) {

            outrosEncaminhamentosSelecionados.push(
                valor
            );

        }


        input.value =
            "";


        if (
            wrap
        ) {

            wrap.hidden =
                true;

        }


        renderizarEncaminhamentos();

    }


    function removerOutroEncaminhamento(
        valor
    ) {

        outrosEncaminhamentosSelecionados =
            outrosEncaminhamentosSelecionados.filter(
                function(item) {

                    return (
                        item !==
                        valor
                    );

                }
            );


        renderizarEncaminhamentos();

    }


    function renderizarEncaminhamentos() {

        const select =
            document.getElementById(
                "triageReferralsSelect"
            );


        const container =
            document.getElementById(
                "triageReferralsTags"
            );


        if (!select ||
            !container
        ) {

            return;

        }


        container.innerHTML =
            "";


        const encaminhamentosParaExibir = [];


        encaminhamentosSelecionados.forEach(
            function(encaminhamento) {

                encaminhamentosParaExibir.push({
                    texto: encaminhamento,
                    tipo: "normal"
                });

            }
        );


        outrosEncaminhamentosSelecionados.forEach(
            function(encaminhamento) {

                encaminhamentosParaExibir.push({
                    texto: encaminhamento,
                    tipo: "outro"
                });

            }
        );


        encaminhamentosParaExibir.forEach(
            function(item) {

                const tag =
                    document.createElement(
                        "span"
                    );


                tag.className =
                    "triage-tag";


                const texto =
                    document.createElement(
                        "span"
                    );


                texto.className =
                    "triage-tag-text";


                texto.textContent =
                    item.texto;


                const remover =
                    document.createElement(
                        "button"
                    );


                remover.type =
                    "button";


                remover.className =
                    "triage-tag-remove";


                remover.textContent =
                    "×";


                remover.setAttribute(
                    "aria-label",
                    "Remover " + item.texto
                );


                remover.addEventListener(
                    "click",
                    function() {

                        if (
                            item.tipo ===
                            "outro"
                        ) {

                            removerOutroEncaminhamento(
                                item.texto
                            );

                        } else {

                            removerEncaminhamento(
                                item.texto
                            );

                        }

                    }
                );


                tag.appendChild(
                    texto
                );


                tag.appendChild(
                    remover
                );


                container.appendChild(
                    tag
                );

            }
        );


        Array
            .from(
                select.options
            )
            .forEach(
                function(option) {

                    if (!option.value) {

                        return;

                    }


                    const selecionado =
                        encaminhamentosSelecionados.includes(
                            option.value
                        );


                    option.hidden =
                        selecionado;


                    option.disabled =
                        selecionado;

                }
            );

    }


    /* =========================================================
   Coletar dados da triagem
   ========================================================= */

    function coletarDadosTriagem() {

        const riscoSelecionado =
            document.querySelector(
                'input[name="triageImmediateRisk"]:checked'
            );


        const nivelAtencao =
            document.getElementById(
                "triageAttentionLevel"
            );


        const avaliacao =
            document.getElementById(
                "triageAssessment"
            );


        const observacoes =
            document.getElementById(
                "triageObservations"
            );


        const prazo =
            document.getElementById(
                "triageDeadline"
            );


        const fatores =
            fatoresSelecionados.concat(
                outrosFatoresSelecionados
            );


        const providencias =
            providenciasSelecionadas.concat(
                outrasProvidenciasSelecionadas
            );


        const encaminhamentos =
            encaminhamentosSelecionados.concat(
                outrosEncaminhamentosSelecionados
            );


        return {

            caso_id: casoAtualTriagem ?
                casoAtualTriagem.id : null,

            risco_imediato: riscoSelecionado ?
                riscoSelecionado.value === "true" : null,

            nivel_atencao: nivelAtencao &&
                nivelAtencao.value ?
                nivelAtencao.value : null,

            fatores_risco: fatores,

            avaliacao_gestor: avaliacao &&
                avaliacao.value.trim() ?
                avaliacao.value.trim() : null,

            observacoes: observacoes &&
                observacoes.value.trim() ?
                observacoes.value.trim() : null,

            providencias_adotadas: providencias,

            encaminhamentos: encaminhamentos,

            responsavel_id: casoAtualTriagem ?
                casoAtualTriagem.responsavel_id : null,

            prazo: prazo &&
                prazo.value ?
                prazo.value : null

        };

    }

    /* =========================================================
   Responsável pela escuta
   ========================================================= */

    function preencherResponsavelEscuta(
        caso
    ) {

        const campo =
            document.getElementById(
                "levantamentoVictimResponsible"
            );


        console.log(
            "Campo responsável encontrado:",
            campo
        );

        if (!campo) {

            return;

        }


        let responsavel =
            caso.responsavel;


        if (
            Array.isArray(responsavel)
        ) {

            responsavel =
                responsavel.length > 0 ?
                responsavel[0] :
                null;

        }


        if (!responsavel) {

            campo.textContent =
                "Responsável não definido";

            return;

        }

        console.log(
            "Nome que será exibido:",
            responsavel.nome
        );


        campo.textContent =
            responsavel.nome ||
            responsavel.email ||
            "Responsável";

    }

    /* =========================================================
       API da etapa
       ========================================================= */

    window.pecTriagem = {

        iniciar: iniciar

    };


})();