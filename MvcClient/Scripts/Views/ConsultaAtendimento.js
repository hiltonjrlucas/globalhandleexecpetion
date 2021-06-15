const recursoApi = '/controle-de-atendimento'
var dscAgendaAtendimento = new DevExpress.data.DataSource({});
var grdAgendaAtendimento;

$(document).ready(function () {
    InitializeComponents();
    GetConsultaAtendimento();
});

function InitializeComponents() {
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
            enabled: true
        },
        columnChooser: {
            enabled: true
        },
        columns: [
        { dataField: 'dtAgendamento', caption: 'Data Hora', alignment: 'left', dataType: 'datetime' },
        { dataField: 'dsProfissional', caption: 'Profissional', alignment: 'left' },
        { dataField: 'dsProcedimento', caption: 'Procedimento', alignment: 'left' },
        { dataField: 'dsLocal', caption: 'Local', alignment: 'left' },
        { dataField: 'dsSituacao', caption: 'Situação', alignment: 'left' },
        { dataField: 'cdMatricula', caption: 'Matrícula', alignment: 'left' },
        { dataField: 'dsNome', caption: 'Nome', alignment: 'left' },
        { dataField: 'dsSetor', caption: 'Setor', alignment: 'left' },
        { dataField: 'dsArea', caption: 'Área', alignment: 'left' },
        { dataField: 'dsTipo', caption: 'Tipo', alignment: 'left' },
        { dataField: 'dtHoraChegada', caption: 'Hora Chegada', alignment: 'left', dataType: 'datetime' },
        { dataField: 'dtInicioAtendimento', caption: 'Início Atendimento', alignment: 'left', dataType: 'datetime' },
        { dataField: 'dtFimAtendimento', caption: 'Fim Atendimento', alignment: 'left', dataType: 'datetime' },
        { dataField: 'dsObservacao', caption: 'Observação', alignment: 'left' }
        ]
    };

    grdAgendaAtendimento = DxDataGrid({ id: 'grdAgendaAtendimento' }, dxGridOptionsExtension);
}

function GetConsultaAtendimento() {
    const data = {
        url: recursoApi + '/GetConsultaAtendimento' }

    const success = (response) => {
        if (response.success) {
            dscAgendaAtendimento = new DevExpress.data.DataSource({
                load: function (loadOptions) {
                    let d = $.Deferred();

                    d.resolve(response.data, {});

                    return d.promise();
                }
            });

            dscAgendaAtendimento.load();

            grdAgendaAtendimento.option('dataSource', dscAgendaAtendimento);
            grdAgendaAtendimento.refresh();
        } else {
            CheckError(response);
        }
    };

    SaudeSegurancaGet(data, success, error);
}
