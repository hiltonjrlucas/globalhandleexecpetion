const recursoApi = '/cadastro-de-filial'
var nbbCodigo = null;
var txtDescricao = null;
var btnCancelar = null;
var btnSalvar = null;
var grdFiliais = null;
var dscFiliais = new DevExpress.data.DataSource({});
var cdFilialUpdate = null;

$(document).ready(function () {
    InitializeComponents();
    GetFiliais();
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
        dataSource: dscFiliais,
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
                        d.cdFilial + "\")' id='lnkEdit' title=''><i class='fa fa-pencil text-info' style='font-size: 15px;'></i></a>";
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
                        d.cdFilial + "\")' id='lnkDelete' title=''><i class='fa fa-trash text-info' style='font-size: 15px;'></i></a>";
                    $('<div>').append(template).appendTo(container);
                }
            },
            { dataField: 'cdFilial', caption: 'Código', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'dsFilial', caption: 'Descrição', encodeHtml: false, alignment: 'left', showInColumnChooser: false }
        ]
    };

    grdFiliais = DxDataGrid({ id: 'grdFiliais' }, dxGridOptionsExtension);
}

function GetFiliais() {
    const data = { url: recursoApi }

    const success = (response) => {
        if (response.success) {
            dscFiliais = new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    let d = $.Deferred();

                    d.resolve(response.data, {});

                    return d.promise();
                }
            });

            dscFiliais.load();

            grdFiliais.option('dataSource', dscFiliais);
            grdFiliais.refresh();
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
    cdFilialUpdate = null;
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
        let filial = null;
        let data = null;

        if (cdFilialUpdate) {
            filial = GetFilial(cdFilialUpdate);
        }
        else {
            filial = GetFilial();
        }

        data = { url: recursoApi, body: JSON.stringify(filial) }

        const success = (response) => {
            if (response.data) {
                GetFiliais();

                if (cdFilialUpdate) {
                    ShowMessage('success', 'Filial atualizada com sucesso!');
                }
                else {
                    ShowMessage('success', 'Filial cadastrada com sucesso!');
                }

                Clear();
            }
            else {
                CheckError(response);
            }
        }

        if (cdFilialUpdate) {
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

function GetFilial(cdFilial) {
    if (cdFilial) {
        return {
            cdFilial: cdFilial,
            dsFilial: txtDescricao.option('value')
        }
    }
    else {
        return {
            cdFilial: nbbCodigo.option('value'),
            dsFilial: txtDescricao.option('value')
        }
    }
}

function LoadFields(cdFilial) {
    const data = { url: recursoApi + '/' + cdFilial }

    const success = (response) => {
        if (response.success) {
            cdFilialUpdate = response.data.cdFilial;
            nbbCodigo.option('value', response.data.cdFilial);
            nbbCodigo.option('readOnly', true);
            txtDescricao.option('value', response.data.dsFilial);
        }
        else {
            CheckError(response);
        }
    }

    SaudeSegurancaGet(data, success, error);
}

function DeleteField(cdFilial) {
    let result = DevExpress.ui.dialog.confirm('<i>Deseja excluir a filial?</i>', 'Confirma exclusão');

    result.done(function (dialogResult) {
        if (dialogResult) {
            const data = { url: recursoApi + '/' + cdFilial }
            const success = (response) => {
                if (response.success) {
                    GetFiliais();
                    Clear();
                    ShowMessage('success', 'Filial excluida com sucesso!');
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