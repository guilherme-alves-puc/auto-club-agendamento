const opcoesServico = document.querySelectorAll(".opcao-servico");
const btnContinuar = document.querySelector("#btnContinuar");

let servicoSelecionado = null;
let duracaoSelecionada = null;

opcoesServico.forEach((opcao) => {

    opcao.addEventListener("click", () => {

        opcoesServico.forEach((item) => {
            item.classList.remove("selecionado");
        });

        opcao.classList.add("selecionado");

        servicoSelecionado = opcao.dataset.servico;
        duracaoSelecionada = opcao.dataset.duracao;

        btnContinuar.disabled = false;

        console.log("Serviço:", servicoSelecionado);
        console.log("Duração:", duracaoSelecionada);
    });

});