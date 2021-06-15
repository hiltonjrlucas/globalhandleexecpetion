const recursoApi = '/cadastro-grupo-usuario'
var nbbCodigo = null;
var txtDescricao = null;
var btnCancelar = null;
var btnSalvar = null;
var grdGrupoUsuarios = null;
var dscGrupoUsuarios = new DevExpress.data.DataSource({});
var cdGrupoUpdate = null;

$(document).ready(function () {
    InitializeComponents();
    GetGrupoUsuarios();
});

function InitializeComponents() {
    nbbCodigo = DxNumberBox({ id: 'nbbCodigo' }, {});
    txtDescricao = DxTextBox({ id: 'txtDescricao' }, {});

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
        dataSource: dscGrupoUsuarios,
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
                    var d = options.row.data
                    var template = "<a href='javascript:LoadFields(\"" +
                        d.cdGrupo + "\")' id='lnkEdit' title=''><i class='fa fa-pencil text-info' style='font-size: 15px;'></i></a>";
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
                    var d = options.row.data
                    var template = "<a href='javascript:DeleteField(\"" +
                        d.cdGrupo + "\")' id='lnkDelete' title=''><i class='fa fa-trash text-info' style='font-size: 15px;'></i></a>";
                    $('<div>').append(template).appendTo(container);
                }
            },
            { dataField: 'cdGrupo', caption: 'Código', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'dsGrupo', caption: 'Descrição', encodeHtml: false, alignment: 'left', showInColumnChooser: false }
        ]
    };

    grdGrupoUsuarios = DxDataGrid({ id: 'grdGrupoUsuarios' }, dxGridOptionsExtension);
}

function GetGrupoUsuarios() {
    const data = { url: recursoApi }

    const success = (response) => {
        if (response.success) {
            dscGrupoUsuarios = new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    let d = $.Deferred();

                    d.resolve(response.data, {});

                    return d.promise();
                }
            });

            dscGrupoUsuarios.load();

            grdGrupoUsuarios.option('dataSource', dscGrupoUsuarios);
            grdGrupoUsuarios.refresh();
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function Clear() {
    nbbCodigo.option('value', null);
    nbbCodigo.option('readOnly', false);
    txtDescricao.option('value', '');
    cdGrupoUpdate = null;
}

function CheckFields() {
    let isValid = true;

    if (!nbbCodigo.option('value')) {
        isValid = false;
    }

    if (!txtDescricao.option('value')) {
        isValid = false;
    }

    return isValid;
}

function Save() {
    if (CheckFields()) {
        let grupoUsuario = null;
        let data = null;

        if (cdGrupoUpdate) {
            grupoUsuario = GetGrupoUsuario(cdGrupoUpdate);
        }
        else {
            grupoUsuario = GetGrupoUsuario();
        }

        data = { url: recursoApi, body: JSON.stringify(grupoUsuario) }

        const success = (response) => {
            if (response.data) {
                GetGrupoUsuarios();

                if (cdGrupoUpdate) {
                    ShowMessage('success', 'Grupo de usuário atualizado com sucesso!');
                }
                else {
                    ShowMessage('success', 'Grupo de usuário cadastrado com sucesso!');
                }

                Clear();
            }
            else {
                CheckError(response);
            }
        }

        if (cdGrupoUpdate) {
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

function GetGrupoUsuario(cdGrupo) {
    if (cdGrupo) {
        return {
            cdGrupo: cdGrupo,
            dsGrupo: txtDescricao.option('value')
        }
    }
    else {
        return {
            cdGrupo: nbbCodigo.option('value'),
            dsGrupo: txtDescricao.option('value')
        }
    }
}

function LoadFields(cdGrupo) {
    const data = { url: recursoApi + '/' + cdGrupo }

    const success = (response) => {
        if (response.success) {
            cdGrupoUpdate = response.data.cdGrupo;
            nbbCodigo.option('value', response.data.cdGrupo);
            nbbCodigo.option('readOnly', true);
            txtDescricao.option('value', response.data.dsGrupo);
        }
        else {
            CheckError(response);
        }
    }

    SaudeSegurancaGet(data, success, error);
}

function DeleteField(cdGrupo) {
    let result = DevExpress.ui.dialog.confirm('<i>Deseja excluir o grupo de usuário?</i>', 'Confirma exclusão');

    result.done(function (dialogResult) {
        if (dialogResult) {
            const data = { url: recursoApi + '/' + cdGrupo }
            const success = (response) => {
                if (response.success) {
                    GetGrupoUsuarios();
                    Clear();
                    ShowMessage('success', 'Grupo de usuário excluido com sucesso!');
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