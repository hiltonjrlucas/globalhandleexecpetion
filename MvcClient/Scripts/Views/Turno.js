const recursoApi = '/cadastro-de-turno';
var nbbCodigo = null;
var txtDescricao = null;
var slbFilial = null;
var btnCancelar = null;
var btnSalvar = null;
var grTurnos = null;
var dscTurnos = new DevExpress.data.DataSource({});
var cdTurnoUpdate = null;

$(document).ready(function () {
    InitializeComponents();
    GetTurnos();
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
        dataSource: dscTurnos,
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
                        d.cdFilial + "&" + d.cdTurno + "\")' id='lnkEdit' title=''><i class='fa fa-pencil text-info' style='font-size: 15px;'></i></a>";
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
                        d.cdFilial + "&" + d.cdTurno + "\")' id='lnkDelete' title=''><i class='fa fa-trash text-info' style='font-size: 15px;'></i></a>";
                    $('<div>').append(template).appendTo(container);
                }
            },
            { dataField: 'cdFilial', caption: 'Filial', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'cdTurno', caption: 'Código', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'dsTurno', caption: 'Descrição', encodeHtml: false, alignment: 'left', showInColumnChooser: false }
        ]
    };

    grdTurnos = DxDataGrid({ id: 'grdTurnos' }, dxGridOptionsExtension);
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

function GetTurnos() {
    const data = { url: recursoApi };

    const success = (response) => {
        if (response.success) {
            dscTurnos = new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    let d = $.Deferred();

                    d.resolve(response.data, {});

                    return d.promise();
                }
            });

            dscTurnos.load();

            grdTurnos.option('dataSource', dscTurnos);
            grdTurnos.refresh();
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
    cdTurnoUpdate = null;
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
        let Turno = null;
        let data = null;

        if (cdTurnoUpdate) {
            Turno = GetTurno(cdTurnoUpdate);
        }
        else {
            Turno = GetTurno();
        }

        data = { url: recursoApi, body: JSON.stringify(Turno) };

        const success = (response) => {
            if (response.data) {
                GetTurnos();

                if (cdTurnoUpdate) {
                    ShowMessage('success', 'Turno atualizado com sucesso!');
                }
                else {
                    ShowMessage('success', 'Turno cadastrado com sucesso!');
                }

                Clear();
            }
            else {
                CheckError(response);
            }
        };

        if (cdTurnoUpdate) {
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

function GetTurno(cdTurno) {
    if (cdTurno) {
        return {
            cdFilial: slbFilial.option('value'),
            cdTurno: cdTurno,
            dsTurno: txtDescricao.option('value')            
        };
    }
    else {
        return {
            cdFilial: slbFilial.option('value'),
            cdTurno: nbbCodigo.option('value'),
            dsTurno: txtDescricao.option('value')            
        };
    }
}

function LoadFields(cdKey) {
    const data = { url: recursoApi + '/' + cdKey };

    const success = (response) => {
        if (response.success) {
            cdTurnoUpdate = response.data.cdTurno;
            slbFilial.option('value', response.data.cdFilial);
            slbFilial.option('readOnly', true);
            nbbCodigo.option('value', response.data.cdTurno);
            nbbCodigo.option('readOnly', true);
            txtDescricao.option('value', response.data.dsTurno);            
        }
        else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function DeleteField(cdKey) {
    let result = DevExpress.ui.dialog.confirm('<i>Deseja excluir o Turno?</i>', 'Confirma exclusão');

    result.done(function (dialogResult) {
        if (dialogResult) {
            const data = { url: recursoApi + '/' + cdKey };
            const success = (response) => {
                if (response.success) {
                    GetTurnos();
                    Clear();
                    ShowMessage('success', 'Turno excluido com sucesso!');
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