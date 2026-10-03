const SUPABASE_URL =
    "https://ejgulzbdlecqcyitjffk.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_gBHh_D1RNukjLyAmvZ1Aow_zXlHayCW";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================
   ELEMENTOS
========================= */

const carregandoAgendamento =
    document.querySelector(
        "#carregandoAgendamento"
    );

const dadosAgendamentoCliente =
    document.querySelector(
        "#dadosAgendamentoCliente"
    );

const agendamentoNaoEncontrado =
    document.querySelector(
        "#agendamentoNaoEncontrado"
    );

const clienteNome =
    document.querySelector(
        "#clienteNome"
    );

const clienteServicos =
    document.querySelector(
        "#clienteServicos"
    );

const clienteData =
    document.querySelector(
        "#clienteData"
    );

const clienteHorario =
    document.querySelector(
        "#clienteHorario"
    );

const clienteVeiculo =
    document.querySelector(
        "#clienteVeiculo"
    );

const clienteValor =
    document.querySelector(
        "#clienteValor"
    );

const clienteStatus =
    document.querySelector(
        "#clienteStatus"
    );

const btnWhatsappCliente =
    document.querySelector(
        "#btnWhatsappCliente"
    );


let agendamentoAtual = null;


/* =========================
   TOKEN DA URL
========================= */

const parametros =
    new URLSearchParams(
        window.location.search
    );

const token =
    parametros.get("token");


if (!token) {

    mostrarErro();

} else {

    carregarAgendamento();

}


/* =========================
   CARREGAR AGENDAMENTO
========================= */

async function carregarAgendamento() {

    const {
        data,
        error
    } =
        await supabaseClient.rpc(
            "buscar_agendamento_cliente",
            {
                p_token:
                    token
            }
        );


    if (
        error ||
        !data ||
        data.length === 0
    ) {

        console.error(
            "Erro ao buscar agendamento:",
            error
        );

        mostrarErro();

        return;

    }


    agendamentoAtual =
        data[0];


    mostrarAgendamento(
        agendamentoAtual
    );

}


/* =========================
   MOSTRAR DADOS
========================= */

function mostrarAgendamento(
    agendamento
) {

    carregandoAgendamento.classList.add(
        "oculto"
    );

    dadosAgendamentoCliente.classList.remove(
        "oculto"
    );


    clienteNome.textContent =
        agendamento.nome;


    clienteServicos.textContent =
        agendamento.servicos.join(
            " + "
        );


    clienteData.textContent =
        formatarData(
            agendamento.data
        );


    clienteHorario.textContent =
        agendamento.horario.slice(
            0,
            5
        );


    clienteVeiculo.textContent =
        `${agendamento.veiculo} • ${agendamento.cor}`;


    clienteValor.textContent =
        Number(
            agendamento.valor_total || 0
        ).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );


    clienteStatus.textContent =
        formatarStatus(
            agendamento.status
        );


    if (
        agendamento.status ===
        "cancelado"
    ) {

        btnWhatsappCliente.textContent =
            "Falar com a Auto Club";

    }

}


/* =========================
   DATA
========================= */

function formatarData(data) {

    const [
        ano,
        mes,
        dia
    ] =
        data.split("-");


    return `${dia}/${mes}/${ano}`;

}


/* =========================
   STATUS
========================= */

function formatarStatus(status) {

    const statusMap = {

        confirmado:
            "Confirmado",

        concluido:
            "Concluído",

        cancelado:
            "Cancelado"

    };


    return (
        statusMap[status] ||
        status
    );

}


/* =========================
   ERRO
========================= */

function mostrarErro() {

    carregandoAgendamento.classList.add(
        "oculto"
    );

    agendamentoNaoEncontrado.classList.remove(
        "oculto"
    );

}


/* =========================
   WHATSAPP
========================= */

btnWhatsappCliente.addEventListener(
    "click",
    () => {

        if (!agendamentoAtual) {
            return;
        }


        /*
            COLOCAREMOS O NÚMERO
            DA AUTO CLUB AQUI
        */

        const telefoneAutoClub =
            "5521997806766";


        const mensagem =
            `Olá! Gostaria de confirmar meu agendamento na Auto Club.

📅 Data: ${formatarData(
                agendamentoAtual.data
            )}

🕐 Horário: ${agendamentoAtual.horario.slice(
                0,
                5
            )}

🚗 Serviço: ${agendamentoAtual.servicos.join(
                " + "
            )}

✅ Confirmo meu atendimento.`;


        const url =
            `https://wa.me/${telefoneAutoClub}?text=${encodeURIComponent(
                mensagem
            )}`;


        window.open(
            url,
            "_blank"
        );

    }
);

