const recursoApi = '/cadastro-situacao-agendamento'
var nbbCodigo = null;
var slbStatus = null;
var txtDescricao = null;
var btnCancelar = null;
var btnSalvar = null;
var grdSituacoes = null;
var dscSituacoes = new DevExpress.data.DataSource({});
var cdSituacaoUpdate = null;

var listStatus = [
    { dsStatus: 'Ativo', cdStatus: 1 },
    { dsStatus: 'Inativo', cdStatus: 0 }
];

$(document).ready(function () {
    InitializeComponents();
    GetSituacoes();
});

function InitializeComponents() {
    nbbCodigo = DxNumberBox({ id: 'nbbCodigo' }, {});
    slbStatus = DxSelectBox({ id: 'slbStatus', description: 'dsStatus', value: 'cdStatus' }, { dataSource: listStatus });
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
        dataSource: dscSituacoes,
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
                        d.cdSituacao + "\")' id='lnkEdit' title=''><i class='fa fa-pencil text-info' style='font-size: 15px;'></i></a>";
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
                        d.cdSituacao + "\")' id='lnkDelete' title=''><i class='fa fa-trash text-info' style='font-size: 15px;'></i></a>";
                    $('<div>').append(template).appendTo(container);
                }
            },
            { dataField: 'cdSituacao', caption: 'Código', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'dsSituacao', caption: 'Descrição', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
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

    grdSituacoes = DxDataGrid({ id: 'grdSituacoes' }, dxGridOptionsExtension);
}

function GetSituacoes() {
    const data = { url: recursoApi }

    const success = (response) => {
        if (response.success) {
            dscSituacoes = new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    let d = $.Deferred();

                    d.resolve(response.data, {});

                    return d.promise();
                }
            });

            dscSituacoes.load();

            grdSituacoes.option('dataSource', dscSituacoes);
            grdSituacoes.refresh();
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
    cdSituacaoUpdate = null;
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
        let situacao = null;
        let data = null;

        if (cdSituacaoUpdate) {
            situacao = GetSituacao(cdSituacaoUpdate);
        }
        else {
            situacao = GetSituacao();
        }

        data = { url: recursoApi, body: JSON.stringify(situacao) }

        const success = (response) => {
            if (response.data) {
                GetSituacoes();

                if (cdSituacaoUpdate) {
                    ShowMessage('success', 'Situação atualizada com sucesso!');
                }
                else {
                    ShowMessage('success', 'Situação cadastrada com sucesso!');
                }

                Clear();
            }
            else {
                CheckError(response);
            }
        }

        if (cdSituacaoUpdate) {
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

function GetSituacao(cdSituacao) {
    if (cdSituacao) {
        return {
            cdSituacao: cdSituacao,
            dsSituacao: txtDescricao.option('value'),
            cdStatus: slbStatus.option('value')
        }
    }
    else {
        return {
            cdSituacao: nbbCodigo.option('value'),
            dsSituacao: txtDescricao.option('value'),
            cdStatus: slbStatus.option('value')
        }
    }
}

function LoadFields(cdSituacao) {
    const data = { url: recursoApi + '/' + cdSituacao }

    const success = (response) => {
        if (response.success) {
            cdSituacaoUpdate = response.data.cdSituacao;
            nbbCodigo.option('value', response.data.cdSituacao);
            nbbCodigo.option('readOnly', true);
            txtDescricao.option('value', response.data.dsSituacao);
            slbStatus.option('value', response.data.cdStatus);
        }
        else {
            CheckError(response);
        }
    }

    SaudeSegurancaGet(data, success, error);
}

function DeleteField(cdSituacao) {
    let result = DevExpress.ui.dialog.confirm('<i>Deseja excluir a situação?</i>', 'Confirma exclusão');

    result.done(function (dialogResult) {
        if (dialogResult) {
            const data = { url: recursoApi + '/' + cdSituacao }
            const success = (response) => {
                if (response.success) {
                    GetSituacoes();
                    Clear();
                    ShowMessage('success', 'Situação excluida com sucesso!');
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