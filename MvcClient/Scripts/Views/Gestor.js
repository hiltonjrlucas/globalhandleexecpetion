const recursoApi = '/cadastro-de-gestor'
const tipoUsuario = 3;
var slbFilial = null;
var slbGestor = null;
var slbCentroCusto = null;
var btnCancelar = null;
var btnSalvar = null;
var grdGestores = null;
var dscGestores = new DevExpress.data.DataSource({});
var cdUsuarioUpdate = null;

$(document).ready(function () {
    InitializeComponents();
    GetFiliais();
    GetGestores();
    GetCentrosCusto();
    GetGestoresGrid();
});

function InitializeComponents() {
    slbFilial = DxSelectBox({ id: 'slbFilial', description: 'cdFilial', value: 'cdFilial' }, {});
    slbGestor = DxSelectBox({ id: 'slbGestor', description: 'cdUsuario', value: 'cdUsuario' }, {});
    slbCentroCusto = DxSelectBox({ id: 'slbCentroCusto', description: 'dsCentroCusto', value: 'cdCentroCusto' }, {});

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
        dataSource: dscGestores,
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
                dataField: 'lnkDelete',
                caption: '',
                width: '30px',
                allowFiltering: false,
                allowSorting: false,
                cellTemplate: function (container, options) {
                    var d = options.row.data
                    var template = "<a href='javascript:DeleteField(\"" +
                        d.cdFilial + "&" + d.cdUsuario + "&" + d.cdCentroCusto + "\")' id='lnkDelete' title=''><i class='fa fa-trash text-info' style='font-size: 15px;'></i></a>";
                    $('<div>').append(template).appendTo(container);
                }
            },
            { dataField: 'cdFilial', caption: 'Filial', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'cdUsuario', caption: 'Gestor', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'cdCentroCusto', caption: 'Centro de Custo', encodeHtml: false, alignment: 'left', showInColumnChooser: false }
        ]
    };

    grdGestores = DxDataGrid({ id: 'grdGestores' }, dxGridOptionsExtension);
}

function GetGestoresGrid() {
    const data = { url: recursoApi }

    const success = (response) => {
        if (response.success) {
            dscGestores = new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    let d = $.Deferred();

                    d.resolve(response.data, {});

                    return d.promise();
                }
            });

            dscGestores.load();

            grdGestores.option('dataSource', dscGestores);
            grdGestores.refresh();
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function Clear() {
    slbFilial.reset();
    slbGestor.reset();
    slbCentroCusto.reset();
    slbFilial.option('readOnly', false);
    slbGestor.option('readOnly', false);
    slbCentroCusto.option('readOnly', false);
    cdUsuarioUpdate = null;
}

function CheckFields() {
    let isValid = true;

    if (!slbFilial.option('value')) {
        isValid = false;
    }

    if (!slbGestor.option('value')) {
        isValid = false;
    }

    if (!slbCentroCusto.option('value')) {
        isValid = false;
    }

    return isValid;
}

function Save() {
    if (CheckFields()) {
        let gestor = null;
        let data = null;

        if (cdUsuarioUpdate) {
            gestor = GetGestor(cdUsuarioUpdate);
        }
        else {
            gestor = GetGestor();
        }

        data = { url: recursoApi, body: JSON.stringify(gestor) }

        const success = (response) => {
            if (response.data) {
                GetGestoresGrid();

                if (cdUsuarioUpdate) {
                    ShowMessage('success', 'Gestor e centro de custo atualizado com sucesso!');
                }
                else {
                    ShowMessage('success', 'Gestor e centro de custo cadastrado com sucesso!');
                }

                Clear();
            }
            else {
                CheckError(response);
            }
        }

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

function GetGestor(cdUsuario) {
    if (cdUsuario) {
        return {
            cdFilial: slbFilial.option('value'),
            cdUsuario: cdUsuario,
            cdCentroCusto: slbCentroCusto.option('value')
        }
    }
    else {
        return {
            cdFilial: slbFilial.option('value'),
            cdUsuario: slbGestor.option('value'),
            cdCentroCusto: slbCentroCusto.option('value')
        }
    }
}

function LoadFields(cdKey) {
    const data = { url: recursoApi + '/' + cdKey }

    const success = (response) => {
        if (response.success) {
            cdUsuarioUpdate = response.data.cdUsuario;
            slbFilial.option('value', response.data.cdFilial);
            slbGestor.option('value', response.data.cdUsuario)
            slbCentroCusto.option('value', response.data.cdCentroCusto);
            slbFilial.option('readOnly', true);
            slbGestor.option('readOnly', true);
            slbCentroCusto.option('readOnly', true);

        }
        else {
            CheckError(response);
        }
    }

    SaudeSegurancaGet(data, success, error);
}

function DeleteField(cdKey) {
    let result = DevExpress.ui.dialog.confirm('<i>Deseja excluir o gestor e centro de custo?</i>', 'Confirma exclusão');

    result.done(function (dialogResult) {
        if (dialogResult) {
            const data = { url: recursoApi + '/' + cdKey }
            const success = (response) => {
                if (response.success) {
                    GetGestoresGrid();
                    Clear();
                    ShowMessage('success', 'Gestor e centro de custo excluido com sucesso!');
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

function GetGestores() {
    const data = { url: '/cadastro-usuario-permissao/GetByGrupo/' + tipoUsuario }

    const success = (response) => {
        if (response.success) {
            slbGestor.option('dataSource', response.data);
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function GetCentrosCusto() {
    const data = { url: '/cadastro-centro-custo' }

    const success = (response) => {
        if (response.success) {
            slbCentroCusto.option('dataSource', response.data.map((m) => {
                return {
                    cdCentroCusto: m.cdCentroCusto,
                    dsCentroCusto: m.cdCentroCusto + ' - ' + m.dsCentroCusto
                }
            }));
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}