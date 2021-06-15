let txtSenhaAtual;
let txtNovaSenha;
let txtConfirmacaoSenha;
let btnConfirmar;
let btnCancelar;

const grupoValidacao = 'validacaoSenha';

$(function () {
    const usuario = sessionStorage.getItem('nomeUsuario');
    if (usuario) {
        $('#spanBemVindo').text(usuario);
    }
    
    $('#btnAlterarSenha').click(function () {
        InitializeAlterarSenha();
    });

    VerificarAcessoTemporario();
});

function InitializeAlterarSenha() {
    $("#divSenhaValidacoes").dxValidationSummary({
        validationGroup: grupoValidacao
    });

    txtSenhaAtual = DxTextBox(
        { id: 'txtSenhaAtual' },
        {
            mode: 'password',
            showClearButton: true,
            placeholder: 'Senha atual',
            buttons: ['clear', {
                name: 'password',
                location: 'after',
                options: {
                    icon: 'fa fa-eye', stylingMode: 'text',
                    onClick: () => {
                        txtSenhaAtual.option('mode', txtSenhaAtual.option('mode') === 'text' ? 'password' : 'text');
                    }
                }
            }]
        },
        {
            rules: ['required'],
            validationGroup: grupoValidacao,
            name: 'Senha atual'
        }
    );
    txtNovaSenha = DxTextBox(
        { id: 'txtNovaSenha' },
        {
            mode: 'password',
            showClearButton: true,
            placeholder: 'Nova senha para o Quiosque HCM',
            buttons: ['clear', {
                name: 'password',
                location: 'after',
                options: {
                    icon: 'fa fa-eye', stylingMode: 'text',
                    onClick: () => {
                        txtNovaSenha.option('mode', txtNovaSenha.option('mode') === 'text' ? 'password' : 'text');
                    }
                }
            }]
        }, {
            rules: ['required'],
            validationGroup: grupoValidacao,
            validationRules: [
                {
                    type: "pattern",
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@\[\]{};'"!#$%¨&*()_+\-=§¹²³£¢¬:.>,<\\|\/ºª`´^~]{8,}$/,
                    message: "A senha deve ser composta por: letras minúsculas e maiúsculas, números, caracteres especiais e ter pelo menos 8 dígitos."
                }
            ],
            name: 'Nova senha'
        }
    );
    txtConfirmacaoSenha = DxTextBox(
        { id: 'txtConfirmacaoSenha' },
        {
            mode: 'password',
            showClearButton: true,
            placeholder: 'Confirmar senha para o Quiosque HCM',
            buttons: ['clear', {
                name: 'password',
                location: 'after',
                options: {
                    icon: 'fa fa-eye', stylingMode: 'text',
                    onClick: () => {
                        txtConfirmacaoSenha.option('mode', txtConfirmacaoSenha.option('mode') === 'text' ? 'password' : 'text');
                    }
                }
            }]
        }, {
            rules: ['required'],
            validationGroup: grupoValidacao,
            validationRules: [{
                type: "custom",
                validationCallback: (e) => e.value === txtNovaSenha.option('value'),
                message: "A senha não corresponde com a nova senha."
            }],
            name: 'Confirmar senha'
        });

    btnConfirmar = DxButton({ id: 'btnConfirmar' }, {
        text: 'Confirmar',
        icon: 'check',
        validationGroup: grupoValidacao,
        onClick: (e) => {
            e.event.preventDefault();

            const validation = e.validationGroup.validate();
            if (validation.isValid) {
                AlterarSenha();
            }
        }
    });
    btnCancelar = DxButton({ id: 'btnCancelar' }, {
        text: 'Cancelar',
        icon: 'arrowleft',
        type: 'normal',
        onClick: () => {
            $('#modalAlterarSenha').modal('hide');
        }
    });

    $('#modalAlterarSenha').modal({ backdrop: 'static' });
}

function AlterarSenha() {
    const param = {
        cdUsuario: sessionStorage.getItem('usuario'),
        stSenha: txtSenhaAtual.option('value'),
        stSenhaNova: txtNovaSenha.option('value'),
        stConfirmSenha: txtConfirmacaoSenha.option('value')
    };
    const data = { url: '/login/change-password', body: JSON.stringify(param) };
    const success = (response) => {
        if (response.success) {
            if (response.data.changed) {
                ShowDialog(response.data.message, () => {
                    InitializeAlterarSenha();

                    $('#modalAlterarSenha').modal('hide');
                }, DialogTypes.success, 'Senha atualizada');
            } else {
                ShowMessage('error', response.data.message);
            }
        } else {
            ShowMessage('error', response.message);
        }
    };

    SaudeSegurancaPut(data, success, error);
}

function VerificarAcessoTemporario() {
    const data = { url: `/login/check-need-change/${sessionStorage.getItem('usuario')}`, body: null };
    const success = (response) => {
        if (response.success) {
            if (response.data) {
                $('#btnAlterarSenha').click();
            }
        } else {
            ShowMessage(response.message);
        }
    };

    SaudeSegurancaGet(data, success, error);
}