const recursoApi = '/cadastro-de-area'
var nbbCodigo = null;
var txtDescricao = null;
var btnCancelar = null;
var btnSalvar = null;
var grdAreas = null;
var dscAreas = new DevExpress.data.DataSource({});
var cdAreaUpdate = null;

$(document).ready(function () {    
    InitializeComponents();
    GetAreas();
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
        dataSource: dscAreas,
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
                        d.cdArea + "\")' id='lnkEdit' title=''><i class='fa fa-pencil text-info' style='font-size: 15px;'></i></a>";
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
                        d.cdArea + "\")' id='lnkDelete' title=''><i class='fa fa-trash text-info' style='font-size: 15px;'></i></a>";
                    $('<div>').append(template).appendTo(container);
                }
            },
            { dataField: 'cdArea', caption: 'Código', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'dsArea', caption: 'Descrição', encodeHtml: false, alignment: 'left', showInColumnChooser: false }
        ]
    };

    grdAreas = DxDataGrid({ id: 'grdAreas' }, dxGridOptionsExtension);
}

function GetAreas() {
    const data = { url: recursoApi }

    const success = (response) => {
        if (response.success) {
            dscAreas = new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    let d = $.Deferred();

                    d.resolve(response.data, {});

                    return d.promise();
                }
            });

            dscAreas.load();

            grdAreas.option('dataSource', dscAreas);
            grdAreas.refresh();
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
    cdAreaUpdate = null;
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
        let area = null;
        let data = null;

        if (cdAreaUpdate) {
            area = GetArea(cdAreaUpdate);
        }
        else {
            area = GetArea();
        }

        data = { url: recursoApi, body: JSON.stringify(area) }

        const success = (response) => {
            if (response.data) {
                GetAreas();                

                if (cdAreaUpdate) {
                    ShowMessage('success', 'Área atualizada com sucesso!');
                }
                else {
                    ShowMessage('success', 'Área cadastrada com sucesso!');
                }

                Clear();
            }
            else {
                CheckError(response);
            }
        }

        if (cdAreaUpdate) {
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

function GetArea(cdArea) {
    if (cdArea) {
        return {
            cdArea: cdArea,
            dsArea: txtDescricao.option('value')
        }
    }
    else {
        return {
            cdArea: nbbCodigo.option('value'),
            dsArea: txtDescricao.option('value')
        }
    }
}

function LoadFields(cdArea) {
    const data = { url: recursoApi + '/' + cdArea }

    const success = (response) => {
        if (response.success) {
            cdAreaUpdate = response.data.cdArea;
            nbbCodigo.option('value', response.data.cdArea);
            nbbCodigo.option('readOnly', true);
            txtDescricao.option('value', response.data.dsArea);
        }
        else {
            CheckError(response);
        }
    }

    SaudeSegurancaGet(data, success, error);
}

function DeleteField(cdArea) {

    const acao = (result) => {
        if (result) {

            const data = { url: recursoApi + '/' + cdArea };
            const success = (response) => {
                if (response.success) {
                    GetAreas();
                    Clear();
                    ShowMessage('success', 'Área excluida com sucesso!');
                } else {
                    CheckError(response);
                }
            };

            SaudeSegurancaDelete(data, success, error);

        } else {
            ShowMessageDelete();
        }
    };

    ShowDialog("Deseja excluir a área?", acao, DialogTypes.question, "Confirma exclusão");
}