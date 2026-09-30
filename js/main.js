const SUPABASE_URL =
    "https://ejgulzbdlecqcyitjffk.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_gBHh_D1RNukjLyAmvZ1Aow_zXlHayCW";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

const opcoesServicoContainer =
    document.querySelector("#opcoesServico");

const btnContinuarServico =
    document.querySelector("#btnContinuarServico");

const btnVoltarServico =
    document.querySelector("#btnVoltarServico");

const btnContinuarData =
    document.querySelector("#btnContinuarData");

const etapaServico =
    document.querySelector("#etapaServico");

const etapaData =
    document.querySelector("#etapaData");

const dataAgendamento =
    document.querySelector("#dataAgendamento");

const resumoServico =
    document.querySelector("#resumoServico");

const listaDatas =
    document.querySelector("#listaDatas");

const etapaHorario =
    document.querySelector("#etapaHorario");

const btnVoltarData =
    document.querySelector("#btnVoltarData");

const btnContinuarHorario =
    document.querySelector("#btnContinuarHorario");

const listaHorarios =
    document.querySelector("#listaHorarios");

const resumoServicosHorario =
    document.querySelector("#resumoServicosHorario");

    const etapaDados =
    document.querySelector("#etapaDados");

const btnVoltarHorario =
    document.querySelector("#btnVoltarHorario");

const btnConfirmarAgendamento =
    document.querySelector("#btnConfirmarAgendamento");

const nomeCliente =
    document.querySelector("#nomeCliente");

const telefoneCliente =
    document.querySelector("#telefoneCliente");

const modeloVeiculo =
    document.querySelector("#modeloVeiculo");


const resumoFinalServicos =
    document.querySelector("#resumoFinalServicos");

const resumoFinalData =
    document.querySelector("#resumoFinalData");

const resumoFinalHorario =
    document.querySelector("#resumoFinalHorario");

    const corVeiculo =
    document.querySelector("#corVeiculo");


let dataSelecionada = null;
let horarioSelecionado = null


/* =========================
   SELEÇÃO DE SERVIÇO
========================= */


let servicosSelecionados = [];
let duracaoTotal = 0;

async function carregarServicos() {

    const { data, error } =
        await supabaseClient
            .from("servicos")
            .select("*")
            .eq("ativo", true)
            .order("nome");

    if (error) {

        console.error(
            "Erro ao carregar serviços:",
            error
        );

        opcoesServicoContainer.innerHTML = `
            <p>Não foi possível carregar os serviços.</p>
        `;

        return;
    }

    opcoesServicoContainer.innerHTML = "";

    data.forEach((servico) => {

        const botao =
            document.createElement("button");

        botao.type = "button";

        botao.classList.add(
            "opcao-servico"
        );

        botao.dataset.id =
            servico.id;

        botao.dataset.servico =
            servico.nome;

        botao.dataset.duracao =
            servico.duracao_minutos;

        botao.innerHTML = `
            <div>
                <strong>
                    ${servico.nome}
                </strong>

                <p>
                    ${servico.descricao ?? ""}
                </p>
            </div>

            <span>
                ${formatarDuracao(
                    servico.duracao_minutos
                )}
            </span>
        `;

        botao.addEventListener(
            "click",
            () => {

                botao.classList.toggle(
                    "selecionado"
                );

                atualizarServicosSelecionados();

            }
        );

        opcoesServicoContainer.appendChild(
            botao
        );

    });

}

function formatarDuracao(minutos) {

    if (minutos < 60) {
        return `${minutos} min`;
    }

    const horas =
        Math.floor(minutos / 60);

    const restantes =
        minutos % 60;

    if (restantes === 0) {
        return horas === 1
            ? "1 hora"
            : `${horas} horas`;
    }

    return `${horas}h ${restantes}min`;
}


function atualizarServicosSelecionados() {

    const selecionados =
        document.querySelectorAll(".opcao-servico.selecionado");

    servicosSelecionados = [];

    duracaoTotal = 0;

    selecionados.forEach((opcao) => {

        servicosSelecionados.push(
            opcao.dataset.servico
        );

        duracaoTotal +=
            Number(opcao.dataset.duracao);

    });

    btnContinuarServico.disabled =
        servicosSelecionados.length === 0;

    console.log(
        "Serviços:",
        servicosSelecionados
    );

    console.log(
        "Duração total:",
        duracaoTotal
    );

}


/* =========================
   IR PARA DATA
========================= */

btnContinuarServico.addEventListener(
    "click",
    () => {

        etapaServico.classList.remove("ativa");

        etapaData.classList.add("ativa");

        resumoServico.textContent =
    servicosSelecionados.join(" + ");

        atualizarProgresso(2);

    }
);


/* =========================
   VOLTAR PARA SERVIÇO
========================= */

btnVoltarServico.addEventListener(
    "click",
    () => {

        etapaData.classList.remove("ativa");

        etapaServico.classList.add("ativa");

        atualizarProgresso(1);

    }
);


/* =========================
   SELEÇÃO DE DATA
========================= */




/* =========================
   DATA MÍNIMA
========================= */

const hoje = new Date();

gerarDatasDisponiveis();


function gerarDatasDisponiveis() {

    const nomesDias = [
        "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"
    ];

    const nomesMeses = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];

    listaDatas.innerHTML = "";

    for (let i = 0; i < 8; i++) {

        const data = new Date();
        data.setDate(hoje.getDate() + i);

        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");

        const dataFormatada = `${ano}-${mes}-${dia}`;

        const card = document.createElement("button");
        card.type = "button";
        card.classList.add("data-card");

        if (i === 0) {
            card.classList.add("selecionada");
            dataSelecionada = dataFormatada;
            dataAgendamento.value = dataFormatada;
            btnContinuarData.disabled = false;
        }

        const titulo = i === 0 ? "Hoje" : i === 1 ? "Amanhã" : nomesDias[data.getDay()];

        card.innerHTML = `
            <small>${titulo}</small>
            <strong>${dia}</strong>
            <span>${nomesMeses[data.getMonth()]}</span>
        `;

        card.addEventListener("click", () => {

            document
                .querySelectorAll(".data-card")
                .forEach((item) => {
                    item.classList.remove("selecionada");
                });

            card.classList.add("selecionada");

            dataSelecionada = dataFormatada;
            dataAgendamento.value = dataFormatada;

            btnContinuarData.disabled = false;

            console.log(
                "Data selecionada:",
                dataSelecionada
            );

        });

        listaDatas.appendChild(card);
    }

}

/* =========================
   PROGRESSO
========================= */

function atualizarProgresso(etapaAtual) {

    const itens =
        document.querySelectorAll(
            ".progresso-item"
        );

    itens.forEach(
        (item, index) => {

            item.classList.remove("ativo");

            if (
                index < etapaAtual
            ) {

                item.classList.add("ativo");

            }

        }
    );

}

/* =========================
   IR PARA HORÁRIOS
========================= */

btnContinuarData.addEventListener("click", async () => {

    etapaData.classList.remove("ativa");

    etapaHorario.classList.add("ativa");

    resumoServicosHorario.textContent =
        servicosSelecionados.join(" + ");

    atualizarProgresso(3);

    await gerarHorarios();

});


/* =========================
   GERAR HORÁRIOS
========================= */

async function gerarHorarios() {

    listaHorarios.innerHTML =
        "<p>Carregando horários...</p>";

    horarioSelecionado = null;

    btnContinuarHorario.disabled = true;


    /* =========================
       DESCOBRIR DIA DA SEMANA
    ========================= */

    const data =
        new Date(`${dataSelecionada}T12:00:00`);

    const diaSemanaJs =
        data.getDay();

    /*
        JavaScript:
        0 domingo
        1 segunda
        ...
        6 sábado

        Nosso banco:
        0 segunda
        ...
        6 domingo
    */

    const diaSemana =
        diaSemanaJs === 0
            ? 6
            : diaSemanaJs - 1;


    /* =========================
       HORÁRIO DA LOJA
    ========================= */

    const {
        data: funcionamento,
        error: erroFuncionamento
    } =
        await supabaseClient
            .from("horarios_funcionamento")
            .select("*")
            .eq("dia_semana", diaSemana)
            .single();


    if (erroFuncionamento) {

        console.error(
            "Erro ao buscar funcionamento:",
            erroFuncionamento
        );

        listaHorarios.innerHTML =
            "<p>Não foi possível carregar os horários.</p>";

        return;
    }


    if (!funcionamento.aberto) {

        listaHorarios.innerHTML =
            "<p>A loja não abre nesta data.</p>";

        return;
    }


    /* =========================
       AGENDAMENTOS DO DIA
    ========================= */

    const {
        data: agendamentosExistentes,
        error: erroAgendamentos
    } =
        await supabaseClient
            .from("agendamentos")
            .select(
                "horario, duracao_total, status"
            )
            .eq(
                "data",
                dataSelecionada
            );


    if (erroAgendamentos) {

        console.error(
            "Erro ao buscar agendamentos:",
            erroAgendamentos
        );

        listaHorarios.innerHTML =
            "<p>Não foi possível verificar a disponibilidade.</p>";

        return;
    }


    /* Remove cancelados */

    const agendamentosAtivos =
        agendamentosExistentes.filter(
            (agendamento) =>
                agendamento.status !== "cancelado"
        );


    /* =========================
       CONVERTER FUNCIONAMENTO
    ========================= */

    const horaAbertura =
        converterHoraParaMinutos(
            funcionamento.hora_abertura
        );

    const horaFechamento =
        converterHoraParaMinutos(
            funcionamento.hora_fechamento
        );


    listaHorarios.innerHTML = "";


    /* =========================
       GERAR OPÇÕES
    ========================= */

    for (
        let inicio = horaAbertura;
        inicio + duracaoTotal <= horaFechamento;
        inicio += 60
    ) {

        const fim =
            inicio + duracaoTotal;


        /*
            Verifica se o novo intervalo
            bate com algum agendamento existente.
        */

        const existeConflito =
            agendamentosAtivos.some(
                (agendamento) => {

                    const inicioExistente =
                        converterHoraParaMinutos(
                            agendamento.horario
                        );

                    const fimExistente =
                        inicioExistente +
                        agendamento.duracao_total;


                    return (
                        inicio < fimExistente &&
                        fim > inicioExistente
                    );

                }
            );


        /*
            Se existe conflito,
            não mostramos esse horário.
        */

        if (existeConflito) {
            continue;
        }


        const horario =
            converterMinutosParaHora(
                inicio
            );


        const botao =
            document.createElement(
                "button"
            );

        botao.type = "button";

        botao.classList.add(
            "horario-card"
        );

        botao.textContent =
            horario;


        botao.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".horario-card"
                    )
                    .forEach(
                        (item) => {

                            item.classList.remove(
                                "selecionado"
                            );

                        }
                    );


                botao.classList.add(
                    "selecionado"
                );

                horarioSelecionado =
                    horario;

                btnContinuarHorario.disabled =
                    false;

            }
        );


        listaHorarios.appendChild(
            botao
        );

    }


    /* =========================
       NENHUM HORÁRIO
    ========================= */

    if (
        listaHorarios.children.length === 0
    ) {

        listaHorarios.innerHTML =
            "<p>Não há horários disponíveis para esta data.</p>";

    }

}

function converterHoraParaMinutos(hora) {

    const [horas, minutos] =
        hora.split(":").map(Number);

    return horas * 60 + minutos;
}


function converterMinutosParaHora(totalMinutos) {

    const horas =
        Math.floor(totalMinutos / 60);

    const minutos =
        totalMinutos % 60;

    return (
        `${String(horas).padStart(2, "0")}:` +
        `${String(minutos).padStart(2, "0")}`
    );

}

/* =========================
   VOLTAR PARA DATA
========================= */

btnVoltarData.addEventListener("click", () => {

    etapaHorario.classList.remove("ativa");

    etapaData.classList.add("ativa");

    atualizarProgresso(2);

});

btnContinuarHorario.addEventListener("click", () => {

    etapaHorario.classList.remove("ativa");

    etapaDados.classList.add("ativa");

    resumoFinalServicos.textContent =
        servicosSelecionados.join(" + ");

    resumoFinalData.textContent =
        formatarData(dataSelecionada);

    resumoFinalHorario.textContent =
        horarioSelecionado;

    atualizarProgresso(4);

});

function formatarData(data) {

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

btnVoltarHorario.addEventListener("click", () => {

    etapaDados.classList.remove("ativa");

    etapaHorario.classList.add("ativa");

    atualizarProgresso(3);

});

const camposObrigatorios = [
    nomeCliente,
    telefoneCliente,
    modeloVeiculo,
    corVeiculo
];

camposObrigatorios.forEach((campo) => {

    campo.addEventListener("input", validarFormulario);

});


function validarFormulario() {

    const formularioValido =
        camposObrigatorios.every((campo) =>
            campo.value.trim() !== ""
        );

    btnConfirmarAgendamento.disabled =
        !formularioValido;
}


/* =========================
   CONFIRMAR AGENDAMENTO
========================= */

btnConfirmarAgendamento.addEventListener(
    "click",
    async () => {

        btnConfirmarAgendamento.disabled = true;

        btnConfirmarAgendamento.textContent =
            "Confirmando...";


        const {
            data: agendamentoCriado,
            error
        } =
            await supabaseClient.rpc(
                "criar_agendamento_seguro",
                {

                    p_nome:
                        nomeCliente.value.trim(),

                    p_telefone:
                        telefoneCliente.value.trim(),

                    p_veiculo:
                        modeloVeiculo.value.trim(),

                    p_cor:
                        corVeiculo.value.trim(),

                    p_servicos:
                        servicosSelecionados,

                    p_data:
                        dataSelecionada,

                    p_horario:
                        horarioSelecionado

                }
            );


        /* =========================
           ERRO
        ========================= */

        if (error) {

            console.error(
                "Erro ao criar agendamento:",
                error
            );


            if (
                error.message.includes(
                    "não está mais disponível"
                )
            ) {

                alert(
                    "Esse horário acabou de ser reservado por outro cliente. Escolha outro horário."
                );

                etapaDados.classList.remove(
                    "ativa"
                );

                etapaHorario.classList.add(
                    "ativa"
                );

                atualizarProgresso(3);

                await gerarHorarios();

            } else {

                alert(
                    error.message ||
                    "Não foi possível confirmar o agendamento."
                );

            }


            btnConfirmarAgendamento.disabled =
                false;

            btnConfirmarAgendamento.textContent =
                "Confirmar agendamento";

            return;
        }


        /* =========================
           SUCESSO
        ========================= */

        console.log(
            "Agendamento criado:",
            agendamentoCriado
        );

        alert(
            "Agendamento confirmado com sucesso!"
        );

        btnConfirmarAgendamento.textContent =
            "Agendamento confirmado ✓";

        btnConfirmarAgendamento.disabled =
            true;

    }
);


/* =========================
   CARREGAR SERVIÇOS
========================= */

carregarServicos();