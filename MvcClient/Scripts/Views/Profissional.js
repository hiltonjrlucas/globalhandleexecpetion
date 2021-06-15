const recursoApi = '/cadastro-de-profissional'
var slbFilial = null;
var txtUsuario = null;
var txtDescricao = null;
var slbProcedimento = null;
var slbStatus = null;
var btnCancelar = null;
var btnSalvar = null;
var grdProfissionais = null;
var dscProfissionais = new DevExpress.data.DataSource({});
var cdProfissionalUpdate = null;

var listStatus = [
    { dsStatus: 'Ativo', cdStatus: 1 },
    { dsStatus: 'Inativo', cdStatus: 0 }
];

$(document).ready(function () {
    InitializeComponents();
    GetFiliais();
    GetProfissionais();
});

function InitializeComponents() {
    slbFilial = DxSelectBox({ id: 'slbFilial', description: 'cdFilial', value: 'cdFilial' }, {
        onValueChanged: function (e) {
            if (e.value) {
                GetProcedimentos(e.value);
            }
        }
    });
    txtUsuario = DxTextBox({ id: 'txtUsuario' }, {});
    txtDescricao = DxTextBox({ id: 'txtDescricao' }, {});
    slbProcedimento = DxSelectBox({ id: 'slbProcedimento', description: 'dsProcedimento', value: 'cdProcedimento' }, {});
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
        dataSource: dscProfissionais,
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
                        d.cdFilial + "&" + d.cdProfissional + "&" + d.cdProcedimento + "\")' id='lnkEdit' title=''><i class='fa fa-pencil text-info' style='font-size: 15px;'></i></a>";
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
                        d.cdFilial + "&" + d.cdProfissional + "&" + d.cdProcedimento + "\")' id='lnkDelete' title=''><i class='fa fa-trash text-info' style='font-size: 15px;'></i></a>";
                    $('<div>').append(template).appendTo(container);
                }
            },
            { dataField: 'cdFilial', caption: 'Filial', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'cdProfissional', caption: 'Código', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'dsProfissional', caption: 'Descrição', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'procedimento.dsProcedimento', caption: 'Procedimento', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
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

    grdProfissionais = DxDataGrid({ id: 'grdProfissionais' }, dxGridOptionsExtension);
}

function GetProfissionais() {
    const data = { url: recursoApi }

    const success = (response) => {
        if (response.success) {
            dscProfissionais = new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    let d = $.Deferred();

                    d.resolve(response.data, {});

                    return d.promise();
                }
            });

            dscProfissionais.load();

            grdProfissionais.option('dataSource', dscProfissionais);
            grdProfissionais.refresh();
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function Clear() {
    slbFilial.option('value', null);
    slbFilial.option('readOnly', false);
    txtUsuario.option('value', '');
    txtUsuario.option('readOnly', false);
    txtDescricao.option('value', '');
    slbProcedimento.option('value', null);
    slbProcedimento.option('readOnly', false);
    slbStatus.option('value', null);

    cdProfissionalUpdate = null;
}

function CheckFields() {
    let isValid = true;

    if (!slbFilial.option('value')) {
        isValid = false;
    }

    if (!txtUsuario.option('value')) {
        isValid = false;
    }

    if (!txtDescricao.option('value')) {
        isValid = false;
    }

    if (!slbProcedimento.option('value')) {
        isValid = false;
    }

    if (slbStatus.option('value') === null) {
        isValid = false;
    }

    return isValid;
}

function Save() {
    if (CheckFields()) {
        let profissional = null;
        let data = null;

        if (cdProfissionalUpdate) {
            profissional = GetProfissional(cdProfissionalUpdate);
        }
        else {
            profissional = GetProfissional();
        }

        data = { url: recursoApi, body: JSON.stringify(profissional) }

        const success = (response) => {
            if (response.data) {
                GetProfissionais();

                if (cdProfissionalUpdate) {
                    ShowMessage('success', 'Profissional atualizado com sucesso!');
                }
                else {
                    ShowMessage('success', 'Profissional cadastrado com sucesso!');
                }

                Clear();
            }
            else {
                CheckError(response);
            }
        }

        if (cdProfissionalUpdate) {
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

function GetProfissional(cdProfissional) {
    if (cdProfissional) {
        return {
            cdFilial: slbFilial.option('value'),
            cdProfissional: cdProfissional,
            dsProfissional: txtDescricao.option('value'),
            cdProcedimento: slbProcedimento.option('value'),
            cdStatus: slbStatus.option('value')
        }
    }
    else {
        return {
            cdFilial: slbFilial.option('value'),
            cdProfissional: txtUsuario.option('value'),
            dsProfissional: txtDescricao.option('value'),
            cdProcedimento: slbProcedimento.option('value'),
            cdStatus: slbStatus.option('value')
        }
    }
}

function LoadFields(cdKey) {
    const data = { url: recursoApi + '/' + cdKey }

    const success = (response) => {
        if (response.success) {
            cdProfissionalUpdate = response.data.cdProfissional;
            slbFilial.option('readOnly', true);
            slbFilial.option('value', response.data.cdFilial);            
            txtUsuario.option('value', response.data.cdProfissional);
            txtUsuario.option('readOnly', true);
            txtDescricao.option('value', response.data.dsProfissional);
            slbProcedimento.option('value', response.data.cdProcedimento);
            slbProcedimento.option('readOnly', true);
            slbStatus.option('value', response.data.cdStatus);
        }
        else {
            CheckError(response);
        }
    }

    SaudeSegurancaGet(data, success, error);
}

function DeleteField(cdKey) {
    let result = DevExpress.ui.dialog.confirm('<i>Deseja excluir o profissional?</i>', 'Confirma exclusão');

    result.done(function (dialogResult) {
        if (dialogResult) {
            const data = { url: recursoApi + '/' + cdKey }
            const success = (response) => {
                if (response.success) {
                    GetProfissionais();
                    Clear();
                    ShowMessage('success', 'Profissional excluido com sucesso!');
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

function GetProcedimentos(cdFilial) {
    const data = { url: '/cadastro-de-procedimento/GetByFilial/' + cdFilial }

    const success = (response) => {
        if (response.success) {
            slbProcedimento.option('dataSource', response.data);
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}