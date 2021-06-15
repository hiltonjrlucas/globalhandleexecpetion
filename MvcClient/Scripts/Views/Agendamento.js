const recursoApi = '/cadastro-de-agendamento'
var slbFilial;
var slbProfissional;
var nbbGrupoFolga;
var slbProcedimento;
var dtbPeriodo;
var slbLocal;
var btnCancelar;
var btnSalvar;
var fupDocumentos;
var btnLimpar;
var btnImportar;
var grdAgendamentos;
var dscAgendamentos = new DevExpress.data.DataSource({});
var cdAgendamentoUpdate;

$(document).ready(function () {
    InitializeComponents();
    GetFiliais();
    GetAgendamentos();
});

function InitializeComponents() {
    slbFilial = DxSelectBox({ id: 'slbFilial', description: 'cdFilial', value: 'cdFilial' }, {
        onValueChanged: function (e) {
            if (e.value) {
                GetProfissionais(e.value);
                GetLocais(e.value);
            }
        }
    });

    slbProfissional = DxSelectBox({ id: 'slbProfissional', description: 'dsProfissional', value: 'cdProfissional' }, {
        onValueChanged: function (e) {
            if (e.value) {
                GetProfissionalProcedimentos(slbFilial.option('value'), e.value);
            }
        }
    });

    nbbGrupoFolga = DxNumberBox({ id: 'nbbGrupoFolga' }, {});

    slbProcedimento = DxSelectBox({ id: 'slbProcedimento', description: 'dsProcedimento', value: 'cdProcedimento' }, {});

    dtbPeriodo = DxDateBox({ id: 'dtbPeriodo' }, {
        displayFormat: 'dd/MM/yyyy HH:mm',
        type: 'datetime'
    });

    slbLocal = DxSelectBox({ id: 'slbLocal', description: 'dsLocal', value: 'cdLocal' }, {});    

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

    //Importação de arquivos
    fupDocumentos = DxFileUpload({ id: 'fupDocumentos' }, {
        selectButtonText: "Selecione...",
        labelText: "",
        accept: ".xls,.xlsx"
    })

    btnLimpar = DxButton({ id: 'btnLimpar' }, {
        icon: 'clear',
        type: 'normal',
        text: 'Limpar',
        width: 120,
        onClick: function (e) {
            fupDocumentos.reset();
        }
    });

    btnImportar = DxButton({ id: 'btnImportar' }, {
        icon: 'upload',
        text: 'Importar',
        width: 120,
        onClick: function (e) {
            ReadExcel();
        }
    });

    //- Colunas que serão ocultas ao exportar para excel
    let gridExport = new GridExportHide(['lnkEdit', 'lnkDelete']);

    dxGridOptionsExtension = {
        onExporting: gridExport.onExporting,
        onExported: gridExport.onExported,
        dataSource: dscAgendamentos,
        paging: { pageSize: 10 },
        filterRow: {
            visible: true,
            applyFilter: "auto"
        },
        grouping: {
            autoExpandAll: true,
        },
        groupPanel: {
            visible: true
        },
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
                        d.cdFilial + "&" + d.dtAgendamento + "&" + d.cdProfissional + "\")' id='lnkEdit' title=''><i class='fa fa-pencil text-info' style='font-size: 15px;'></i></a>";
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
                        d.cdFilial + "&" + d.dtAgendamento + "&" + d.cdProfissional + "\")' id='lnkDelete' title=''><i class='fa fa-trash text-info' style='font-size: 15px;'></i></a>";
                    $('<div>').append(template).appendTo(container);
                }
            },
            { dataField: 'cdFilial', caption: 'Filial', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'dsProfissional', caption: 'Profissional', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'dsProcedimento', caption: 'Procedimento', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'dsLocal', caption: 'Local', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'dtAgendamento', caption: 'Data Hora', encodeHtml: false, alignment: 'left', showInColumnChooser: false, dataType: 'datetime' },
            { dataField: 'cdGrupoFolga', caption: 'Grupo Folga', encodeHtml: false, alignment: 'center', showInColumnChooser: false }
        ]
    };

    grdAgendamentos = DxDataGrid({ id: 'grdAgendamentos' }, dxGridOptionsExtension);    
}

function GetAgendamentos() {
    const data = { url: recursoApi + '/GetAgendamentoCadastros'}

    const success = (response) => {
        if (response.success) {
            dscAgendamentos = new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    let d = $.Deferred();

                    d.resolve(response.data, {});

                    return d.promise();
                }
            });

            dscAgendamentos.load();

            grdAgendamentos.option('dataSource', dscAgendamentos);
            grdAgendamentos.refresh();
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function Clear() {
    slbFilial.reset();
    slbFilial.option('readOnly', false);
    slbProfissional.reset();
    slbProfissional.option('readOnly', false);
    slbProfissional.option('dataSource', []);
    nbbGrupoFolga.option('value', null);
    slbProcedimento.reset();
    slbProcedimento.option('dataSource', []);
    dtbPeriodo.option('value', moment().format());
    dtbPeriodo.option('readOnly', false);
    slbLocal.reset();
    slbLocal.option('dataSource', []);
    cdAgendamentoUpdate = null;
}

function CheckFields() {
    let isValid = true;

    if (!slbFilial.option('value')) {
        isValid = false;
    }

    if (!slbProfissional.option('value')) {
        isValid = false;
    }

    if (!nbbGrupoFolga.option('value')) {
        isValid = false;
    }

    if (!slbProcedimento.option('value')) {
        isValid = false;
    }

    if (!dtbPeriodo.option('value')) {
        isValid = false;
    }

    if (!slbLocal.option('value')) {
        isValid = false;
    }

    return isValid;
}

function Save() {
    if (CheckFields()) {
        let agendamento = null;
        let data = null;

        if (cdAgendamentoUpdate) {
            agendamento = GetAgendamento(cdAgendamentoUpdate);
        }
        else {
            agendamento = GetAgendamento();
        }

        data = { url: recursoApi, body: JSON.stringify(agendamento) }

        const success = (response) => {
            if (response.data) {
                GetAgendamentos();

                if (cdAgendamentoUpdate) {
                    ShowMessage('success', 'Agendamento atualizado com sucesso!');
                }
                else {
                    ShowMessage('success', 'Agendamento cadastrado com sucesso!');
                }

                Clear();
            }
            else {
                CheckError(response);
            }
        }

        if (cdAgendamentoUpdate) {
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

function GetAgendamento(cdAgendamento) {
    if (cdAgendamento) {
        return {
            cdFilial: cdAgendamento,
            cdProcedimento: slbProcedimento.option('value'),
            dtAgendamento: dtbPeriodo.option('value'),
            cdProfissional: slbProfissional.option('value'),
            cdSituacao: 1,
            cdLocal: slbLocal.option('value'),
            cdGrupoFolga: nbbGrupoFolga.option('value')
        }
    }
    else {
        return {
            cdFilial: slbFilial.option('value'),
            cdProcedimento: slbProcedimento.option('value'),
            dtAgendamento: dtbPeriodo.option('value'),
            cdProfissional: slbProfissional.option('value'),
            cdSituacao: 1,
            cdLocal: slbLocal.option('value'),
            cdGrupoFolga: nbbGrupoFolga.option('value')
        }
    }
}

function LoadFields(cdKey) {
    const data = { url: recursoApi + '/' + cdKey }

    const success = (response) => {
        if (response.success) {
            cdAgendamentoUpdate = response.data.cdFilial;
            slbFilial.option('value', response.data.cdFilial);
            slbFilial.option('readOnly', true);
            slbProfissional.option('value', response.data.cdProfissional);
            slbProfissional.option('readOnly', true);
            nbbGrupoFolga.option('value', response.data.cdGrupoFolga);
            slbProcedimento.option('value', response.data.cdProcedimento);
            dtbPeriodo.option('value', response.data.dtAgendamento);
            dtbPeriodo.option('readOnly', true);
            slbLocal.option('value', response.data.cdLocal);
        }
        else {
            CheckError(response);
        }
    }

    SaudeSegurancaGet(data, success, error);
}

function DeleteField(cdKey){
    let result = DevExpress.ui.dialog.confirm('<i>Deseja excluir o agendamento?</i>', 'Confirma exclusão');

    result.done(function (dialogResult) {
        if (dialogResult) {
            const data = { url: recursoApi + '/' + cdKey }
            const success = (response) => {
                if (response.success) {
                    GetAgendamentos();
                    Clear();
                    ShowMessage('success', 'Agendamento excluido com sucesso!');
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

function GetProfissionais(cdFilial) {
    const data = { url: '/cadastro-de-profissional/GetByFilial/' + cdFilial }

    const success = (response) => {
        if (response.success) {
            slbProfissional.option('dataSource', response.data);
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function GetProfissionalProcedimentos(cdFilial, cdProfissional) {
    const data = { url: '/cadastro-de-profissional/GetProfissionalProcedimentos/' + cdFilial + '&' + cdProfissional}

    const success = (response) => {
        if (response.success) {
            slbProcedimento.option('dataSource', response.data);
        } else {
            CheckError(response);
        }
    };    

    SaudeSegurancaGet(data, success, error);
}

function GetLocais(cdFilial) {
    const data = { url: '/cadastro-de-local/GetByFilial/' + cdFilial }

    const success = (response) => {
        if (response.success) {
            slbLocal.option('dataSource', response.data);
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function ReadExcel() {
    const success = (response) => {
        if (response.success) {
            ShowMessage('success', 'Arquivo importado com sucesso!');
            GetAgendamentos();
            fupDocumentos.reset();
        }
        else {
            CheckError(response);
        }
    };

    if (fupDocumentos.option('value')[0]) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(fupDocumentos.option('value')[0]);
        reader.onload = function () {
            let arrayBuffer = this.result;
            let base64String = arrayBufferToBase64(arrayBuffer);

            data = { url: recursoApi + '/InsertExcel', body: base64String }
            SaudeSegurancaPostByte(data, success, error);
        }
    }
    else {
        ShowMessage('error', 'Selecione um arquivo!');
    }      
}