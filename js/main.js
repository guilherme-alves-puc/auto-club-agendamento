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


let servicoSelecionado = null;
let duracaoSelecionada = null;
let dataSelecionada = null;


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