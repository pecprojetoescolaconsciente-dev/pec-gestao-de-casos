/* =========================================================
   PEC - GESTÃO DE CASOS
   ETAPA 3 - LEVANTAMENTO INICIAL
   ========================================================= */

(function() {

    "use strict";


    /* =========================================================
       Estado do levantamento
       ========================================================= */

    let casoAtualLevantamento =
        null;


    let participantesLevantamento = [];


    /* =========================================================
       Inicializar
       ========================================================= */

    function iniciar(contexto) {

        if (!contexto ||
            !contexto.caso
        ) {

            return;

        }

        console.log(
            "Contexto completo do levantamento:",
            contexto
        );


        casoAtualLevantamento =
            contexto.caso;


        participantesLevantamento =
            contexto.caso.caso_participantes || [];

        console.log(
            "Levantamento carregado:",
            casoAtualLevantamento.numero_caso
        );


        preencherResponsavelEscuta(
            casoAtualLevantamento
        );

        preencherPossiveisVitimas();

        preencherDataHorarioEscuta();

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


        campo.textContent =
            responsavel.nome ||
            "Responsável";

    }


    /* =========================================================
   Possíveis vítimas
   ========================================================= */

    function preencherPossiveisVitimas() {

        const select =
            document.getElementById(
                "levantamentoVictimParticipant"
            );


        if (!select) {

            return;

        }


        select.innerHTML =
            '<option value="">Selecione a possível vítima</option>';


        const vitimas =
            participantesLevantamento.filter(
                function(participante) {

                    return (
                        participante.papel ===
                        "possivel_vitima"
                    );

                }
            );


        vitimas.forEach(
            function(participante) {

                let nome =
                    "Participante";


                if (
                    participante.alunos &&
                    participante.alunos.nome
                ) {

                    nome =
                        participante.alunos.nome;

                } else if (
                    participante.usuario &&
                    participante.usuario.nome
                ) {

                    nome =
                        participante.usuario.nome;

                } else if (
                    participante.funcionarios &&
                    participante.funcionarios.nome
                ) {

                    nome =
                        participante.funcionarios.nome;

                } else if (
                    participante.nome_externo
                ) {

                    nome =
                        participante.nome_externo;

                }


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    participante.id;


                option.textContent =
                    nome;


                select.appendChild(
                    option
                );

            }
        );

    }


    /* =========================================================
   Data e horário da escuta
   ========================================================= */

    function preencherDataHorarioEscuta() {

        const campoData =
            document.getElementById(
                "levantamentoVictimDate"
            );


        const campoHorario =
            document.getElementById(
                "levantamentoVictimTime"
            );


        const agora =
            new Date();


        if (
            campoData &&
            !campoData.value
        ) {

            const ano =
                agora.getFullYear();


            const mes =
                String(
                    agora.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );


            const dia =
                String(
                    agora.getDate()
                ).padStart(
                    2,
                    "0"
                );


            campoData.value =
                ano +
                "-" +
                mes +
                "-" +
                dia;

        }


        if (
            campoHorario &&
            !campoHorario.value
        ) {

            const horas =
                String(
                    agora.getHours()
                ).padStart(
                    2,
                    "0"
                );


            const minutos =
                String(
                    agora.getMinutes()
                ).padStart(
                    2,
                    "0"
                );


            campoHorario.value =
                horas +
                ":" +
                minutos;

        }

    }


    /* =========================================================
       API da etapa
       ========================================================= */

    window.pecLevantamento = {

        iniciar: iniciar

    };


})();