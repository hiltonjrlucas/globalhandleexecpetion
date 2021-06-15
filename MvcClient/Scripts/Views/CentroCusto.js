const recursoApi = '/cadastro-centro-custo'
var txtCodigo = null;
var txtDescricao = null;
var slbArea = null;
var btnCancelar = null;
var btnSalvar = null;
var grdCentrosCusto = null;
var dscCentrosCusto = new DevExpress.data.DataSource({});
var cdCentroCustoUpdate = null;

$(document).ready(function () {
    InitializeComponents();
    GetCentrosCusto();
    GetAreas();
});

function InitializeComponents() {
    txtCodigo = DxTextBox({ id: 'txtCodigo' }, {});
    txtDescricao = DxTextBox({ id: 'txtDescricao' }, {});
    slbArea = DxSelectBox({ id: 'slbArea', description: 'dsArea', value: 'cdArea' }, {});

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
        dataSource: dscCentrosCusto,
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
                        d.cdCentroCusto + "\")' id='lnkEdit' title=''><i class='fa fa-pencil text-info' style='font-size: 15px;'></i></a>";
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
                        d.cdCentroCusto + "\")' id='lnkDelete' title=''><i class='fa fa-trash text-info' style='font-size: 15px;'></i></a>";
                    $('<div>').append(template).appendTo(container);
                }
            },
            { dataField: 'cdCentroCusto', caption: 'Código', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'dsCentroCusto', caption: 'Descrição', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'area.dsArea', caption: 'Área', encodeHtml: false, alignment: 'left', showInColumnChooser: false }
        ]
    };

    grdCentrosCusto = DxDataGrid({ id: 'grdCentrosCusto' }, dxGridOptionsExtension);
}

function GetCentrosCusto() {
    const data = { url: recursoApi }

    const success = (response) => {
        if (response.success) {
            dscCentrosCusto = new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    let d = $.Deferred();

                    d.resolve(response.data, {});

                    return d.promise();
                }
            });

            dscCentrosCusto.load();

            grdCentrosCusto.option('dataSource', dscCentrosCusto);
            grdCentrosCusto.refresh();
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function Clear() {
    txtCodigo.option('value', null);
    txtCodigo.option('readOnly', false);
    txtDescricao.option('value', '');
    slbArea.reset();
    cdCentroCustoUpdate = null;
}

function CheckFields() {
    let isValid = true;

    if (!txtCodigo.option('value')) {
        isValid = false;
    }

    if (!txtDescricao.option('value')) {
        isValid = false;
    }

    if (!slbArea.option('value')) {
        isValid = false;
    }

    return isValid;
}

function Save() {
    if (CheckFields()) {
        let centroCusto = null;
        let data = null;

        if (cdCentroCustoUpdate) {
            centroCusto = GetCentroCusto(cdCentroCustoUpdate);
        }
        else {
            centroCusto = GetCentroCusto();
        }

        data = { url: recursoApi, body: JSON.stringify(centroCusto) }

        const success = (response) => {
            if (response.data) {
                GetCentrosCusto();

                if (cdCentroCustoUpdate) {
                    ShowMessage('success', 'Centro de custo atualizado com sucesso!');
                }
                else {
                    ShowMessage('success', 'Centro de custo cadastrado com sucesso!');
                }

                Clear();
            }
            else {
                CheckError(response);
            }
        }

        if (cdCentroCustoUpdate) {
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

function GetCentroCusto(cdCentroCusto) {
    if (cdCentroCusto) {
        return {
            cdCentroCusto: cdCentroCusto,
            dsCentroCusto: txtDescricao.option('value'),
            cdArea: slbArea.option('value')
        }
    }
    else {
        return {
            cdCentroCusto: txtCodigo.option('value'),
            dsCentroCusto: txtDescricao.option('value'),
            cdArea: slbArea.option('value')
        }
    }
}

function LoadFields(cdCentroCusto) {
    const data = { url: recursoApi + '/' + cdCentroCusto }

    const success = (response) => {
        if (response.success) {
            cdCentroCustoUpdate = response.data.cdCentroCusto;
            txtCodigo.option('value', response.data.cdCentroCusto);
            txtCodigo.option('readOnly', true);
            txtDescricao.option('value', response.data.dsCentroCusto);
            slbArea.option('value', response.data.cdArea)
        }
        else {
            CheckError(response);
        }
    }

    SaudeSegurancaGet(data, success, error);
}

function DeleteField(cdCentroCusto) {
    let result = DevExpress.ui.dialog.confirm('<i>Deseja excluir o centro de custo?</i>', 'Confirma exclusão');

    result.done(function (dialogResult) {
        if (dialogResult) {
            const data = { url: recursoApi + '/' + cdCentroCusto }
            const success = (response) => {
                if (response.success) {
                    GetCentrosCusto();
                    Clear();
                    ShowMessage('success', 'Centro de custo excluido com sucesso!');
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

function GetAreas() {
    const data = { url: '/cadastro-de-area' }

    const success = (response) => {
        if (response.success) {
            slbArea.option('dataSource', response.data);
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}