let txtMatricula;
let txtCelular;
let txtEmail;
let btnValidar;
let btnCancelar;
let btnVerificar;
let txtAccessCode;
let btnValidarAutenticacao;
let requestedQuestion = [];

const grupoValidacao = 'change_password_hcm';
$(document).ready(function () {
    initializeComponents();
});

const blockedUser = (msg) => {
    ShowDialog(msg,
                () => window.location.href = '/',
                DialogTypes.error);
};

const initializeComponents = () => {
    $('#matricula').css('display', '');
    $('#contato').css('display', 'none');
    $('#divQuestionario').css('display', 'none');
    requestedQuestions = [];
    accessFailedCound = 0;

    $('#h3LoginTitle').text(getMode());

    const onClickValidar = () => {
        if (returnDevExpressValidacao(grupoValidacao)) {
            start();
        }
    }

    txtMatricula = DxTextBox({ id: 'txtMatricula' },
        {
            showClearButton: true,
            maxLength: 9,
            placeholder: 'Ex: 999999999',
            onEnterKey: (e) => {
                onClickValidar();
            }
        },
        {
            validationGroup: grupoValidacao, rules: ['required', 'numeric'], name: 'Matrícula',
            validationRules: [{
                type: "custom",
                validationCallback: (e) => e.value.length === 9,
                message: "A Matrícula está incompleta."
            }]
        });

    txtCelular = DxTextBox({ id: 'txtCelular' }, {
        showClearButton: true,
        mask: "(00) 00000-0000",
        onEnterKey: (e) => {
            onClickValidar();
        }
    }, { validationGroup: grupoValidacao, rules: ['required'], name: 'Celular' });

    txtEmail = DxTextBox({ id: 'txtEmail' }, {
        showClearButton: true,
        placeholder: 'Ex: joao',
        buttons: [{
            name: "btnVicunha",
            location: "after",
            options: {
                type: "normal",
                text: '@vicunha.com.br'
            }
        }],
        onEnterKey: (e) => {
            onClickValidar();
        }
    });

    txtMatricula.focus();

    btnValidar = DxButton({ id: 'btnValidar' }, {
        text: 'Enviar',
        width: 120,
        validationGroup: grupoValidacao,
        onClick: (e) => {
            onClickValidar();
        }
    });

    btnCancelar = DxButton({ id: 'btnCancelar' }, {
        text: 'Cancelar',
        type: 'Normal',
        onClick: () => window.location.href = '/'
    });

    $('#h5Questions').css('display', 'none');
};

const start = () => {
    const url = `/Conta/RequestQuestions?cdUsuario=${txtMatricula.option('value')}`;
    const success = (response) => {
        if (response.success) {
            requestedQuestions = response.data;
            initializeQuestion();
        }
        else {
            blockedUser("Usuário irregular, favor entrar em contato com o RH da empresa!");
        }
    };

    Get(url, null, success, error, "Inicializando questões...");
};

const buildQuestion = (data) => {
    if (data) {

        $("#lblQuestion").text(`${requestedQuestions.filter(el => el.dsResposta).length + 1}/5 - ${data.dsQuestao}`);

        btnVerificar = DxButton({ id: 'btnVerificar' }, {
            text: 'Validar',
            disabled: true,
            onClick: (e) => {
                const dsResposta = $("#rbgOptions").dxRadioGroup('instance').option('value');
                if (dsResposta) {
                    const index = requestedQuestions.findIndex(f => f.cdQuestao === data.cdQuestao);
                    if (index >= 0) {
                        requestedQuestions[index].dsResposta = dsResposta;
                    }

                    initializeQuestion();

                } else {
                    ShowMessage('warning', 'Você precisa selecionar uma das opções!');
                }
            }
        });

        DxRadioGroup({ id: 'rbgOptions' }, {
            dataSource: data.opcoes.sort(function () {
                return Math.round(Math.random()) - 0.5;
            }),
            displayExpr: 'dsOpcao',
            valueExpr: 'dsOpcao',
            layout: 'vertical',
            onValueChanged: (e) => {
                if (e.value) {
                    btnVerificar.option('disabled', false);
                }
            }
        });

        $('#matricula').css('display', 'none');
        $('#contato').css('display', 'none');
        $('#divQuestionario').css('display', '');

        return;
    } else {
        validateQuestions();
    }
};

function initializeQuestion() {
    const question = requestedQuestions.find(el => !el.dsResposta)
    buildQuestion(question);
};

function validateQuestions() {
    const validation = {
        cdUsuario: txtMatricula.option('value'),
        dsCelular: txtCelular.option('value'),
        dsEmail: `${txtEmail.option('value').split('@')[0]}` || '',
        respostas: requestedQuestions
    };
    const url = '/Conta/ValidateQuestions';
    const data = { body: JSON.stringify(validation) };
    const success = (response) => {
        if (response.success) {
            validate();
            return;

            
        } else {
            blockedUser("Alguma alternativa escolhida estava incorreta! Tente novamente!");
        }
    };
    Post(url, data, success, error, "Validando respostas...");
};

function validate() {
    $('#h4Mensagem').text(`Olá, enviamos um SMS ${txtEmail.option('value').split('@')[0] ? 'e um e-mail' : ''}
                                    com o código de validação. Digite abaixo o código recebido e confirme sua identidade.`);
    txtAccessCode = DxTextBox(
        { id: 'txtAccessCode' },
        {
            maxLength: 6,
            placeholder: '999999',
            onEnterKey: (e) => {
                clickValidarAutenticacao();
            }
        }
    );

    btnValidarAutenticacao = DxButton({ id: 'btnValidarAutenticacao' }, {
        icon: 'check',
        text: 'Validar',
        type: 'default',
        onClick: () => {
            clickValidarAutenticacao();
        }
    });
    
    $('#modalValidacaoUsuario').modal({ backdrop: 'static' });
    txtAccessCode.focus();
    
};

function clickValidarAutenticacao() {
    if (txtAccessCode.option('value').length == 6) {
        const dataValidation = {
            cdUsuario: txtMatricula.option('value'),
            dsCelular: txtCelular.option('value'),
            dsEmail: `${txtEmail.option('value').split('@')[0]}` || '',
            cdCodigoAcesso: txtAccessCode.option('value')
        };
        const body = {
            url: '/login/validate/', body: JSON.stringify(dataValidation)
        };
        const success = (response) => {
            if (response.success && response.data.reseted) {
                const message = `Código validado com sucesso. Sua nova senha foi enviada para o número
                                ${txtEmail.option('value').split('@')[0] ? 'e e-mail informados.' : 'informado.'}`;
                ShowDialog(message,
                    () => {
                        $('#modalValidacaoUsuario').modal('hide');
                        window.location.href = '/';
                    },
                    DialogTypes.success,
                    'Senha resetada');
            } else {
                ShowMessage('error', response.message);
                txtAccessCode.reset();
                txtAccessCode.focus();
            }
        };

        SaudeSegurancaPost(body, success, error).then(x => { });
    } else {
        ShowMessage('error', "O código de acesso é composto por 6 dígitos");
    }
}

const getMode = () => {
    const param = new URLSearchParams(location.search);

    return param.get('modo') === '1' ? 'Primeiro acesso' : 'Esqueci minha Senha(HCM)';
};
