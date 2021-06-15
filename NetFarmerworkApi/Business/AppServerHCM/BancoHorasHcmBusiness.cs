using DAL;
using Library.Formatter;
using Model.Dto.AppServerHCM;
using Model.ViewModels.AppServerHCM;
using Progress.Open4GL;
using Progress.Open4GL.Proxy;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace Business.AppServerHCM
{
    public class BancoHorasHCMBusiness
    {
        public ResumoBancoHorasDto Resumo(BancoHorasViewModel model, string urlServidor)
        {
            DataTable ttRetorno = new DataTable("ttRetorno");
            ttRetorno.Columns.Add("codUsuario", typeof(string));
            ttRetorno.Columns.Add("numMesRefer", typeof(int));
            ttRetorno.Columns.Add("numAnoRefer", typeof(int));
            ttRetorno.Columns.Add("dtIniPeriod", typeof(DateTime));
            ttRetorno.Columns.Add("dtFimPeriod", typeof(DateTime));
            ttRetorno.Columns.Add("qtdHrsPosit", typeof(decimal));
            ttRetorno.Columns.Add("qtdHrsNegat", typeof(decimal));
            ttRetorno.Columns.Add("qtdSaldoMes", typeof(decimal));

            TempTableMetaData tempTableRetorno = new TempTableMetaData("ttRetorno", null, 8, false, 0, null, null, null);
            tempTableRetorno.SetFieldMetaData(1, "codUsuario", 0, Parameter.PRO_CHARACTER, 0, 0);
            tempTableRetorno.SetFieldMetaData(2, "numMesRefer", 0, Parameter.PRO_INTEGER, 1, 0);
            tempTableRetorno.SetFieldMetaData(3, "numAnoRefer", 0, Parameter.PRO_INTEGER, 2, 0);
            tempTableRetorno.SetFieldMetaData(4, "dtIniPeriod", 0, Parameter.PRO_DATE, 3, 0);
            tempTableRetorno.SetFieldMetaData(5, "dtFimPeriod", 0, Parameter.PRO_DATE, 4, 0);
            tempTableRetorno.SetFieldMetaData(6, "qtdHrsPosit", 0, Parameter.PRO_DECIMAL, 5, 0);
            tempTableRetorno.SetFieldMetaData(7, "qtdHrsNegat", 0, Parameter.PRO_DECIMAL, 6, 0);
            tempTableRetorno.SetFieldMetaData(8, "qtdSaldoMes", 0, Parameter.PRO_DECIMAL, 7, 0);

            var resumo = new ResumoBancoHorasDto();
            ParamArray parametros = new ParamArray(7);
            parametros.AddParameter(0, model.codUsuario, ParamArrayMode.INPUT, Parameter.PRO_CHARACTER, 0, null);
            parametros.AddParameter(1, model.mesRefIni, ParamArrayMode.INPUT, Parameter.PRO_INTEGER, 0, null);
            parametros.AddParameter(2, model.anoRefIni, ParamArrayMode.INPUT, Parameter.PRO_INTEGER, 0, null);
            parametros.AddParameter(3, model.mesRefFim, ParamArrayMode.INPUT, Parameter.PRO_INTEGER, 0, null);
            parametros.AddParameter(4, model.anoRefFim, ParamArrayMode.INPUT, Parameter.PRO_INTEGER, 0, null);
            parametros.AddTable(5, ttRetorno, ParamArrayMode.OUTPUT, tempTableRetorno);
            parametros.AddParameter(6, resumo.saldoAnoAnterior, ParamArrayMode.OUTPUT, Parameter.PRO_DECIMAL, 0, null);

            AppServerConn.RunProgramAppServer(ref parametros, "esp/apiRetornaBancodeHorasResumo.p", urlServidor);

            resumo.resumos = ((DataTable)parametros.GetOutputParameter(5)).AsEnumerable().Select(row => new BancoHorasDto
            {
                codUsuario = row[0].ToString(),
                numMesRefer = (int)row[1],
                numAnoRefer = (int)row[2],
                dtIniPeriod = (DateTime)row[3],
                dtFimPeriod = (DateTime)row[4],
                qtdHrsPosit = (decimal)row[5],
                qtdHrsNegat = (decimal)row[6],
                tempoPositivo = DateTimeFormatter.DisplayTime((double)(decimal)row[5], false),
                tempoNegativo = DateTimeFormatter.DisplayTime((double)(decimal)row[6], false),
                tempoNoMes = DateTimeFormatter.DisplayTime((double)(decimal)row[7], false)
            })
            .OrderByDescending(o => o.dtFimPeriod);

            var saldoAnoAnterior = (double)(decimal)parametros.GetOutputParameter(6);
            var saldoAtual = SaldoAtual(resumo.resumos.ToList(), saldoAnoAnterior);

            resumo.saldoAnoAnterior = DateTimeFormatter.DisplayTime(saldoAnoAnterior, false);
            resumo.saldoAtual = DateTimeFormatter.DisplayTime(saldoAtual, false);

            return resumo;
        }

        public DetalheBancoHorasDto Detalhe(BancoHorasViewModel model, string urlServidor)
        {
            DataTable ttRetorno = new DataTable("ttRetorno");
            ttRetorno.Columns.Add("codUsuario", typeof(string));
            ttRetorno.Columns.Add("numMesRefer", typeof(int));
            ttRetorno.Columns.Add("numAnoRefer", typeof(int));
            ttRetorno.Columns.Add("dtIniPeriod", typeof(DateTime));
            ttRetorno.Columns.Add("dtFimPeriod", typeof(DateTime));
            ttRetorno.Columns.Add("dataLancto", typeof(DateTime));
            ttRetorno.Columns.Add("tipoLancto", typeof(int));
            ttRetorno.Columns.Add("hraIniLancto", typeof(decimal));
            ttRetorno.Columns.Add("hraFimLancto", typeof(decimal));
            ttRetorno.Columns.Add("qtdHrsLancto", typeof(decimal));

            TempTableMetaData tempTableRetorno = new TempTableMetaData("ttRetorno", null, 10, false, 0, null, null, null);
            tempTableRetorno.SetFieldMetaData(1, "codUsuario", 0, Parameter.PRO_CHARACTER, 0, 0);
            tempTableRetorno.SetFieldMetaData(2, "numMesRefer", 0, Parameter.PRO_INTEGER, 1, 0);
            tempTableRetorno.SetFieldMetaData(3, "numAnoRefer", 0, Parameter.PRO_INTEGER, 2, 0);
            tempTableRetorno.SetFieldMetaData(4, "dtIniPeriod", 0, Parameter.PRO_DATE, 3, 0);
            tempTableRetorno.SetFieldMetaData(5, "dtFimPeriod", 0, Parameter.PRO_DATE, 4, 0);
            tempTableRetorno.SetFieldMetaData(6, "dataLancto", 0, Parameter.PRO_DATE, 5, 0);
            tempTableRetorno.SetFieldMetaData(7, "tipoLancto", 0, Parameter.PRO_INTEGER, 6, 0);
            tempTableRetorno.SetFieldMetaData(8, "hraIniLancto", 0, Parameter.PRO_DECIMAL, 7, 0);
            tempTableRetorno.SetFieldMetaData(9, "hraFimLancto", 0, Parameter.PRO_DECIMAL, 8, 0);
            tempTableRetorno.SetFieldMetaData(10, "qtdHrsLancto", 0, Parameter.PRO_DECIMAL, 9, 0);

            var detalhe = new DetalheBancoHorasDto();
            ParamArray parametros = new ParamArray(4);
            parametros.AddParameter(0, model.codUsuario, ParamArrayMode.INPUT, Parameter.PRO_CHARACTER, 0, null);
            parametros.AddParameter(1, model.mesRefIni, ParamArrayMode.INPUT, Parameter.PRO_INTEGER, 0, null);
            parametros.AddParameter(2, model.anoRefIni, ParamArrayMode.INPUT, Parameter.PRO_INTEGER, 0, null);
            parametros.AddTable(3, ttRetorno, ParamArrayMode.OUTPUT, tempTableRetorno);

            AppServerConn.RunProgramAppServer(ref parametros, "esp/apiRetornaBancodeHorasDetalhe.p", urlServidor);

            detalhe.items = ((DataTable)parametros.GetOutputParameter(3)).AsEnumerable().Select(row => new BancoHorasItemDto
            {
                codUsuario = row[0].ToString(),
                numMesRefer = (int)row[1],
                numAnoRefer = (int)row[2],
                dtIniPeriod = (DateTime)row[3],
                dtFimPeriod = (DateTime)row[4],
                dataLancto = (DateTime)row[5],
                tipoLancto = (int)row[6],
                hraIniLancto = DateTimeFormatter.DisplayTime((double)(decimal)row[7], false),
                hraFimLancto = DateTimeFormatter.DisplayTime((double)(decimal)row[8], false),
                qtdHrsLancto = DateTimeFormatter.DisplayTime((double)(decimal)row[9], false)
            })
            .OrderByDescending(o => o.dtFimPeriod);

            return detalhe;
        }

        private double SaldoAtual(List<BancoHorasDto> list, double saldoAnterior) 
        {
            var hrsPositivas = TimeSpan.FromHours((double)list.Sum(s => s.qtdHrsPosit));
            var hrsNegativas = TimeSpan.FromHours((double)list.Sum(s => s.qtdHrsNegat));

            return ((hrsPositivas - hrsNegativas) + TimeSpan.FromHours(saldoAnterior)).TotalHours;
        }
    }
}
