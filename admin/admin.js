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


                <div class="agendamento-status">

                    <span
                        class="status status-${agendamento.status}"
                    >
                        ${agendamento.status}
                    </span>

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