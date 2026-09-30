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
   LOGIN
========================= */

const formLogin =
    document.querySelector("#formLogin");


if (formLogin) {

    const email =
        document.querySelector("#email");

    const senha =
        document.querySelector("#senha");

    const btnLogin =
        document.querySelector("#btnLogin");

    const mensagemErro =
        document.querySelector("#mensagemErro");


    formLogin.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            mensagemErro.textContent = "";

            btnLogin.disabled = true;

            btnLogin.textContent =
                "Entrando...";


            const {
                data,
                error
            } =
                await supabaseClient.auth
                    .signInWithPassword({

                        email:
                            email.value.trim(),

                        password:
                            senha.value

                    });


            if (error) {

                console.error(
                    "Erro no login:",
                    error
                );

                mensagemErro.textContent =
                    "E-mail ou senha inválidos.";

                btnLogin.disabled = false;

                btnLogin.textContent =
                    "Entrar";

                return;
            }


            console.log(
                "Usuário autenticado:",
                data.user
            );


            window.location.href =
                "./index.html";

        }
    );

}


/* =========================
   PROTEGER PAINEL
========================= */

const btnLogout =
    document.querySelector("#btnLogout");


if (btnLogout) {

    iniciarPainel();


    btnLogout.addEventListener(
        "click",
        async () => {

            await supabaseClient.auth.signOut();

            window.location.href =
                "./login.html";

        }
    );

}


async function protegerPainel() {

    const {
        data: {
            session
        }
    } =
        await supabaseClient.auth
            .getSession();


    if (!session) {

        window.location.href =
            "./login.html";

        return false;

    }


    console.log(
        "Administrador autenticado:",
        session.user.email
    );

    return true;

}

/* =========================
   INICIAR PAINEL
========================= */

async function iniciarPainel() {

    const autenticado =
        await protegerPainel();

    if (!autenticado) {
        return;
    }

    await carregarAgendamentosHoje();

    await carregarServicosAdmin();

}

/* =========================
   AGENDAMENTOS DE HOJE
========================= */

async function carregarAgendamentosHoje() {

    const listaAgendamentos =
        document.querySelector(
            "#listaAgendamentos"
        );

    const totalAgendamentos =
        document.querySelector(
            "#totalAgendamentos"
        );

    const dataHojeElemento =
        document.querySelector(
            "#dataHoje"
        );


    const hoje =
        new Date();


    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");


    const dataHoje =
        `${ano}-${mes}-${dia}`;


    dataHojeElemento.textContent =
        hoje.toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "long"
            }
        );


    const {
        data: agendamentos,
        error
    } =
        await supabaseClient
            .from("agendamentos")
            .select(`
                id,
                nome,
                telefone,
                veiculo,
                cor,
                servicos,
                horario,
                duracao_total,
                status
            `)
            .eq(
                "data",
                dataHoje
            )
            .order(
                "horario",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Erro ao carregar agendamentos:",
            error
        );

        listaAgendamentos.innerHTML =
            `
                <p>
                    Não foi possível carregar
                    os agendamentos.
                </p>
            `;

        return;

    }


    totalAgendamentos.textContent =
        agendamentos.length;


    if (
        agendamentos.length === 0
    ) {

        listaAgendamentos.innerHTML =
            `
                <div class="sem-agendamentos">

                    <strong>
                        Nenhum agendamento hoje
                    </strong>

                    <p>
                        A agenda está livre por enquanto.
                    </p>

                </div>
            `;

        return;

    }


    listaAgendamentos.innerHTML = "";


    agendamentos.forEach(
        (agendamento) => {

            const card =
                document.createElement(
                    "article"
                );


            card.classList.add(
                "agendamento-card"
            );


            const horario =
                agendamento.horario
                    .slice(0, 5);


            const servicos =
                agendamento.servicos
                    .join(" + ");


            card.innerHTML = `
                <div class="agendamento-horario">

                    <strong>
                        ${horario}
                    </strong>

                    <span>
                        ${formatarDuracaoAdmin(
                            agendamento.duracao_total
                        )}
                    </span>

                </div>


                <div class="agendamento-info">

                    <h3>
                        ${agendamento.nome}
                    </h3>

                    <p>
                        ${servicos}
                    </p>

                    <div class="agendamento-detalhes">

                        <span>
                            🚗 ${agendamento.veiculo}
                            • ${agendamento.cor}
                        </span>

                        <span>
                            📱 ${agendamento.telefone}
                        </span>

                    </div>

                </div>


                <div class="agendamento-acoes">

    <span
        class="status status-${agendamento.status}"
    >
        ${agendamento.status}
    </span>


    ${
        agendamento.status === "confirmado"
            ? `
                <div class="botoes-agendamento">

                    <button
                        type="button"
                        class="btn-concluir"
                        data-id="${agendamento.id}"
                    >
                        Concluir
                    </button>

                    <button
                        type="button"
                        class="btn-cancelar"
                        data-id="${agendamento.id}"
                    >
                        Cancelar
                    </button>

                </div>
            `
            : ""
    }

</div>
            `;


            listaAgendamentos.appendChild(
                card
            );

        }
    );

}


function formatarDuracaoAdmin(minutos) {

    if (minutos < 60) {
        return `${minutos} min`;
    }


    const horas =
        Math.floor(
            minutos / 60
        );

    const restantes =
        minutos % 60;


    if (restantes === 0) {

        return horas === 1
            ? "1h"
            : `${horas}h`;

    }


    return `${horas}h ${restantes}min`;

}

/* =========================
   AÇÕES DOS AGENDAMENTOS
========================= */

const listaAgendamentosAdmin =
    document.querySelector("#listaAgendamentos");

if (listaAgendamentosAdmin) {

    listaAgendamentosAdmin.addEventListener(
        "click",
        async (event) => {

            const botaoConcluir =
                event.target.closest(
                    ".btn-concluir"
                );

            const botaoCancelar =
                event.target.closest(
                    ".btn-cancelar"
                );


            if (botaoConcluir) {

                const id =
                    botaoConcluir.dataset.id;

                await atualizarStatusAgendamento(
                    id,
                    "concluido"
                );

                return;
            }


            if (botaoCancelar) {

                const id =
                    botaoCancelar.dataset.id;

                const confirmar =
                    confirm(
                        "Tem certeza que deseja cancelar este agendamento?"
                    );

                if (!confirmar) {
                    return;
                }

                await atualizarStatusAgendamento(
                    id,
                    "cancelado"
                );

            }

        }
    );

}

async function atualizarStatusAgendamento(
    id,
    novoStatus
) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("agendamentos")
            .update({
                status: novoStatus
            })
            .eq(
                "id",
                id
            )
            .select();


    if (error) {

        console.error(
            "Erro ao atualizar agendamento:",
            error
        );

        alert(
            "Não foi possível atualizar o agendamento."
        );

        return;
    }


    await carregarAgendamentosHoje();

}
/* =========================
   SERVIÇOS ADMIN
========================= */

const listaServicosAdmin =
    document.querySelector("#listaServicosAdmin");

const btnNovoServico =
    document.querySelector("#btnNovoServico");

const formServicoContainer =
    document.querySelector("#formServicoContainer");

const formServico =
    document.querySelector("#formServico");

const servicoId =
    document.querySelector("#servicoId");

const servicoNome =
    document.querySelector("#servicoNome");

const servicoDescricao =
    document.querySelector("#servicoDescricao");

const servicoDuracao =
    document.querySelector("#servicoDuracao");

const servicoPreco =
    document.querySelector("#servicoPreco");

const tituloFormServico =
    document.querySelector("#tituloFormServico");

const btnCancelarServico =
    document.querySelector("#btnCancelarServico");
    async function carregarServicosAdmin() {

    if (!listaServicosAdmin) {
        return;
    }


    listaServicosAdmin.innerHTML =
        "<p>Carregando serviços...</p>";


    const {
        data: servicos,
        error
    } =
        await supabaseClient
            .from("servicos")
            .select("*")
            .order(
                "nome",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Erro ao carregar serviços:",
            error
        );

        listaServicosAdmin.innerHTML =
            "<p>Não foi possível carregar os serviços.</p>";

        return;

    }


    listaServicosAdmin.innerHTML = "";


    servicos.forEach(
        (servico) => {

            const card =
                document.createElement(
                    "article"
                );


            card.classList.add(
                "servico-admin-card"
            );


            if (!servico.ativo) {

                card.classList.add(
                    "servico-inativo"
                );

            }


            const preco =
                Number(
                    servico.preco
                ).toLocaleString(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL"
                    }
                );


            card.innerHTML = `

                <div class="servico-admin-info">

                    <h3>
                        ${servico.nome}
                    </h3>

                    <p>
                        ${servico.descricao ?? ""}
                    </p>

                    <div class="servico-admin-meta">

                        <span>
                            ⏱ ${formatarDuracaoAdmin(
                                servico.duracao_minutos
                            )}
                        </span>

                        <span>
                            ${preco}
                        </span>

                        <span>
                            ${
                                servico.ativo
                                    ? "Ativo"
                                    : "Inativo"
                            }
                        </span>

                    </div>

                </div>


                <div class="servico-admin-acoes">

                    <button
                        type="button"
                        class="btn-editar-servico"
                        data-id="${servico.id}"
                    >
                        Editar
                    </button>


                    <button
                        type="button"
                        class="
                            btn-toggle-servico
                            ${
                                servico.ativo
                                    ? "btn-desativar"
                                    : "btn-ativar"
                            }
                        "
                        data-id="${servico.id}"
                        data-ativo="${servico.ativo}"
                    >
                        ${
                            servico.ativo
                                ? "Desativar"
                                : "Ativar"
                        }
                    </button>

                </div>

            `;


            listaServicosAdmin.appendChild(
                card
            );

        }
    );

}
if (btnNovoServico) {

    btnNovoServico.addEventListener(
        "click",
        () => {

            limparFormularioServico();

            tituloFormServico.textContent =
                "Novo serviço";

            formServicoContainer.classList.remove(
                "oculto"
            );

        }
    );

if (btnCancelarServico) {

    btnCancelarServico.addEventListener(
        "click",
        () => {

            formServicoContainer.classList.add(
                "oculto"
            );

            limparFormularioServico();

        }
    );

}}
if (formServico) {

    formServico.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const dadosServico = {

                nome:
                    servicoNome.value.trim(),

                descricao:
                    servicoDescricao.value.trim(),

                duracao_minutos:
                    Number(
                        servicoDuracao.value
                    ),

                preco:
                    Number(
                        servicoPreco.value
                    )

            };


            let error;


            /* EDITAR */

            if (servicoId.value) {

                const resultado =
                    await supabaseClient
                        .from("servicos")
                        .update(
                            dadosServico
                        )
                        .eq(
                            "id",
                            servicoId.value
                        );

                error =
                    resultado.error;

            }


            /* CADASTRAR */

            else {

                const resultado =
                    await supabaseClient
                        .from("servicos")
                        .insert({
                            ...dadosServico,
                            ativo: true
                        });

                error =
                    resultado.error;

            }


            if (error) {

                console.error(
                    "Erro ao salvar serviço:",
                    error
                );

                alert(
                    "Não foi possível salvar o serviço."
                );

                return;

            }


            formServicoContainer.classList.add(
                "oculto"
            );

            limparFormularioServico();

            await carregarServicosAdmin();

        }
    );

}
if (listaServicosAdmin) {

    listaServicosAdmin.addEventListener(
        "click",
        async (event) => {


            const btnEditar =
                event.target.closest(
                    ".btn-editar-servico"
                );


            const btnToggle =
                event.target.closest(
                    ".btn-toggle-servico"
                );


            /* =========================
               EDITAR
            ========================= */

            if (btnEditar) {

                await abrirEdicaoServico(
                    btnEditar.dataset.id
                );

                return;

            }


            /* =========================
               ATIVAR / DESATIVAR
            ========================= */

            if (btnToggle) {

                const id =
                    btnToggle.dataset.id;


                const estaAtivo =
                    btnToggle.dataset.ativo
                        === "true";


                const {
                    error
                } =
                    await supabaseClient
                        .from("servicos")
                        .update({
                            ativo:
                                !estaAtivo
                        })
                        .eq(
                            "id",
                            id
                        );


                if (error) {

                    console.error(
                        "Erro ao alterar serviço:",
                        error
                    );

                    alert(
                        "Não foi possível alterar o serviço."
                    );

                    return;

                }


                await carregarServicosAdmin();

            }

        }
    );

}
async function abrirEdicaoServico(id) {

    const {
        data: servico,
        error
    } =
        await supabaseClient
            .from("servicos")
            .select("*")
            .eq(
                "id",
                id
            )
            .single();


    if (error) {

        console.error(
            "Erro ao buscar serviço:",
            error
        );

        return;

    }


    servicoId.value =
        servico.id;

    servicoNome.value =
        servico.nome;

    servicoDescricao.value =
        servico.descricao ?? "";

    servicoDuracao.value =
        servico.duracao_minutos;

    servicoPreco.value =
        servico.preco;


    tituloFormServico.textContent =
        "Editar serviço";


    formServicoContainer.classList.remove(
        "oculto"
    );


    formServicoContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

function limparFormularioServico() {

    servicoId.value = "";

    servicoNome.value = "";

    servicoDescricao.value = "";

    servicoDuracao.value = "";

    servicoPreco.value = "";

}