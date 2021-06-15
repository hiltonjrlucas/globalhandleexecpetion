const recursoApi = '/cadastro-de-programacao'
var slbFilial;
var slbProcedimento;
var slbMatricula;
var dtbValidade;
var btnCancelar;
var btnSalvar;
var fupDocumentos;
var btnLimpar;
var btnImportar;
var grdProgramacoes;
var dscProgramacoes = new DevExpress.data.DataSource({});
var cdProgramacaoUpdate;

$(document).ready(function () {
    InitializeComponents();
    GetFiliais();
    GetProgramacoes();
});

function InitializeComponents() {
    slbFilial = DxSelectBox({ id: 'slbFilial', description: 'cdFilial', value: 'cdFilial' }, {
        onValueChanged: function (e) {
            if (e.value) {
                GetProcedimentos(e.value);
                GetUsuarios(e.value);
            }
        }
    });

    slbProcedimento = DxSelectBox({ id: 'slbProcedimento', description: 'dsProcedimento', value: 'cdProcedimento' }, {});

    slbMatricula = DxSelectBox({ id: 'slbMatricula', description: 'dsUsuario', value: 'cdUsuario' }, {});

    dtbValidade = DxDateBox({ id: 'dtbValidade' }, {});    

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
        dataSource: dscProgramacoes,
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
                        d.idProgramacao + "\")' id='lnkEdit' title=''><i class='fa fa-pencil text-info' style='font-size: 15px;'></i></a>";
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
                        d.idProgramacao + "\")' id='lnkDelete' title=''><i class='fa fa-trash text-info' style='font-size: 15px;'></i></a>";
                    $('<div>').append(template).appendTo(container);
                }
            },
            { dataField: 'cdFilial', caption: 'Filial', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'procedimento.dsProcedimento', caption: 'Procedimento', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'cdMatricula', caption: 'Matrícula', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'dtValidade', caption: 'Data Validade', encodeHtml: false, alignment: 'left', showInColumnChooser: false, dataType: 'date' }
        ]
    };

    grdProgramacoes = DxDataGrid({ id: 'grdProgramacoes' }, dxGridOptionsExtension);
}

function GetProgramacoes() {
    const data = { url: recursoApi }

    const success = (response) => {
        if (response.success) {
            dscProgramacoes = new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    let d = $.Deferred();

                    d.resolve(response.data, {});

                    return d.promise();
                }
            });

            dscProgramacoes.load();

            grdProgramacoes.option('dataSource', dscProgramacoes);
            grdProgramacoes.refresh();
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function Clear() {
    slbFilial.reset();
    slbFilial.option('readOnly', false);
    slbProcedimento.reset();
    slbProcedimento.option('dataSource', []);
    slbMatricula.reset();
    slbMatricula.option('dataSource', []);
    dtbValidade.option('value', moment().format());
    dtbValidade.option('readOnly', false);
    cdProgramacaoUpdate = null;
}

function CheckFields() {
    let isValid = true;

    if (!slbFilial.option('value')) {
        isValid = false;
    }

    if (!slbProcedimento.option('value')) {
        isValid = false;
    }

    if (!slbMatricula.option('value')) {
        isValid = false;
    }

    if (!dtbValidade.option('value')) {
        isValid = false;
    }    

    return isValid;
}

function Save() {
    if (CheckFields()) {
        let programacao = null;
        let data = null;

        if (cdProgramacaoUpdate) {
            programacao = GetProgramacao(cdProgramacaoUpdate);
        }
        else {
            programacao = GetProgramacao();
        }

        data = { url: recursoApi, body: JSON.stringify(programacao) }

        const success = (response) => {
            if (response.data) {
                GetProgramacoes();

                if (cdProgramacaoUpdate) {
                    ShowMessage('success', 'Programação atualizada com sucesso!');
                }
                else {
                    ShowMessage('success', 'Programação cadastrada com sucesso!');
                }

                Clear();
            }
            else {
                CheckError(response);
            }
        }

        if (cdProgramacaoUpdate) {
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

function GetProgramacao(idProgramacao) {
    if (idProgramacao) {
        return {
            cdFilial: slbFilial.option('value'),
            cdProcedimento: slbProcedimento.option('value'),
            cdMatricula: slbMatricula.option('value'),
            dtValidade: dtbValidade.option('value'),
            idProgramacao: idProgramacao,
            cdSituacao: 0
        }
    }
    else {
        return {
            cdFilial: slbFilial.option('value'),
            cdProcedimento: slbProcedimento.option('value'),
            cdMatricula: slbMatricula.option('value'),
            dtValidade: dtbValidade.option('value'),
            cdSituacao: 0
        }
    }
}

function LoadFields(cdKey) {
    const data = { url: recursoApi + '/' + cdKey }

    const success = (response) => {
        if (response.success) {
            cdProgramacaoUpdate = response.data.idProgramacao;
            slbFilial.option('value', response.data.cdFilial);
            slbProcedimento.option('value', response.data.cdProcedimento);
            slbMatricula.option('value', response.data.cdMatricula);
            dtbValidade.option('value', response.data.dtValidade);            
        }
        else {
            CheckError(response);
        }
    }

    SaudeSegurancaGet(data, success, error);
}

function DeleteField(cdKey) {
    let result = DevExpress.ui.dialog.confirm('<i>Deseja excluir a programação?</i>', 'Confirma exclusão');

    result.done(function (dialogResult) {
        if (dialogResult) {
            const data = { url: recursoApi + '/' + cdKey }
            const success = (response) => {
                if (response.success) {
                    GetProgramacoes();
                    Clear();
                    ShowMessage('success', 'Programação excluida com sucesso!');
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

function GetUsuarios(cdFilial) {
    const data = { url: '/BCU/GetFuncionarios/' + cdFilial }

    const success = (response) => {
        if (response.success) {
            slbMatricula.option('dataSource', response.data);
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function ReadExcel() {
    const success = (response) => {
        if (response.success) {
            ShowMessage('success', response.data + ' registro(s) importado(s) com sucesso!');
            GetProgramacoes();
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