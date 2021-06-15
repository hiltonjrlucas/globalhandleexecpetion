let grdUsuariosBloqueados;

$(function () {
    grdUsuariosBloqueados = DxDataGrid({ id: 'grdUsuariosBloqueados' }, getGridExtension());

    LoadUsuariosBloqueados();
});

function getGridExtension() {
    return {
        paging: { pageSize: 25 },
        searchPanel: {
            visible: true
        },
        export: {
            enabled: false
        },
        columnChooser: {
            enabled: false
        },
        columns: [
            { dataField: 'dsEmail', visible: false },
            { dataField: 'dsCelular', visible: false },
            {
                dataField: 'lnkUnlock',
                caption: '',
                width: '30px',
                cellTemplate: function (container, options) {
                    let d = options.row.data;
                    let template = "<a href='javascript:UnlockUser(" + JSON.stringify(d) + ")' id='lnkUnblock' title='Desbloquear'><i class='fa fa-lock text-info' style='font-size: 15px;'></i></a>";
                    $("<div>").append(template).appendTo(container);
                }
            },
            { dataField: 'cdLogin', caption: 'Evento', width: 70, encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'cdUsuario', caption: 'Descrição', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'dsUsuario', caption: 'Descrição', encodeHtml: false, alignment: 'left', showInColumnChooser: false }
        ]
    };
}

function LoadUsuariosBloqueados() {
    const data = { url: '/login/locked-users', body: null };
    const success = (response) => {
        if (response.success) {
            grdUsuariosBloqueados.option('dataSource', response.data);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function UnlockUser(param) {
    if (param) {
        const action = (result) => {
            if (result) {
                const obj = {
                    cdUsuario: param.cdUsuario,
                    dsCelular: param.dsCelular,
                    dsEmail: param.dsEmail,
                    cdCodigoAcesso: sessionStorage.getItem('usuario')
                };

                const data = { url: '/login/unlock-user', body: JSON.stringify(obj) };
                const success = (response) => {
                    if (response.success) {
                        if (response.data.unlocked) {
                            ShowMessage('success', `Usuário desbloqueado com sucesso. Uma senha temporária foi enviada para o usuário ${obj.cdUsuario}.`);
                        } else {
                            ShowMessage('error', response.data.message);
                        }
                    } else {
                        CheckError(response);
                    }
                };

                SaudeSegurancaPost(data, success, error);
            }
        };

        ShowDialog(`Tem certeza que deseja desbloquear o usuário ${param.cdUsuario}?`, action, DialogTypes.question, 'Confirmação de desbloqueio');
    }
}
