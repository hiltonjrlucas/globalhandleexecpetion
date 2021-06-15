using DAL;
using Model.AppServerHCM;
using Model.Dto.AppServerHCM;
using Model.ViewModels.AppServerHCM;
using Progress.Open4GL;
using Progress.Open4GL.Proxy;
using System;
using System.Data;
using System.Linq;

namespace Business.AppServerHCM
{
    public class DemonstrativoPagamentoHCMBusiness
    {
        public ResumoDemonstrativoPagamentoDto Resumo(DemonstrativoPagamentoViewModel model, string urlServidor)
        {
            DataTable ttRetorno = new DataTable("ttRetorno");
            ttRetorno.Columns.Add("codUsuario", typeof(string));
            ttRetorno.Columns.Add("numMesRefer", typeof(int));
            ttRetorno.Columns.Add("numAnoRefer", typeof(int));
            ttRetorno.Columns.Add("idiTipoFolha", typeof(int));
            ttRetorno.Columns.Add("numParcelaFolha", typeof(int));
            ttRetorno.Columns.Add("datPagamento", typeof(DateTime));
            ttRetorno.Columns.Add("valLiquido", typeof(decimal));

            TempTableMetaData tempTableRetorno = new TempTableMetaData("ttRetorno", null, 7, false, 0, null, null, null);
            tempTableRetorno.SetFieldMetaData(1, "codUsuario", 0, Parameter.PRO_CHARACTER, 0, 0);
            tempTableRetorno.SetFieldMetaData(2, "numMesRefer", 0, Parameter.PRO_INTEGER, 1, 0);
            tempTableRetorno.SetFieldMetaData(3, "numAnoRefer", 0, Parameter.PRO_INTEGER, 2, 0);
            tempTableRetorno.SetFieldMetaData(4, "idiTipoFolha", 0, Parameter.PRO_INTEGER, 3, 0);
            tempTableRetorno.SetFieldMetaData(5, "numParcelaFolha", 0, Parameter.PRO_INTEGER, 4, 0);
            tempTableRetorno.SetFieldMetaData(6, "datPagamento", 0, Parameter.PRO_DATE, 5, 0);
            tempTableRetorno.SetFieldMetaData(7, "valLiquido", 0, Parameter.PRO_DECIMAL, 6, 0);

            var resumo = new ResumoDemonstrativoPagamentoDto();
            ParamArray parametros = new ParamArray(7);
            parametros.AddParameter(0, model.codUsuario, ParamArrayMode.INPUT, Parameter.PRO_CHARACTER, 0, null);
            parametros.AddParameter(1, model.pasUsuario, ParamArrayMode.INPUT, Parameter.PRO_CHARACTER, 0, null);
            parametros.AddParameter(2, model.mesRef, ParamArrayMode.INPUT, Parameter.PRO_INTEGER, 0, null);
            parametros.AddParameter(3, model.anoRef, ParamArrayMode.INPUT, Parameter.PRO_INTEGER, 0, null);
            parametros.AddParameter(4, resumo.authenticated, ParamArrayMode.OUTPUT, Parameter.PRO_LOGICAL, 0, null);
            parametros.AddParameter(5, resumo.error, ParamArrayMode.OUTPUT, Parameter.PRO_CHARACTER, 0, null);
            parametros.AddTable(6, ttRetorno, ParamArrayMode.OUTPUT, tempTableRetorno);

            AppServerConn.RunProgramAppServer(ref parametros, "esp/apiRetornaFolhaResumo.p", urlServidor);

            resumo.authenticated = (bool)parametros.GetOutputParameter(4);
            resumo.error = parametros.GetOutputParameter(5).ToString();

            resumo.resumos = ((DataTable)parametros.GetOutputParameter(6)).AsEnumerable().Select(row => new ResumoPagamentoDto
            {
                codUsuario = row[0].ToString(),
                numMesRefer = (int)row[1],
                numAnoRefer = (int)row[2],
                idiTipoFolha = (int)row[3],
                numParcelaFolha = (int)row[4],
                datPagamento = (DateTime)row[5],
                valLiquido = (decimal)row[6]
            })
            .Where(w => model.idTipoFolha == 0 || w.idiTipoFolha == model.idTipoFolha)
            .OrderByDescending(o => o.datPagamento);

            return resumo;
        }

        public DemonstrativoPagamentoDto FolhaPagamento(DemonstrativoPagamentoViewModel model, string urlServidor)
        {
            DataTable dtRetornoFolha = new DataTable("ttRetornoFolha");
            dtRetornoFolha.Columns.Add("codUsuario", typeof(string));
            dtRetornoFolha.Columns.Add("numMesRefer", typeof(int));
            dtRetornoFolha.Columns.Add("numAnoRefer", typeof(int));
            dtRetornoFolha.Columns.Add("idiTipoFolha", typeof(int));
            dtRetornoFolha.Columns.Add("numParcelaFolha", typeof(int));
            dtRetornoFolha.Columns.Add("datPagamento", typeof(DateTime));
            dtRetornoFolha.Columns.Add("valLiquido", typeof(decimal));
            dtRetornoFolha.Columns.Add("valProventos", typeof(decimal));
            dtRetornoFolha.Columns.Add("valDescontos", typeof(decimal));
            dtRetornoFolha.Columns.Add("valSalario", typeof(decimal));
            dtRetornoFolha.Columns.Add("valSalarioINSS", typeof(decimal));
            dtRetornoFolha.Columns.Add("valBaseFGTS", typeof(decimal));
            dtRetornoFolha.Columns.Add("valFGTS", typeof(decimal));
            dtRetornoFolha.Columns.Add("valBaseIRF", typeof(decimal));
            dtRetornoFolha.Columns.Add("qtiEvento", typeof(int));

            DataTable dtRetornoEvento = new DataTable("ttRetornoEvento");
            dtRetornoEvento.Columns.Add("idiTipoFolha", typeof(int));
            dtRetornoEvento.Columns.Add("numParcelaFolha", typeof(int));
            dtRetornoEvento.Columns.Add("codEvento", typeof(string));
            dtRetornoEvento.Columns.Add("desEvento", typeof(string));
            dtRetornoEvento.Columns.Add("qtdUnidadeEvt", typeof(decimal));
            dtRetornoEvento.Columns.Add("valEvt", typeof(decimal));
            dtRetornoEvento.Columns.Add("idiTipoEvt", typeof(string));

            TempTableMetaData ttRetornoFolha = new TempTableMetaData("ttRetornoFolha", null, 15, false, 0, null, null, null);
            ttRetornoFolha.SetFieldMetaData(1, "codUsuario", 0, Parameter.PRO_CHARACTER, 0, 0);
            ttRetornoFolha.SetFieldMetaData(2, "numMesRefer", 0, Parameter.PRO_INTEGER, 1, 0);
            ttRetornoFolha.SetFieldMetaData(3, "numAnoRefer", 0, Parameter.PRO_INTEGER, 2, 0);
            ttRetornoFolha.SetFieldMetaData(4, "idiTipoFolha", 0, Parameter.PRO_INTEGER, 3, 0);
            ttRetornoFolha.SetFieldMetaData(5, "numParcelaFolha", 0, Parameter.PRO_INTEGER, 4, 0);
            ttRetornoFolha.SetFieldMetaData(6, "datPagamento", 0, Parameter.PRO_DATE, 5, 0);
            ttRetornoFolha.SetFieldMetaData(7, "valLiquido", 0, Parameter.PRO_DECIMAL, 6, 0);
            ttRetornoFolha.SetFieldMetaData(8, "valProventos", 0, Parameter.PRO_DECIMAL, 7, 0);
            ttRetornoFolha.SetFieldMetaData(9, "valDescontos", 0, Parameter.PRO_DECIMAL, 8, 0);
            ttRetornoFolha.SetFieldMetaData(10, "valSalario", 0, Parameter.PRO_DECIMAL, 9, 0);
            ttRetornoFolha.SetFieldMetaData(11, "valSalarioINSS", 0, Parameter.PRO_DECIMAL, 10, 0);
            ttRetornoFolha.SetFieldMetaData(12, "valBaseFGTS", 0, Parameter.PRO_DECIMAL, 11, 0);
            ttRetornoFolha.SetFieldMetaData(13, "valFGTS", 0, Parameter.PRO_DECIMAL, 12, 0);
            ttRetornoFolha.SetFieldMetaData(14, "valBaseIRF", 0, Parameter.PRO_DECIMAL, 13, 0);
            ttRetornoFolha.SetFieldMetaData(15, "qtiEvento", 0, Parameter.PRO_INTEGER, 14, 0);

            TempTableMetaData ttRetornoEvento = new TempTableMetaData("ttRetornoEvento", null, 7, false, 0, null, null, null);
            ttRetornoEvento.SetFieldMetaData(1, "idiTipoFolha", 0, Parameter.PRO_INTEGER, 0, 0);
            ttRetornoEvento.SetFieldMetaData(2, "numParcelaFolha", 0, Parameter.PRO_INTEGER, 1, 0);
            ttRetornoEvento.SetFieldMetaData(3, "codEvento", 0, Parameter.PRO_CHARACTER, 2, 0);
            ttRetornoEvento.SetFieldMetaData(4, "desEvento", 0, Parameter.PRO_CHARACTER, 3, 0);
            ttRetornoEvento.SetFieldMetaData(5, "qtdUnidadeEvt", 0, Parameter.PRO_DECIMAL, 4, 0);
            ttRetornoEvento.SetFieldMetaData(6, "valEvt", 0, Parameter.PRO_DECIMAL, 5, 0);
            ttRetornoEvento.SetFieldMetaData(7, "idiTipoEvt", 0, Parameter.PRO_CHARACTER, 6, 0);

            var demonstrativo = new DemonstrativoPagamentoDto();
            ParamArray parametros = new ParamArray(10);
            parametros.AddParameter(0, model.codUsuario, ParamArrayMode.INPUT, Parameter.PRO_CHARACTER, 0, null);
            parametros.AddParameter(1, model.pasUsuario, ParamArrayMode.INPUT, Parameter.PRO_CHARACTER, 0, null);
            parametros.AddParameter(2, model.mesRef, ParamArrayMode.INPUT, Parameter.PRO_INTEGER, 0, null);
            parametros.AddParameter(3, model.anoRef, ParamArrayMode.INPUT, Parameter.PRO_INTEGER, 0, null);
            parametros.AddParameter(4, model.idTipoFolha, ParamArrayMode.INPUT, Parameter.PRO_INTEGER, 0, null);
            parametros.AddParameter(5, model.parcela, ParamArrayMode.INPUT, Parameter.PRO_INTEGER, 0, null);
            parametros.AddParameter(6, demonstrativo.authenticated, ParamArrayMode.OUTPUT, Parameter.PRO_LOGICAL, 0, null);
            parametros.AddParameter(7, demonstrativo.error, ParamArrayMode.OUTPUT, Parameter.PRO_CHARACTER, 0, null);
            parametros.AddTable(8, dtRetornoFolha, ParamArrayMode.OUTPUT, ttRetornoFolha);
            parametros.AddTable(9, dtRetornoEvento, ParamArrayMode.OUTPUT, ttRetornoEvento);

            AppServerConn.RunProgramAppServer(ref parametros, "esp/apiRetornaFolhaDetalhe.p", urlServidor);

            demonstrativo.authenticated = (bool)parametros.GetOutputParameter(6);
            demonstrativo.error = parametros.GetOutputParameter(7).ToString();
            demonstrativo.folhaPagamento = ((DataTable)parametros.GetOutputParameter(8)).AsEnumerable().Select(row => new FolhaPagamentoDto
            {
                codUsuario = row[0].ToString(),
                numMesRefer = (int)row[1],
                numAnoRefer = (int)row[2],
                idiTipoFolha = (int)row[3],
                numParcelaFolha = (int)row[4],
                datPagamento = (DateTime)row[5],
                valLiquido = (decimal)row[6],
                valProventos = (decimal)row[7],
                valDescontos = (decimal)row[8],
                valSalario = (decimal)row[9],
                valSalarioINSS = (decimal)row[10],
                valBaseFGTS = (decimal)row[11],
                valFGTS = (decimal)row[12],
                valBaseIRF = (decimal)row[13],
                qtiEvento = (int)row[14],
            }).Where(w => w.idiTipoFolha == model.idTipoFolha)
            .FirstOrDefault();

            demonstrativo.eventos = ((DataTable)parametros.GetOutputParameter(9)).AsEnumerable().Select(row => new EventoFolhaPagamentoDto
            {
                idiTipoFolha = (int)row[0],
                numParcelaFolha = (int)row[1],
                codEvento = row[2].ToString(),
                desEvento = row[3].ToString(),
                qtdUnidadeEvt = (decimal)row[4],
                valEvt = (decimal)row[5],
                idiTipoEvt = row[6].ToString()
            });

            return demonstrativo;
        }
    }
}
