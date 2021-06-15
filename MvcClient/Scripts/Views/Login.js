let txtLogin = null;
let txtPassword = null;
let btnLogin = null;
let loadPanel = null;

$(document).on('keypress', function (e) {
    if (e.which === 13) {
        txtPassword.blur();
        Login();
    }
});

$(document).ready(function () {

    let myColors = new Array();
    myColors[0] = "#0055B8";
    myColors[1] = "#F5CE3E";
    myColors[2] = "#6ABF4B";
    myColors[3] = "#FF9300";
    myColors[4] = "#87D1E6";
    myColors[5] = "#773DBD";

    let rand = Math.floor(Math.random() * myColors.length);
    $('#btnLogin').css("background-color", myColors[rand]);


    let usuario = sessionStorage.getItem('usuario');
    let url = new URL(window.location.href);

    if (usuario && (url.searchParams.get("Authenticated") !== "False")) {
        Home();
    }

    InitializeComponents();

    $("#txtLogin").dxTextBox('instance').focus();

});

function InitializeComponents() {
    txtLogin = DxTextBox({ id: 'txtLogin' }, {
        showClearButton: true,
        placeholder: 'Ex: 999999999'
    });

    txtPassword = DxTextBox({ id: 'txtPassword' }, {
        mode: 'password',
        showClearButton: true,
        placeholder: 'Senha Quiosque HCM',
        buttons: ['clear', {
            name: 'password',
            location: 'after',
            options: {
                icon: 'fa fa-eye', stylingMode: 'text',
                onClick: function () {
                    txtPassword.option('mode', txtPassword.option('mode') === 'text' ? 'password' : 'text');
                }
            }
        }]
    });

    btnLogin = DxButton({ id: 'btnLogin' }, {
        text: 'Login',
        onClick: function () {
            Login();
        }
    });
}

function Login() {
    let usuario = txtLogin.option('value');
    let senha = txtPassword.option('value');

    if (usuario && senha) {
        GenerateToken(usuario, senha, '1');
    }
    else {
        ShowMessage('error', 'Campos obrigatórios em branco!');
    }
}

function GenerateToken(usuario, senha, tpAutenticacao) {
    const url = '/Login/GenerateToken';
    const data = { userID: usuario, accessKey: senha, tpAutenticacao: tpAutenticacao };
    const success = (response) => {
        if (response.success) {
            if (response.data.authenticated) {
                console.log(response.data);
                sessionStorage.setItem('usuario', usuario);
                sessionStorage.setItem('claims', JSON.stringify(response.data.claims));
                sessionStorage.setItem('userAreaMedica', response.data.userAreaMedica);
                Home();
            }
            else if (['1', '2'].includes(response.data.message)) {
                if (response.data.message === '1') {
                    message = 'Usuário não encontrado, verifique se informou a matrícula correta.';
                }
                if (response.data.message === '2') {
                    message = 'Usuário bloqueado, favor entrar em contato com o RH para solicitar o desbloqueio.';
                }

                ShowMessage('error', message);
            } else {
                ShowMessage('error', 'Erro de autenticação: Verifique o usuário e a senha!');
            }
        }
        else {
            ShowMessage('error', 'Erro na geração do token: ' + response.message);
        }
    };

    Post(url, data, success, error);
}

function Home() {
    if (CheckMobile() && CheckClaim('acesso_registroPonto', 'True')) {
        window.location.href = window.location.protocol + '//' + window.location.host + '/RegistroPonto';
    } else {
        window.location.href = window.location.protocol + '//' + window.location.host + '/Home';
    }
}
