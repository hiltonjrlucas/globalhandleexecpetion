let dtbAnoMes;
let slbTipoFolha;
let grdDetalhamento;

let btnExportPdf;
let btnExportExcel;

let detalheFolhaPagamento = [];

$(function () {
    moment.updateLocale('pt-br', {
        months: [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
            "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ]
    });

    dtbAnoMes = DxDateBox({ id: 'dtbAnoMes' }, {
        displayFormat: "MM/yyyy",
        calendarOptions: {
            zoomLevel: "year",
            maxZoomLevel: "year"
        },
        onValueChanged: () => {
            LoadResumo();
        }
    });
    slbTipoFolha = DxSelectBox({ id: 'slbTipoFolha', description: 'exibicao', value: 'value' }, {
        dataSource: getTipoFolha(),
        value: 0,
        onValueChanged: (e) => {
            LoadResumo();
        }
    });

    btnExportPdf = DxButton({ id: 'btnExportPdf', text: 'Pdf' }, {
        icon: 'exportpdf',
        onClick: () => LoadExport('pdf'),
        type: 'danger'
    });

    btnExportExcel = DxButton({ id: 'btnExportExcel', text: 'Excel' }, {
        icon: 'exportxlsx',
        onClick: () => LoadExport('excel'),
        type: 'success'
    });

    grdDetalhamento = DxDataGrid({ id: 'grdDetalhamento' }, getGridExtension());

    LoadResumo();
});

function getGridExtension() {
    return {
        paging: { pageSize: 25 },
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
            { dataField: 'codEvento', caption: 'Evento', width: 70, encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'desEvento', caption: 'Descrição', encodeHtml: false, alignment: 'left', showInColumnChooser: false },
            { dataField: 'idiTipoEvt', caption: 'Base', encodeHtml: false, alignment: 'center', showInColumnChooser: false },
            {
                dataField: 'qtdUnidadeEvt', caption: 'Quantidade', encodeHtml: false, alignment: 'right', showInColumnChooser: false,
                format: { type: 'fixedPoint', precision: 3 }
            },
            {
                dataField: 'valEvt', caption: 'Valor', encodeHtml: false, alignment: 'right', showInColumnChooser: false,
                format: { type: 'fixedPoint', precision: 2 }
            }
        ],
        onExporting: function (e) {
            var mes = $('#h3Resumo')[0].innerText.split(' ')[2].replace('/', '-');
            var workbook = new ExcelJS.Workbook();
            var worksheet = workbook.addWorksheet('demonstrativo-pagamento');

            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet: worksheet,
                autoFilterEnabled: true
            }).then(function () {
                workbook.xlsx.writeBuffer().then(function (buffer) {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `demonstrativo-pagamento-${mes}.xlsx`);
                });
            });
            e.cancel = true;
        }
    };
}

function getTipoFolha() {
    return [
        { exibicao: 'Todos', value: 0, color: '' },
        { exibicao: 'Normal', value: 1, color: 'bg-vicunha-blue' },
        { exibicao: 'Adiantamento Normal', value: 2, color: 'bg-vicunha-roxo' },
        { exibicao: '13º Salário', value: 3, color: 'bg-vicunha-orange' },
        { exibicao: 'Adiantamento 13º Salário', value: 4, color: 'bg-vicunha-yellow' }
    ];
}

function LoadResumo() {
    const referencia = moment(dtbAnoMes.option('value')).format('MM-dd-yyyy').split('-');
    const body = {
        codUsuario: sessionStorage.getItem('usuario'),
        mesRef: referencia[0],
        anoRef: referencia[2],
        idTipoFolha: slbTipoFolha.option('value') || 0,
        pasUsuario: '_key'
    };

    const data = { url: '/demonstrativo-pagamento-hcm/resumo', body: JSON.stringify(body) };
    const success = (response) => {
        if (response.success) {
            if (response.data.authenticated) {
                detalheFolhaPagamento = [];
                var list = document.getElementById('divDemonstrativos');
                list.innerHTML = '';

                response.data.resumos.map(item => {
                    var div = document.createElement('div');
                    div.innerHTML = createResumoItemElement(item);
                    div.classList = 'col-lg-3 col-md-4 col-sm-6';
                    list.appendChild(div);

                    detalheFolhaPagamento.push({
                        mesRef: item.numMesRefer,
                        anoRef: item.numAnoRefer,
                        idTipoFolha: item.idiTipoFolha,
                        parcela: item.numParcelaFolha
                    });
                });

                if (response.data.resumos.length > 0) {
                    $('#description').text('Resumo');
                } else {
                    $('#description').text('Nenhum resumo a ser exibido.');
                }
            } else {
                ShowMessage('error', response.data.error);
                Logout();
            }
        } else {
            CheckError(response);
        }
    };

    AppServerPost(data, success, error);
}

function LoadDetalhamento(param) {
    if (param) {
        const data = { url: '/demonstrativo-pagamento-hcm/detalhe', body: JSON.stringify(param) };
        const success = (response) => {
            if (response.success) {
                if (response.data.authenticated) {
                    const folha = response.data.folhaPagamento;
                    $('#h3Resumo').text(`Resumo de ${moment(new Date(folha.numAnoRefer, folha.numMesRefer - 1, 1)).locale('pt-br').format('MMMM/yyyy')}`);
                    $('#spanSalarioBase').text(`${MoneyFormat(folha.valSalario)}`);
                    $('#spanTotalProventos').text(`${MoneyFormat(folha.valProventos)}`);
                    $('#spanTotalDescontos').text(`${MoneyFormat(folha.valDescontos)}`);
                    $('#spanFGTS').text(`${MoneyFormat(folha.valFGTS)}`);
                    $('#spanSalarioLiquido').text(`${MoneyFormat(folha.valLiquido)}`);

                    grdDetalhamento.option('dataSource', response.data.eventos);
                    $('#modalDetalhePagamento').modal();

                    return;
                } else {
                    ShowMessage('error', response.data.error);
                    Logout();
                }
            } else {
                CheckError(response);
            }
        };

        AppServerPost(data, success, error);
    }
}

function LoadExport(type) {
    if (detalheFolhaPagamento.length > 0) {
        const body = {
            codUsuario: sessionStorage.getItem('usuario'),
            pasUsuario: '_key',
            nomeUsuario: sessionStorage.getItem('nomeUsuario'),
            cargoUsuario: sessionStorage.getItem('cargo'),
            exportType: type,
            demonstrativos: detalheFolhaPagamento
        };
        const data = { url: `/demonstrativo-pagamento-hcm/export`, body: JSON.stringify(body) };
        const success = (response) => {
            if (response.success) {
                ExportFile({
                    content: response.data.fileContents,
                    contentType: response.data.contentType,
                    fileName: response.data.fileDownloadName
                });
            } else {
                CheckError(response);
            }
        };

        AppServerDownloadFile(data, success, error);
    } else {
        ShowMessage('info', 'Não foi encontrado Demonstrativo para Exportar.');
    }
}

function createResumoItemElement(data) {
    const tipoFolha = getTipoFolha().find(f => f.value === data.idiTipoFolha);

    const param = JSON.stringify({
        codUsuario: data.codUsuario,
        mesRef: data.numMesRefer,
        anoRef: data.numAnoRefer,
        idTipoFolha: data.idiTipoFolha,
        parcela: data.numParcelaFolha,
        pasUsuario: '_key'
    }).replace(/'/g, "\\'").replace(/"/g, "'");

    return `
        <div class="small-box bg-vicunha-default">
            <div class="inner">
                <h4 style="margin-bottom: 0;">${moment(new Date(data.numAnoRefer, data.numMesRefer - 1, 1)).locale('pt-br').format('MMMM/yyyy')} </h4>
                <span class="label ${tipoFolha.color}">${tipoFolha.exibicao}</span>

                <p style="margin: 10px 0 0;">Salário Líquido</p>
                <h3>${MoneyFormat(data.valLiquido)}</h3>

                <div class="icon">
                    <i class="fa fa-usd"></i>
                </div>

                <label>Pagamento ${moment.utc(new Date(data.datPagamento)).format('DD/MM')}</label>
            </div>            
            <a href="#" onclick="LoadDetalhamento(${param});" class="small-box-footer bg-vicunha-green">
              Detalhes <i class="fa fa-arrow-circle-right"></i>
            </a>
        </div>`;
}
