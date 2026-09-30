const opcoesServico = document.querySelectorAll(".opcao-servico");

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

opcoesServico.forEach((opcao) => {

    opcao.addEventListener("click", () => {

        opcao.classList.toggle("selecionado");

        atualizarServicosSelecionados();

    });

});


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

btnContinuarData.addEventListener("click", () => {

    etapaData.classList.remove("ativa");

    etapaHorario.classList.add("ativa");

    resumoServicosHorario.textContent =
        servicosSelecionados.join(" + ");

    gerarHorarios();

    atualizarProgresso(3);
});

/* =========================
   HORÁRIOS
========================= */

function gerarHorarios() {

    const horarios = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00"
    ];

    listaHorarios.innerHTML = "";

    horarioSelecionado = null;

    btnContinuarHorario.disabled = true;

    horarios.forEach((horario) => {

        const botao =
            document.createElement("button");

        botao.type = "button";

        botao.classList.add("horario-card");

        botao.textContent = horario;

        botao.addEventListener("click", () => {

            document
                .querySelectorAll(".horario-card")
                .forEach((item) => {
                    item.classList.remove("selecionado");
                });

            botao.classList.add("selecionado");

            horarioSelecionado = horario;

            btnContinuarHorario.disabled = false;

            console.log(
                "Horário selecionado:",
                horarioSelecionado
            );

        });

        listaHorarios.appendChild(botao);

    });

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