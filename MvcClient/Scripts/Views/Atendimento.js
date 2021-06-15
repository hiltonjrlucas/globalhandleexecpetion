const recursoApi = '/controle-de-atendimento'
const typeUser = sessionStorage.getItem('userAreaMedica');
var slbFilial;
var slbProcedimento;
var btnLimpar;
var grdRelacaoPessoal;
var dscRelacaoPessoal = new DevExpress.data.DataSource({});
var grdAgendaAtendimento;
var rowGrdRelacaoPessoal;
var relacaoPessoal;
var dscSituacao;
var dscTipo;
var dscLocal;
var dscProcedimento;
var dscProfissional;

// Update Grid Agenda de Atendimento
var listAgenda = [];
var dscAgendaAtendimento = new DevExpress.data.DataSource({
    insert: function (values) {
        let keysTemp = {
            cdFilial: slbFilial.option('value'),
            cdProcedimento: values.cdProcedimento,
            dtAgendamento: values.dtAgendamento,
            cdProfissional: values.cdProfissional,
            cdSituacao: values.cdSituacao,
            cdLocal: values.cdLocal,
            idProgramacao: values.idProgramacao,
            cdGrupoFolga: 0,
            cdMatricula: values.cdMatricula,
            dsNome: values.dsNome,
            cdCentroCusto: values.cdCentroCusto,
            dsSetor: values.dsSetor,
            dsArea: values.dsArea,
            cdTipo: values.cdTipo,
            dtHoraChegada: values.dtHoraChegada,
            dtInicioAtendimento: values.dtInicioAtendimento,
            dtFimAtendimento: values.dtFimAtendimento,
            dsObservacao: values.dsObservacao
        }

        InsertAgendamento(keysTemp);
    },
    update: function (key, values) {
        let keysTemp = {
            cdFilial: key.cdFilial,
            cdProcedimento: key.cdProcedimento,
            dtAgendamento: key.dtAgendamento,
            cdProfissional: key.cdProfissional,
            cdSituacao: key.cdSituacao,
            cdLocal: key.cdLocal,
            idProgramacao: key.idProgramacao,
            cdGrupoFolga: key.cdGrupoFolga,
            cdMatricula: key.cdMatricula,
            dsNome: key.dsNome,
            cdCentroCusto: key.cdCentroCusto,
            dsSetor: key.dsSetor,
            dsArea: key.dsArea,
            cdTipo: key.cdTipo,
            dtHoraChegada: key.dtHoraChegada,
            dtInicioAtendimento: key.dtInicioAtendimento,
            dtFimAtendimento: key.dtFimAtendimento,
            dsObservacao: key.dsObservacao
        }

        const agendaUpdated = $.extend({}, keysTemp, values);
        const rowIndex = grdAgendaAtendimento.getRowIndexByKey(key);

        UpdateRowAgendamento(agendaUpdated, rowIndex);        
    },
    load: function () {
        let d = $.Deferred();
        
        d.resolve({ data: listAgenda, totalCount: listAgenda.length });

        return d.promise();
    }
});

$(document).ready(function () {
    InitializeComponents();
    GetFiliais();
    GetSituacoes();
    GetTipos();
});

function InitializeComponents() {
    slbFilial = DxSelectBox({ id: 'slbFilial', description: 'cdFilial', value: 'cdFilial' }, {
        onValueChanged: function (e) {
            if (e.value) {
                GetProcedimentos(e.value);
                GetLocais(e.value);
                GetProfissionais(e.value);
            }
        }
    });

    slbProcedimento = DxSelectBox({ id: 'slbProcedimento', description: 'dsProcedimento', value: 'cdProcedimento' }, {
        onValueChanged: function (e) {
            if (e.value) {
                GetRelacaoPessoal();
                SetColumnsGridAtendimento();
            }
        }
    });

    btnLimpar = DxButton({ id: 'btnLimpar' }, {
        icon: 'clear',
        type: 'normal',
        text: 'Limpar',
        width: 120,
        onClick: function (e) {
            Clear();
        }
    });

    //- Colunas que serão ocultas ao exportar para excel
    let gridExport = new GridExportHide(['lnkEdit', 'lnkDelete']);

    dxGridOptionsExtension = {
        onExporting: gridExport.onExporting,
        onExported: gridExport.onExported,
        dataSource: dscRelacaoPessoal,
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
            { dataField: 'cdMatricula', caption: 'Matrícula', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'dsNome', caption: 'Nome', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'cdCentroCusto', caption: 'Centro Custo', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'dsSetor', caption: 'Setor', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'dsArea', caption: 'Área', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'dsTurno', caption: 'Turno', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'cdGrupoFolga', caption: 'Grupo Folga', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            { dataField: 'dtValidade', caption: 'Data Validade', encodeHtml: false, alignment: 'left', showInColumnChooser: false, dataType: 'date' },
            { dataField: 'dsProcedimento', caption: 'Procedimento', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'dtProgramacao', caption: 'Data Programada', encodeHtml: false, alignment: 'left', showInColumnChooser: false, dataType: 'date' },
            { dataField: 'dsSituacao', caption: 'Situação', encodeHtml: false, alignment: 'left', showInColumnChooser: false }
        ],
        onRowClick: function (e) {
            rowGrdRelacaoPessoal = e.data;            
        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField === "dtValidade" && e.row.data.dtValidade < moment().format()) {
                e.cellElement.css("color", "red");
            }
        }
    };

    grdRelacaoPessoal = DxDataGrid({ id: 'grdRelacaoPessoal' }, dxGridOptionsExtension);

    GetGridAtendimento();
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
            dscProcedimento = response.data;
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function GetRelacaoPessoal() {
    let usuario = sessionStorage.getItem('usuario');

    const data = {
        url: recursoApi + '/GetRelacaoPessoal/' + slbFilial.option('value') + '&' +
                                                  slbProcedimento.option('value') + '&' +
                                                  usuario
    }

    const success = (response) => {
        if (response.success) {
            relacaoPessoal = response.data;

            dscRelacaoPessoal = new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    let d = $.Deferred();

                    d.resolve(response.data, {});

                    return d.promise();
                }
            });

            dscRelacaoPessoal.load();

            grdRelacaoPessoal.option('dataSource', dscRelacaoPessoal);
            grdRelacaoPessoal.refresh();
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function GetAgendaAtendimento() {
    const data = {
        url: recursoApi + '/GetAgendaAtendimento/' + slbFilial.option('value') + '&' +
                                                     slbProcedimento.option('value')
    }

    const success = (response) => {
        if (response.success) {
            const filter = typeUser === 'BBBEC7C3C8C3CDCECCBBBEC9CC' || typeUser === 'BBCEBFC8BEBFC8CEBF' ? false : true;

            listAgenda = response.data;
            dscAgendaAtendimento.load();

            grdAgendaAtendimento.option('dataSource', dscAgendaAtendimento);

            if (filter) {
                grdAgendaAtendimento.columnOption('cdSituacao', 'filterValue', 1);
            }
            
            grdAgendaAtendimento.refresh();
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function GetSituacoes() {
    const data = { url: '/cadastro-situacao-agendamento/GetSituacoesAtivas' }

    const success = (response) => {
        if (response.success) {
            dscSituacao = response.data;
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function GetTipos() {
    const data = { url: '/cadastro-de-tipo/GetTiposAtivos' }

    const success = (response) => {
        if (response.success) {
            dscTipo = response.data;
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
            dscLocal = response.data;
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
            dscProfissional = response.data;
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}

function Clear() {
    slbFilial.reset();
    slbProcedimento.reset();
    grdRelacaoPessoal.option('dataSource', '');
    grdAgendaAtendimento.option('dataSource', '');
    grdAgendaAtendimento.option('columns', []);
}

function SetAgenda(id) {
    let rowGrdAgenda = grdAgendaAtendimento.getKeyByRowIndex(id);

    if (rowGrdRelacaoPessoal) {

        if (rowGrdAgenda.cdGrupoFolga === rowGrdRelacaoPessoal.cdGrupoFolga && rowGrdRelacaoPessoal.dsTurno !== 'D') {
            const acao = (result) => {
                if (result) {
                    ConfirmAgenda(id, rowGrdAgenda);
                } else {
                    ShowMessage('warning', 'Atendimento cancelado pelo usuário');
                }
            };

            ShowDialog("Funcionário é da mesma tabela de folga da data do agendamento! Confirma o atendimento? ", acao, DialogTypes.question, "Confirma atendimento");
        }
        else {
            ConfirmAgenda(id, rowGrdAgenda);
        }
    }
    else {
        ShowMessage('error', 'Selecione um funcionário!');
    }
}

function RemoveAgenda(id) {
    let rowGrdAgenda = grdAgendaAtendimento.getKeyByRowIndex(id);
    let date = moment().add(1, 'days').format();

    let rowProgramacao = relacaoPessoal.find(x => x.cdMatricula === rowGrdAgenda.cdMatricula);

    if (rowProgramacao && (rowGrdAgenda.cdSituacao === 2)) {
        if (rowGrdAgenda.dtAgendamento > date) {
            let agendamento = GetAgenda(id);
            agendamento.cdMatricula = null;
            agendamento.cdCentroCusto = null;
            agendamento.dsNome = null;
            agendamento.dsSetor = null;
            agendamento.dsArea = null;
            agendamento.cdSituacao = 1;
            agendamento.cdTipo = null;
            agendamento.idProgramacao = null;
            UpdateAgendamento(agendamento);

            let programacao = GetProgramacao(id);

            if (programacao.idProgramacao) {
                programacao.cdSituacao = 0;
                UpdateProgramacao(programacao);
            }

            ShowMessage('success', 'Agenda Removida!');
        }
        else {
            ShowMessage('error', 'Cancelamento permitido apenas com 24h de antecedência!');
        }
        
    }
    else {
        ShowMessage('error', 'Cancelamento não permitido!');
    }

}

function GetAgenda(id) {
    let rowGrdAgenda = grdAgendaAtendimento.getKeyByRowIndex(id);

    return {
        cdFilial: rowGrdAgenda.cdFilial,
        cdProcedimento: rowGrdAgenda.cdProcedimento,
        dtAgendamento: rowGrdAgenda.dtAgendamento,
        cdProfissional: rowGrdAgenda.cdProfissional,
        cdSituacao: rowGrdAgenda.cdSituacao,
        cdLocal: rowGrdAgenda.cdLocal,
        idProgramacao: rowGrdAgenda.idProgramacao,
        cdGrupoFolga: rowGrdAgenda.cdGrupoFolga,
        cdMatricula: rowGrdAgenda.cdMatricula,
        dsNome: rowGrdAgenda.dsNome,
        cdCentroCusto: rowGrdAgenda.cdCentroCusto,
        dsSetor: rowGrdAgenda.dsSetor,
        dsArea: rowGrdAgenda.dsArea,
        cdTipo: rowGrdAgenda.cdTipo,
        dtHoraChegada: rowGrdAgenda.dtHoraChegada,
        dtInicioAtendimento: rowGrdAgenda.dtInicioAtendimento,
        dtFimAtendimento: rowGrdAgenda.dtFimAtendimento,
        dsObservacao: rowGrdAgenda.dsObservacao
    }
}

function GetProgramacao(id) {
    if (id >= 0) {
        let rowGrdAgenda = grdAgendaAtendimento.getKeyByRowIndex(id);
        let rowProgramacao = relacaoPessoal.find(x => x.idProgramacao === rowGrdAgenda.idProgramacao);

        if (rowProgramacao) {
            return {
                idProgramacao: rowProgramacao.idProgramacao,
                cdFilial: slbFilial.option('value'),
                cdProcedimento: slbProcedimento.option('value'),
                cdMatricula: rowProgramacao.cdMatricula,
                dtValidade: rowProgramacao.dtValidade,
                cdSituacao: rowProgramacao.cdSituacao
            }
        }
        else {
            return null
        }
        
    }
    else {
        return {
            idProgramacao: rowGrdRelacaoPessoal.idProgramacao,
            cdFilial: slbFilial.option('value'),
            cdProcedimento: slbProcedimento.option('value'),
            cdMatricula: rowGrdRelacaoPessoal.cdMatricula,
            dtValidade: rowGrdRelacaoPessoal.dtValidade,
            cdSituacao: rowGrdRelacaoPessoal.cdSituacao
        }
    }
}

function UpdateAgendamento(agendamento) {
    data = { url: '/cadastro-de-agendamento', body: JSON.stringify(agendamento) }

    const success = (response) => {
        if (response.data) {
            GetAgendaAtendimento();
        }
        else {
            CheckError(response);
        }
    }

    SaudeSegurancaPut(data, success, error);
}

function UpdateProgramacao(programacao) {
    data = { url: '/cadastro-de-programacao', body: JSON.stringify(programacao) }

    const success = (response) => {
        if (response.data) {
            GetRelacaoPessoal();
        }
        else {
            CheckError(response);
        }
    }

    SaudeSegurancaPut(data, success, error);
}

function InsertAgendamento(agendamento) {
    data = { url: '/cadastro-de-agendamento', body: JSON.stringify(agendamento) }

    const success = (response) => {
        if (response.data) {
            GetAgendaAtendimento();
        }
        else {
            CheckError(response);
        }
    }

    SaudeSegurancaPost(data, success, error);
}

function InsertProgramacao(programacao) {
    data = { url: '/cadastro-de-programacao', body: JSON.stringify(programacao) }

    const success = (response) => {
        if (response.data) {
            GetRelacaoPessoal();
        }
        else {
            CheckError(response);
        }
    }

    SaudeSegurancaPost(data, success, error);
}

function ConfirmAgenda(id, rowGrdAgenda) {
    if (!rowGrdRelacaoPessoal.dtProgramacao & rowGrdAgenda.cdSituacao === 1) {
        let agendamento = GetAgenda(id);
        agendamento.cdMatricula = rowGrdRelacaoPessoal.cdMatricula;
        agendamento.cdCentroCusto = rowGrdRelacaoPessoal.cdCentroCusto;
        agendamento.dsNome = rowGrdRelacaoPessoal.dsNome;
        agendamento.dsSetor = rowGrdRelacaoPessoal.dsSetor;
        agendamento.dsArea = rowGrdRelacaoPessoal.dsArea;
        agendamento.cdSituacao = 2;
        agendamento.cdTipo = 2;
        agendamento.idProgramacao = rowGrdRelacaoPessoal.idProgramacao;
        UpdateAgendamento(agendamento);
        
        let programacao = GetProgramacao();

        if (programacao.idProgramacao) {
            programacao.cdSituacao = 1;
            UpdateProgramacao(programacao);
        }
        

        ShowMessage('success', 'Procedimento programado com sucesso!');
    }
    else {
        ShowMessage('error', 'Procedimento já programado!');
    }
}

function GetGridAtendimento() {
    const allowModify = typeUser === 'BBBEC7C3C8C3CDCECCBBBEC9CC' || typeUser === 'BBCEBFC8BEBFC8CEBF' ? true : false;

    //- Colunas que serão ocultas ao exportar para excel
    let gridExport = new GridExportHide(['lnkEdit', 'lnkDelete']);

    dxGridOptionsExtension = {
        onExporting: gridExport.onExporting,
        onExported: gridExport.onExported,
        dataSource: dscAgendaAtendimento,
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
            enabled: allowModify
        },
        columnChooser: {
            enabled: false
        },
        editing: {
            mode: 'batch',
            refreshMode: 'reshape',
            allowUpdating: allowModify,
            allowAdding: allowModify,
            selectTextOnEditStart: true,
            startEditAction: 'click'
        },
        onCellPrepared: function(e) {
            if (e.rowType === 'data' && e.row.inserted && e.column.dataField !== 'lnkEdit' && e.column.dataField !== 'lnkDelete') {
                e.column.allowEditing = true;
            } else {
                if (e.column.dataField === 'dtAgendamento' || e.column.dataField === 'cdProfissional') {
                    e.column.allowEditing = false;
                }
            }            
        },
        onCellDblClick: function (e) {
            switch (e.column.dataField) {
                case 'dtHoraChegada':
                    $('#grdAgendaAtendimento').dxDataGrid('cellValue', e.rowIndex, e.columnIndex, moment().format());
                    break;
                case 'dtInicioAtendimento':
                    $('#grdAgendaAtendimento').dxDataGrid('cellValue', e.rowIndex, e.columnIndex, moment().format());
                    break;
                case 'dtFimAtendimento':
                    $('#grdAgendaAtendimento').dxDataGrid('cellValue', e.rowIndex, e.columnIndex, moment().format());
                    break;
                default:
                    break;
            }
        },
        columns: []
    };

    grdAgendaAtendimento = DxDataGrid({ id: 'grdAgendaAtendimento' }, dxGridOptionsExtension);    
}

function SetColumnsGridAtendimento() {
    let columns = [
        {
            dataField: 'lnkEdit',
            caption: '',
            width: '30px',
            allowEditing: false,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var id = options.row.rowIndex
                var template = "<a href='javascript:SetAgenda(\"" +
                    id + "\")' id='lnkEdit' title=''><i class='fa fa-calendar-plus-o text-info' style='font-size: 15px;'></i></a>";
                $('<div>').append(template).appendTo(container);
                options.row.value = options.row.rowIndex;
            }
        },
        {
            dataField: 'lnkDelete',
            caption: '',
            width: '30px',
            allowEditing: false,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var id = options.row.rowIndex
                var template = "<a href='javascript:RemoveAgenda(\"" +
                    id + "\")' id='lnkEdit' title=''><i class='fa fa-calendar-minus-o text-info' style='font-size: 15px;'></i></a>";
                $('<div>').append(template).appendTo(container);
            }
        },
        { dataField: 'dtAgendamento', caption: 'Data Hora', alignment: 'left', dataType: 'datetime', allowEditing: false, validationRules: [{ type: "required" }] },
        {
            dataField: 'cdProfissional', caption: 'Profissional', alignment: 'left', allowEditing: false, validationRules: [{ type: "required" }],
            lookup: {
                dataSource: dscProfissional,
                displayExpr: "dsProfissional",
                valueExpr: "cdProfissional"
            }
        },
        {
            dataField: 'cdProcedimento', caption: 'Procedimento', alignment: 'left', width: '130px', validationRules: [{ type: "required" }],
            lookup: {
                dataSource: dscProcedimento,
                displayExpr: "dsProcedimento",
                valueExpr: "cdProcedimento"
            }
        },
        {
            dataField: 'cdLocal', caption: 'Local', alignment: 'left', width: '130px', validationRules: [{ type: "required" }],
            lookup: {
                dataSource: dscLocal,
                displayExpr: "dsLocal",
                valueExpr: "cdLocal"
            }
        },
        {
            dataField: 'cdSituacao', caption: 'Situação', alignment: 'left', width: '130px', validationRules: [{ type: "required" }],
            lookup: {
                dataSource: dscSituacao,
                displayExpr: "dsSituacao",
                valueExpr: "cdSituacao"
            }
        },
        { dataField: 'cdMatricula', caption: 'Matrícula', alignment: 'left' },
        { dataField: 'dsNome', caption: 'Nome', alignment: 'left' },
        { dataField: 'dsSetor', caption: 'Setor', alignment: 'left' },
        { dataField: 'dsArea', caption: 'Área', alignment: 'left' },
        {
            dataField: 'cdTipo', caption: 'Tipo', alignment: 'left', width: '130px',
            lookup: {
                dataSource: dscTipo,
                displayExpr: "dsTipo",
                valueExpr: "cdTipo"
            }
        },
        { dataField: 'dtHoraChegada', caption: 'Hora Chegada', alignment: 'left', dataType: 'datetime' },
        { dataField: 'dtInicioAtendimento', caption: 'Início Atendimento', alignment: 'left', dataType: 'datetime' },
        { dataField: 'dtFimAtendimento', caption: 'Fim Atendimento', alignment: 'left', dataType: 'datetime' },
        { dataField: 'dsObservacao', caption: 'Observação', alignment: 'left' }
    ]

    grdAgendaAtendimento.option('columns', columns);

    GetAgendaAtendimento();
}

function UpdateRowAgendamento(rowAgenda, id) {
    const checkSituacao = [6, 7, 8];
    let rowBefore = grdAgendaAtendimento.getKeyByRowIndex(id);

    if (!rowBefore.dtHoraChegada) {
        if (rowAgenda.dtHoraChegada) {
            rowAgenda.cdSituacao = 3;
        }        
    }

    if (!rowBefore.dtInicioAtendimento) {
        if (rowAgenda.dtInicioAtendimento) {
            rowAgenda.cdSituacao = 4;
        }
    }

    if (!rowBefore.dtFimAtendimento) {
        if (rowAgenda.dtFimAtendimento) {
            rowAgenda.cdSituacao = 5
        }
    }

    if (rowBefore !== 6 & rowAgenda.cdSituacao === 6) {
        if (typeUser === 'BBCEBFC8BEBFC8CEBF' & rowBefore.dtAgendamento < moment().format()) {
            rowAgenda.cdSituacao = rowBefore.cdSituacao;
            ShowMessage('error', 'Cancelamento não permitido');
        }       
    }

    UpdateAgendamento(rowAgenda);

    if (checkSituacao.find(element => element === rowAgenda.cdSituacao)) {
        let programacao = GetProgramacao(id);
        if (programacao) {
            // Cria nova programação
            delete programacao.idProgramacao
            InsertProgramacao(programacao);
        }                        
    }    
}