const recursoApi = '/cadastro-de-local';
var nbbCodigo = null;
var txtDescricao = null;
var slbFilial = null;
var btnCancelar = null;
var btnSalvar = null;
var grLocais = null;
var dscLocais = new DevExpress.data.DataSource({});
var cdLocalUpdate = null;

$(document).ready(function () {
    InitializeComponents();
    GetLocais();
    GetFiliais();
});

function InitializeComponents() {
    nbbCodigo = DxNumberBox({ id: 'nbbCodigo' }, {});
    txtDescricao = DxTextBox({ id: 'txtDescricao' }, {});

    slbFilial = DxSelectBox({ id: 'slbFilial', value: 'cdFilial', description: 'cdFilial' }, {});

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
        dataSource: dscLocais,
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
                        d.cdFilial + "&" + d.cdLocal + "\")' id='lnkEdit' title=''><i class='fa fa-pencil text-info' style='font-size: 15px;'></i></a>";
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
                        d.cdFilial + "&" + d.cdLocal + "\")' id='lnkDelete' title=''><i class='fa fa-trash text-info' style='font-size: 15px;'></i></a>";
                    $('<div>').append(template).appendTo(container);
                }
            },
            { dataField: 'cdFilial', caption: 'Filial', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'cdLocal', caption: 'Código', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'dsLocal', caption: 'Descrição', encodeHtml: false, alignment: 'left', showInColumnChooser: false }            
        ]
    };

    grdLocais = DxDataGrid({ id: 'grdLocais' }, dxGridOptionsExtension);
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

function GetLocais() {
    const data = { url: recursoApi };

    const success = (response) => {
        if (response.success) {
            dscLocais = new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    let d = $.Deferred();

                    d.resolve(response.data, {});

                    return d.promise();
                }
            });

            dscLocais.load();

            grdLocais.option('dataSource', dscLocais);
            grdLocais.refresh();
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function Clear() {
    slbFilial.reset();
    slbFilial.option('readOnly', false);
    nbbCodigo.option('value', null);
    nbbCodigo.option('readOnly', false);
    txtDescricao.option('value', '');    
    cdLocalUpdate = null;
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

    return isValid;
}

function Save() {
    if (CheckFields()) {
        let local = null;
        let data = null;

        if (cdLocalUpdate) {
            local = GetLocal(cdLocalUpdate);
        }
        else {
            local = GetLocal();
        }

        data = { url: recursoApi, body: JSON.stringify(local) };

        const success = (response) => {
            if (response.data) {
                GetLocais();

                if (cdLocalUpdate) {
                    ShowMessage('success', 'Local atualizado com sucesso!');
                }
                else {
                    ShowMessage('success', 'Local cadastrado com sucesso!');
                }

                Clear();
            }
            else {
                CheckError(response);
            }
        };

        if (cdLocalUpdate) {
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

function GetLocal(cdLocal) {
    if (cdLocal) {
        return {
            cdFilial: slbFilial.option('value'),
            cdLocal: cdLocal,
            dsLocal: txtDescricao.option('value')            
        };
    }
    else {
        return {
            cdFilial: slbFilial.option('value'),
            cdLocal: nbbCodigo.option('value'),
            dsLocal: txtDescricao.option('value')            
        };
    }
}

function LoadFields(cdKey) {
    const data = { url: recursoApi + '/' + cdKey };

    const success = (response) => {
        if (response.success) {
            cdLocalUpdate = response.data.cdLocal;
            slbFilial.option('value', response.data.cdFilial);
            slbFilial.option('readOnly', true);
            nbbCodigo.option('value', response.data.cdLocal);
            nbbCodigo.option('readOnly', true);
            txtDescricao.option('value', response.data.dsLocal);            
        }
        else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function DeleteField(cdKey) {
    let result = DevExpress.ui.dialog.confirm('<i>Deseja excluir o local?</i>', 'Confirma exclusão');

    result.done(function (dialogResult) {
        if (dialogResult) {
            const data = { url: recursoApi + '/' + cdKey };
            const success = (response) => {
                if (response.success) {
                    GetLocais();
                    Clear();
                    ShowMessage('success', 'Local excluido com sucesso!');
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