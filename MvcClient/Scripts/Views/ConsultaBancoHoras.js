let slbAnos;
let btnConsultar;

let spanPositivoMes;
let spanNegativoMes;
let spanSaldoMes;
let grdLancamentos;

$(function () {
    slbAnos = DxSelectBox({ id: 'slbAnos', value: 'value', description: 'value' }, {
        dataSource: GetUserYears(),
        value: new Date().getFullYear(),
        onValueChanged: () => LoadResumo()
    });

    grdLancamentos = DxDataGrid({ id: 'grdLancamentos' }, getGridExtension());

    LoadResumo();
});

function getGridExtension() {
    return {
        pager: { visible: false },
        paging: { pageSize: 60 },
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
                dataField: 'dataLancto', caption: 'Dia', width: 70, encodeHtml: false, alignment: 'left', showInColumnChooser: false,
                cellTemplate: function (container, options) {
                    const referencia = moment(new Date(options.data.dataLancto)).format('DD ddd');
                    $("<span>")
                        .text(referencia)
                        .appendTo(container);
                    container.append(" ");
                }
            },
            {
                dataField: 'tipoLancto', caption: 'Tipo de Lançamento(+/-)', encodeHtml: false, alignment: 'center', showInColumnChooser: false,
                cellTemplate: function (container, options) {
                    const tipoLancto = options.data.tipoLancto === 1 ? '+' : '-';
                    $("<span>")
                        .text(tipoLancto)
                        .appendTo(container);
                    container.append(" ");
                }
            },
            {
                dataField: 'hraIniLancto', caption: 'Hora Inicial', encodeHtml: false, alignment: 'center', showInColumnChooser: false
            },
            {
                dataField: 'hraFimLancto', caption: 'Hora Final', encodeHtml: false, alignment: 'center', showInColumnChooser: false
            },
            {
                dataField: 'qtdHrsLancto', caption: 'Total de Horas', encodeHtml: false, alignment: 'center', showInColumnChooser: false
            }
        ],
        onExporting: function (e) {
            var workbook = new ExcelJS.Workbook();
            var worksheet = workbook.addWorksheet('Companies');

            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet: worksheet,
                keepColumnWidths: false,
                topLeftCell: { row: 2, column: 2 },
                customizeCell: function (options) {
                    var { gridCell, cell } = options;
                    if (gridCell.rowType === "header") {
                        cell.font = { bold: true };
                    }

                    if (gridCell.rowType === "data") {
                        if (gridCell.column.dataField === 'dataLancto') {
                            cell.value = moment(new Date(gridCell.value)).format('DD ddd');
                        }
                        if (gridCell.column.dataField === 'tipoLancto') {
                            cell.value = gridCell.value === 1 ? '+' : '-';
                        }
                    }

                    cell.alignment = { horizontal: 'center' };
                }
            }).then(function () {
                workbook.xlsx.writeBuffer().then(function (buffer) {
                    saveAs(new Blob([buffer], { type: "application/octet-stream" }), `banco-horas-${new Date().getTime()}.xlsx`);
                });
            });
            e.cancel = true;
        }
    };
}

function LoadResumo() {
    const ano = slbAnos.option('displayValue');
    const body = {
        codUsuario: sessionStorage.getItem('usuario'),
        mesRefIni: 1,
        anoRefIni: ano,
        mesRefFim: 12,
        anoRefFim: ano
    };

    const data = { url: '/banco-horas-hcm/resumo', body: JSON.stringify(body) };
    const success = (response) => {
        if (response.success) {
            var list = document.getElementById('divResumoMensal');
            list.innerHTML = '';

            response.data.resumos.map(item => {
                var li = document.createElement('li');
                li.innerHTML = createElementBH(item);
                list.appendChild(li);
            });

            if (response.data.resumos.length > 0) {
                $('#description').text('Resumo Mensal');
                $('#spanSaldoAnoAnterior').text(response.data.saldoAnoAnterior);
                $('#spanSaldoAtual').text(response.data.saldoAtual);

                if (response.data.saldoAtual.includes('-')) {
                    $('#divSaldo').removeClass('bg-vicunha-green').removeClass('bg-vicunha-blue').addClass('bg-red');
                } else if (response.data.qtdSaldoAtual === '00:00') {
                    $('#divSaldo').removeClass('bg-red').removeClass('bg-vicunha-green').addClass('bg-vicunha-blue');
                } else {
                    $('#divSaldo').removeClass('bg-red').removeClass('bg-vicunha-blue').addClass('bg-vicunha-green');
                }
            } else {
                $('#description').text('Nenhum resumo a ser exibido.');
                $('#spanSaldoAnoAnterior').text('00:00');
                $('#spanSaldoAtual').text('00:00');
            }
        } else {
            CheckError(response);
        }
    };

    AppServerPost(data, success, error);
}

function LoadDetalhamento(param) {
    if (param) {
        const data = { url: '/banco-horas-hcm/detalhe', body: JSON.stringify(param) };
        const success = (response) => {
            if (response.success) {
                const referencia = new Date(param.anoRefIni, param.mesRefIni - 1, 1);
                const aviso = moment(new Date()).isSame(referencia, 'month') ? 'Os valores estão sujeito a alterações até o fechamento da folha de pagamento no mês.' : '';

                $('#h3Resumo').text(`Resumo de ${moment(referencia).locale('pt-br').format('MMMM/yyyy')}`);
                $('#spanPositivoMes').text(param.tempoPositivo);
                $('#spanNegativoMes').text(param.tempoNegativo);
                $('#spanSaldoMes').text(param.tempoNoMes);

                grdLancamentos.option('dataSource', response.data.items);

                $('spanDetalhe').text(aviso);
                $('#modalDetalheBancoHoras').modal();
            } else {
                CheckError(response);
            }
        };

        AppServerPost(data, success, error);
    }
}

function createElementBH(data) {
    const param = JSON.stringify({
        codUsuario: data.codUsuario,
        mesRefIni: data.numMesRefer,
        anoRefIni: data.numAnoRefer,
        tempoPositivo: data.tempoPositivo,
        tempoNegativo: data.tempoNegativo,
        tempoNoMes: data.tempoNoMes
    }).replace(/'/g, "\\'").replace(/"/g, "'");
    const referencia = new Date(data.numAnoRefer, data.numMesRefer - 1, 1);
    const aviso = moment(new Date()).isSame(referencia, 'month') ? 'Os valores estão sujeito a alterações até o fechamento da folha de pagamento no mês.' : '';

    return `
        <div class="small-box bg-vicunha-default">
            <div class="inner">
                <h4 style="margin-bottom: 0;">${moment(referencia).locale('pt-br').format('MMMM/yyyy')}</h4>
                <div class="row">
                    <div class="col-md-5">
                        <label class="label bg-vicunha-green">Horas Positivas</label>
                        <h4>${data.tempoPositivo}</h4>
                    </div>
                    <div class="col-md-7">
                        <label class="label bg-red">Horas Negativas</label>
                        <h4>${data.tempoNegativo}</h4>
                    </div>
                </div>
                <div class="icon">
                    <i class="fa fa-clock-o"></i>
                </div>
                <div class="row">
                    <div class="col-md-5">
                        <p style="margin: 10px 0 0;">Saldo do mês</p>
                        <h3>${data.tempoNoMes}</h3>
                    </div>
                    <div class="col-md-7">
                        <p></p>
                        <small>${aviso}</small>
                    </div>
                </div>
            </div>            
            <a href="#" onclick="LoadDetalhamento(${param});" class="small-box-footer bg-vicunha-blue">
              Detalhes <i class="fa fa-arrow-circle-right"></i>
            </a>
        </div>`;
}