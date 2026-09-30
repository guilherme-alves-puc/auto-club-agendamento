const SUPABASE_URL =
    "https://ejgulzbdlecqcyitjffk.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_gBHh_D1RNukjLyAmvZ1Aow_zXlHayCW";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


const formLogin =
    document.querySelector("#formLogin");

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