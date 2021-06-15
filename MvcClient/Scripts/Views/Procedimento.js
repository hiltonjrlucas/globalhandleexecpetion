const recursoApi = '/cadastro-de-procedimento'
var slbFilial = null;
var nbbCodigo = null;
var txtDescricao = null;
var slbSituacao = null;
var slbStatus = null;
var btnCancelar = null;
var btnSalvar = null;
var grdProcedimentos = null;
var dscProcedimentos = new DevExpress.data.DataSource({});
var cdProcedimentoUpdate = null;

var listStatus = [
    { dsStatus: 'Ativo', cdStatus: 1 },
    { dsStatus: 'Inativo', cdStatus: 0 }
];

var listSituacao = [
    { dsSituacao: 'Sem Programação', cdSituacao: 0 },
    { dsSituacao: 'Com Programação', cdSituacao: 1 },
]

$(document).ready(function () {
    InitializeComponents();
    GetFiliais();
    GetProcedimentos();
});

function InitializeComponents() {
    slbFilial = DxSelectBox({ id: 'slbFilial', description: 'cdFilial', value: 'cdFilial' }, {});
    nbbCodigo = DxNumberBox({ id: 'nbbCodigo' }, {});    
    txtDescricao = DxTextBox({ id: 'txtDescricao' }, {});
    slbSituacao = DxSelectBox({ id: 'slbSituacao', description: 'dsSituacao', value: 'cdSituacao' }, { dataSource: listSituacao });
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

    //- Colunas que serão ocultas ao exportar para excel
    let gridExport = new GridExportHide(['lnkEdit', 'lnkDelete']);

    dxGridOptionsExtension = {
        onExporting: gridExport.onExporting,
        onExported: gridExport.onExported,
        dataSource: dscProcedimentos,
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
                        d.cdFilial + "&" + d.cdProcedimento + "\")' id='lnkEdit' title=''><i class='fa fa-pencil text-info' style='font-size: 15px;'></i></a>";
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
                        d.cdFilial + "&" + d.cdProcedimento + "\")' id='lnkDelete' title=''><i class='fa fa-trash text-info' style='font-size: 15px;'></i></a>";
                    $('<div>').append(template).appendTo(container);
                }
            },
            { dataField: 'cdFilial', caption: 'Filial', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'cdProcedimento', caption: 'Código', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'dsProcedimento', caption: 'Descrição', encodeHtml: false, alignment: 'left', showInColumnChooser: false },            
            {                
                dataField: 'cdSituacao',
                caption: 'Situação',
                encodeHtml: false,
                alignment: 'left',
                showInColumnChooser: false,
                calculateCellValue: function (data) {
                    return data.cdSituacao === 0 ? 'Sem Programação' : 'Com Programação';
                }
            },
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

    grdProcedimentos = DxDataGrid({ id: 'grdProcedimentos' }, dxGridOptionsExtension);
}

function GetProcedimentos() {
    const data = { url: recursoApi }

    const success = (response) => {
        if (response.success) {
            dscProcedimentos = new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    let d = $.Deferred();

                    d.resolve(response.data, {});

                    return d.promise();
                }
            });

            dscProcedimentos.load();

            grdProcedimentos.option('dataSource', dscProcedimentos);
            grdProcedimentos.refresh();
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function Clear() {
    slbFilial.option('value', null);
    slbFilial.option('readOnly', false);
    nbbCodigo.option('value', null);
    nbbCodigo.option('readOnly', false);
    txtDescricao.option('value', '');
    slbSituacao.option('value', null);
    slbStatus.option('value', null);
    
    cdProcedimentoUpdate = null;
}

function CheckFields() {
    let isValid = true;

    if (!slbFilial.option('value')) {
        isValid = false;
    }

    if (!nbbCodigo.option('value')) {
        isValid = false;
    }

    if (!txtDescricao.option('value')) {
        isValid = false;
    }

    if (slbSituacao.option('value') === null) {
        isValid = false;
    }

    if (slbStatus.option('value') === null) {
        isValid = false;
    }   

    return isValid;
}

function Save() {
    if (CheckFields()) {
        let procedimento = null;
        let data = null;

        if (cdProcedimentoUpdate) {
            procedimento = GetProcedimento(cdProcedimentoUpdate);
        }
        else {
            procedimento = GetProcedimento();
        }

        data = { url: recursoApi, body: JSON.stringify(procedimento) }

        const success = (response) => {
            if (response.data) {
                GetProcedimentos();

                if (cdProcedimentoUpdate) {
                    ShowMessage('success', 'Procedimento atualizado com sucesso!');
                }
                else {
                    ShowMessage('success', 'Procedimento cadastrado com sucesso!');
                }

                Clear();
            }
            else {
                CheckError(response);
            }
        }

        if (cdProcedimentoUpdate) {
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

function GetProcedimento(cdProcedimento) {
    if (cdProcedimento) {
        return {
            cdFilial: slbFilial.option('value'),
            cdProcedimento: cdProcedimento,
            dsProcedimento: txtDescricao.option('value'),
            cdSituacao: slbSituacao.option('value'),
            cdStatus: slbStatus.option('value')
        }
    }
    else {
        return {
            cdFilial: slbFilial.option('value'),
            cdProcedimento: nbbCodigo.option('value'),
            dsProcedimento: txtDescricao.option('value'),
            cdSituacao: slbSituacao.option('value'),
            cdStatus: slbStatus.option('value')
        }
    }
}

function LoadFields(cdKey) {
    const data = { url: recursoApi + '/' + cdKey }

    const success = (response) => {
        if (response.success) {
            cdProcedimentoUpdate = response.data.cdProcedimento;
            slbFilial.option('value', response.data.cdFilial);
            slbFilial.option('readOnly', true);
            nbbCodigo.option('value', response.data.cdProcedimento);
            nbbCodigo.option('readOnly', true);
            txtDescricao.option('value', response.data.dsProcedimento);
            slbSituacao.option('value', response.data.cdSituacao);
            slbStatus.option('value', response.data.cdStatus);
        }
        else {
            CheckError(response);
        }
    }

    SaudeSegurancaGet(data, success, error);
}

function DeleteField(cdKey) {
    let result = DevExpress.ui.dialog.confirm('<i>Deseja excluir o procedimento?</i>', 'Confirma exclusão');

    result.done(function (dialogResult) {
        if (dialogResult) {
            const data = { url: recursoApi + '/' + cdKey }
            const success = (response) => {
                if (response.success) {
                    GetProcedimentos();
                    Clear();
                    ShowMessage('success', 'Procedimento excluido com sucesso!');
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
    const data = { url: '/cadastro-de-filial' }

    const success = (response) => {
        if (response.success) {
            slbFilial.option('dataSource', response.data);
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}