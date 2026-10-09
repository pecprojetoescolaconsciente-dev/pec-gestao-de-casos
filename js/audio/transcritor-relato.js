/* =========================================================
   PEC - GESTÃO DE CASOS
   Transcrição local do relato
   ========================================================= */

import {
    pipeline,
    env
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1";


/* =========================================================
   Configuração
   ========================================================= */

env.allowLocalModels =
    false;


const MODELO_TRANSCRICAO =
    "onnx-community/whisper-tiny";


let transcritorPromise =
    null;


/* =========================================================
   Carregar modelo
   ========================================================= */

async function obterTranscritor(
    aoProgredir
) {

    if (
        transcritorPromise
    ) {

        return transcritorPromise;

    }


    transcritorPromise =
        pipeline(
            "automatic-speech-recognition",
            MODELO_TRANSCRICAO, {
                progress_callback: function(
                    progresso
                ) {

                    if (
                        typeof aoProgredir ===
                        "function"
                    ) {

                        aoProgredir(
                            progresso
                        );

                    }

                }
            }
        );


    try {

        return await transcritorPromise;

    } catch (
        erro
    ) {

        transcritorPromise =
            null;


        throw erro;

    }

}


/* =========================================================
   Transcrever Blob de áudio
   ========================================================= */

async function transcrever(
    audioBlob,
    aoProgredir
) {

    if (!audioBlob ||
        audioBlob.size === 0
    ) {

        throw new Error(
            "Nenhum áudio foi recebido para transcrição."
        );

    }


    let urlAudio =
        null;


    try {

        if (
            typeof aoProgredir ===
            "function"
        ) {

            aoProgredir({
                status: "preparando_audio"
            });

        }


        /*
         * Criamos uma URL temporária para o Blob.
         *
         * O pipeline do Transformers.js
         * consegue carregar o áudio diretamente
         * desta URL.
         */

        urlAudio =
            URL.createObjectURL(
                audioBlob
            );


        if (
            typeof aoProgredir ===
            "function"
        ) {

            aoProgredir({
                status: "carregando_modelo"
            });

        }


        const transcritor =
            await obterTranscritor(
                aoProgredir
            );


        if (
            typeof aoProgredir ===
            "function"
        ) {

            aoProgredir({
                status: "transcrevendo"
            });

        }


        const resultado =
            await transcritor(
                urlAudio, {
                    language: "portuguese",

                    task: "transcribe",

                    chunk_length_s: 20,

                    stride_length_s: 3
                }
            );


        if (!resultado ||
            !resultado.text
        ) {

            throw new Error(
                "A transcrição não retornou texto."
            );

        }


        return resultado.text
            .trim();

    } finally {

        if (
            urlAudio
        ) {

            URL.revokeObjectURL(
                urlAudio
            );

        }

    }

}

/* =========================================================
   Disponibilizar para o restante do PEC
   ========================================================= */

window.pecTranscritorRelato = {

    transcrever: transcrever

};