const recursoApi = '/cadastro-de-tipo';
var nbbCodigo = null;
var txtDescricao = null;
var slbStatus = null;
var btnCancelar = null;
var btnSalvar = null;
var grdTipos = null;
var dscTipos = new DevExpress.data.DataSource({});
var cdTipoUpdate = null;

var listStatus = [
    { dsStatus: 'Ativo', cdStatus: 1 },
    { dsStatus: 'Inativo', cdStatus: 0 }
];

$(document).ready(function () {
    InitializeComponents();
    GetTipos();
});

function InitializeComponents() {
    nbbCodigo = DxNumberBox({ id: 'nbbCodigo' }, {});
    txtDescricao = DxTextBox({ id: 'txtDescricao' }, {});

    slbStatus = DxSelectBox({ id: 'slbStatus', description: 'dsStatus', value: 'cdStatus' }, { dataSource: listStatus });

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

    let gridExport = new GridExportHide(['lnkEdit', 'lnkDelete']);

    dxGridOptionsExtension = {
        onExporting: gridExport.onExporting,
        onExported: gridExport.onExported,
        dataSource: dscTipos,
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
                        d.cdTipo + "\")' id='lnkEdit' title=''><i class='fa fa-pencil text-info' style='font-size: 15px;'></i></a>";
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
                        d.cdTipo + "\")' id='lnkDelete' title=''><i class='fa fa-trash text-info' style='font-size: 15px;'></i></a>";
                    $('<div>').append(template).appendTo(container);
                }
            },
            { dataField: 'cdTipo', caption: 'Código', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'dsTipo', caption: 'Descrição', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            {
                dataField: 'cdStatus',
                caption: 'Status',
                encodeHtml: false,
                alignment: 'left',
                showInColumnChooser: false,
                calculateCellValue: function (data) {
                    return data.cdStatus === 0 ? 'Inativo' : 'Ativo';
                }
            }
        ]
    };

    grdTipos = DxDataGrid({ id: 'grdTipos' }, dxGridOptionsExtension);
}

function GetTipos() {
    const data = { url: recursoApi };

    const success = (response) => {
        if (response.success) {
            dscTipos = new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    let d = $.Deferred();

                    d.resolve(response.data, {});

                    return d.promise();
                }
            });

            dscTipos.load();

            grdTipos.option('dataSource', dscTipos);
            grdTipos.refresh();
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function Clear() {
    nbbCodigo.option('value', null);
    nbbCodigo.option('readOnly', false);
    slbStatus.option('value', null);
    txtDescricao.option('value', '');
    cdTipoUpdate = null;
}

function CheckFields() {
    let isValid = true;

    if (!nbbCodigo.option('value')) {
        isValid = false;
    }

    if (slbStatus.option('value') === null) {
        isValid = false;
    }

    if (!txtDescricao.option('value')) {
        isValid = false;
    }

    return isValid;
}

function Save() {
    if (CheckFields()) {
        let tipo = null;
        let data = null;

        if (cdTipoUpdate) {
            tipo = GetTipo(cdTipoUpdate);
        }
        else {
            tipo = GetTipo();
        }

        data = { url: recursoApi, body: JSON.stringify(tipo) };

        const success = (response) => {
            if (response.data) {
                GetTipos();

                if (cdTipoUpdate) {
                    ShowMessage('success', 'Tipo de atendimento atualizado com sucesso!');
                }
                else {
                    ShowMessage('success', 'Tipo de atendimento cadastrado com sucesso!');
                }

                Clear();
            }
            else {
                CheckError(response);
            }
        };

        if (cdTipoUpdate) {
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

function GetTipo(cdTipo) {
    if (cdTipo) {
        return {
            cdTipo: cdTipo,
            dsTipo: txtDescricao.option('value'),
            cdStatus: slbStatus.option('value')
        };
    }
    else {
        return {
            cdTipo: nbbCodigo.option('value'),
            dsTipo: txtDescricao.option('value'),
            cdStatus: slbStatus.option('value')
        };
    }
}

function LoadFields(cdTipo) {
    const data = { url: recursoApi + '/' + cdTipo };

    const success = (response) => {
        if (response.success) {
            cdTipoUpdate = response.data.cdTipo;
            nbbCodigo.option('value', response.data.cdTipo);
            nbbCodigo.option('readOnly', true);
            slbStatus.option('value', response.data.cdStatus);
            txtDescricao.option('value', response.data.dsTipo);            
        }
        else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function DeleteField(cdTipo) {
    let result = DevExpress.ui.dialog.confirm('<i>Deseja excluir o tipo de atendimento?</i>', 'Confirma exclusão');

    result.done(function (dialogResult) {
        if (dialogResult) {
            const data = { url: recursoApi + '/' + cdTipo };
            const success = (response) => {
                if (response.success) {
                    GetTipos();
                    Clear();
                    ShowMessage('success', 'Tipo de atendimento excluido com sucesso!');
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