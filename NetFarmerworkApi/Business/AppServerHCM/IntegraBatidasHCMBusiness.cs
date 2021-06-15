using DAL;
using Model.Entities.VicSaudeSeguranca;
using Progress.Open4GL;
using Progress.Open4GL.Proxy;
using System.Collections.Generic;
using System.Data;

namespace Business
{
    public class IntegraBatidasHCMBusiness
    {      

        public DataTable IntegrarBatidasHCM(IEnumerable<RegistroPontoEntity> registros, string urlServidor)
        {
            DataTable dtBatidas = new DataTable("ttBatidas");
            dtBatidas.Columns.Add("id", typeof(decimal));
            dtBatidas.Columns.Add("codBatida", typeof(string));

            TempTableMetaData tempTableBatidas = new TempTableMetaData("ttBatidas", null, 2, false, 0, null, null, null);
            tempTableBatidas.SetFieldMetaData(1, "id", 0, Parameter.PRO_DECIMAL, 0, 0);
            tempTableBatidas.SetFieldMetaData(2, "codBatida", 0, Parameter.PRO_CHARACTER, 1, 0);

            foreach (var registro in registros)
            {
                try
                {
                    DataRow row = dtBatidas.NewRow();
                    
                    var empresa = registro.cdUsuario.Substring(1, 1);
                    var estabelecimento = registro.cdUsuario.Substring(2, 2)
                                    .TrimStart(new char[] { '0' })
                                    .PadRight(3,' ');
                    var matricula = registro.cdUsuario.Substring(4, 5);
                    var hora = registro.dtRegistro.Hour.ToString("d2");
                    var minuto = registro.dtRegistro.Minute.ToString("d2");
                    var dia = registro.dtRegistro.Day.ToString("d2");
                    var mes = registro.dtRegistro.Month.ToString("d2");
                    var ano = registro.dtRegistro.Year.ToString();

                    row["id"] = registro.idRegistroPonto;
                    row["codBatida"] = empresa + estabelecimento + matricula + hora + minuto + dia + mes + ano;                    

                    dtBatidas.Rows.Add(row);
                }
                catch (System.Exception)
                {
                    continue;
                }
                
            }

            DataTable ttRetorno = new DataTable("ttRetorno");
            ttRetorno.Columns.Add("id", typeof(decimal));
            ttRetorno.Columns.Add("codBatida", typeof(string));
            ttRetorno.Columns.Add("desValid", typeof(string));

            TempTableMetaData tempTableRetorno = new TempTableMetaData("ttRetorno", null, 3, false, 0, null, null, null);
            tempTableRetorno.SetFieldMetaData(1, "id", 0, Parameter.PRO_DECIMAL, 0, 0);
            tempTableRetorno.SetFieldMetaData(2, "codBatida", 0, Parameter.PRO_CHARACTER, 1, 0);
            tempTableRetorno.SetFieldMetaData(3, "desValid", 0, Parameter.PRO_CHARACTER, 2, 0);

            ParamArray parametros = new ParamArray(2);
            parametros.AddTable(0, dtBatidas, ParamArrayMode.INPUT, tempTableBatidas);
            parametros.AddTable(1, ttRetorno, ParamArrayMode.OUTPUT, tempTableRetorno);

            AppServerConn.RunProgramAppServer(ref parametros, "esp/apiCriaBatidas.p", urlServidor);

            return (DataTable)parametros.GetOutputParameter(1);

        }
    }
}
