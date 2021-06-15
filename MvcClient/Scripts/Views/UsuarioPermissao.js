const recursoApi = '/cadastro-usuario-permissao';
var slbFilial = null;
var slbGrupo = null;
var txtUsuario = null;
var btnCancelar = null;
var btnSalvar = null;
var grdUsuariosPermissao = null;
var dscUsuariosPermissao = new DevExpress.data.DataSource({});
var cdUsuarioUpdate = null;

$(document).ready(function () {
    InitializeComponents();    
    GetFiliais();
    GetGrupos();
    GetUsuariosPermissao();
});

function InitializeComponents() {
    slbFilial = DxSelectBox({ id: 'slbFilial', description: 'cdFilial', value: 'cdFilial' }, {});

    txtUsuario = DxTextBox({ id: 'txtUsuario' }, {});

    slbGrupo = DxSelectBox({ id: 'slbGrupo', description: 'dsGrupo', value: 'cdGrupo' }, {});

    btnCancelar = DxButton({ id: 'btnCancelar' }, {
        icon: 'clear',
        type: 'normal',
        text: 'Cancelar',
        width: 120,
        onClick: function (e) {
            Clear();
        }
    });

    btnSalvar = DxButton({ id: 'btnSalvar' }, {
        icon: 'save',
        text: 'Salvar',
        width: 120,
        onClick: function (e) {
            Save();
        }
    });

    //- Colunas que serão ocultas ao exportar para excel
    let gridExport = new GridExportHide(['lnkEdit', 'lnkDelete']);

    dxGridOptionsExtension = {
        onExporting: gridExport.onExporting,
        onExported: gridExport.onExported,
        dataSource: dscUsuariosPermissao,
        paging: { pageSize: 10 },
        searchPanel: {
            visible: true
        },
        export: {
            enabled: true
        },
        columnChooser: {
            enabled: false
        },
        columns: [
            {
                dataField: 'lnkEdit',
                caption: '',
                width: '30px',
                allowFiltering: false,
                allowSorting: false,
                cellTemplate: function (container, options) {
                    var d = options.row.data;
                    var template = "<a href='javascript:LoadFields(\"" +
                        d.cdUsuarioPermissao + "\")' id='lnkEdit' title=''><i class='fa fa-pencil text-info' style='font-size: 15px;'></i></a>";
                    $('<div>').append(template).appendTo(container);
                }
            },
            {
                dataField: 'lnkDelete',
                caption: '',
                width: '30px',
                allowFiltering: false,
                allowSorting: false,
                cellTemplate: function (container, options) {
                    var d = options.row.data;
                    var template = "<a href='javascript:DeleteField(\"" +
                        d.cdUsuarioPermissao + "\")' id='lnkDelete' title=''><i class='fa fa-trash text-info' style='font-size: 15px;'></i></a>";
                    $('<div>').append(template).appendTo(container);
                }
            },
            { dataField: 'cdFilial', caption: 'Filial', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'cdUsuario', caption: 'Usuário', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'grupoUsuario.dsGrupo', caption: 'Grupo', encodeHtml: false, alignment: 'left', showInColumnChooser: false }
        ]
    };

    grdUsuariosPermissao = DxDataGrid({ id: 'grdUsuariosPermissao' }, dxGridOptionsExtension);
}

function GetUsuariosPermissao() {
    const data = { url: recursoApi };
    const success = (response) => {
        if (response.success) {
            dscUsuariosPermissao = new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    let d = $.Deferred();

                    d.resolve(response.data, {});

                    return d.promise();
                }
            });

            dscUsuariosPermissao.load();

            grdUsuariosPermissao.option('dataSource', dscUsuariosPermissao);
            grdUsuariosPermissao.refresh();
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function Clear() {
    slbFilial.reset();
    slbGrupo.reset();
    txtUsuario.option('value', '');
    slbFilial.option('readOnly', false);
    txtUsuario.option('readOnly', false);
    cdUsuarioUpdate = null;
}

function CheckFields() {
    let isValid = true;

    if (!slbFilial.option('value')) {
        isValid = false;
    }

    if (!txtUsuario.option('value')) {
        isValid = false;
    }

    if (!slbGrupo.option('value')) {
        isValid = false;
    }

    return isValid;
}

function Save() {
    if (CheckFields()) {
        let usuarioPermissao = null;

        if (cdUsuarioUpdate) {
            usuarioPermissao = GetUsuarioPermissao(cdUsuarioUpdate);
        }
        else {
            usuarioPermissao = GetUsuarioPermissao();
        }

        const data = { url: recursoApi, body: JSON.stringify(usuarioPermissao) };

        const success = (response) => {
            if (response.data) {
                GetUsuariosPermissao();

                if (cdUsuarioUpdate) {
                    ShowMessage('success', 'Permissão do usuário atualizada com sucesso!');
                }
                else {
                    ShowMessage('success', 'Permissão do usuário cadastrada com sucesso!');
                }

                Clear();
            }
            else {
                CheckError(response);
            }
        };

        if (cdUsuarioUpdate) {
            SaudeSegurancaPut(data, success, error);
        }
        else {
            SaudeSegurancaPost(data, success, error);
        }

    }
    else {
        ShowMessage('error', 'Campo obrigatório vazio. Verifique!');
    }
}

function GetUsuarioPermissao(cdUsuarioPermissao) {
    if (cdUsuarioPermissao) {
        return {
            cdUsuarioPermissao: cdUsuarioPermissao,
            cdFilial: slbFilial.option('value'),
            cdUsuario: txtUsuario.option('value'),
            cdGrupo: slbGrupo.option('value')
        };
    }
    else {
        return {            
            cdFilial: slbFilial.option('value'),
            cdUsuario: txtUsuario.option('value'),
            cdGrupo: slbGrupo.option('value')
        };
    }
}

function LoadFields(cdKey) {
    const data = { url: recursoApi + '/' + cdKey };
    const success = (response) => {
        if (response.success) {
            cdUsuarioUpdate = response.data.cdUsuarioPermissao;
            slbFilial.option('value', response.data.cdFilial);
            slbFilial.option('readOnly', true);
            slbGrupo.option('value', response.data.cdGrupo);
            txtUsuario.option('value', response.data.cdUsuario);
            txtUsuario.option('readOnly', true);
        }
        else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function DeleteField(cdKey) {
    let result = DevExpress.ui.dialog.confirm('<i>Deseja excluir a permissão do usuário?</i>', 'Confirma exclusão');

    result.done(function (dialogResult) {
        if (dialogResult) {
            const data = { url: recursoApi + '/' + cdKey };
            const success = (response) => {
                if (response.success) {
                    GetUsuariosPermissao();
                    Clear();
                    ShowMessage('success', 'Permissão do usuário excluida com sucesso!');
                } else {
                    CheckError(response);
                }
            };

            SaudeSegurancaDelete(data, success, error);
        }
        else {
            ShowMessage('warning', 'Exclusão cancelada pelo usuário');
        }
    });
}

function GetFiliais() {
    const data = { url: '/cadastro-de-filial' };

    const success = (response) => {
        if (response.success) {
            slbFilial.option('dataSource', response.data);
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function GetGrupos() {
    const data = { url: '/cadastro-grupo-usuario' };

    const success = (response) => {
        if (response.success) {
            slbGrupo.option('dataSource', response.data);
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}