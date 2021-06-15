using Business;
using Business.VicSaudeSeguranca;
using Library;
using System;
using System.Configuration;

namespace IntegraPontoHCM
{
    class Program
    {

        static void Main(string[] args)
        {
            Environment.ExitCode = 0;
            try
            {
                gravaLog("...");
                gravaLog("Iniciando integracao das batidas de ponto | VicSaudeSeguranca => TOTVS HCM");

                RegistroPontoBusiness registroPontoBusiness = new RegistroPontoBusiness();
                IntegraBatidasHCMBusiness integraBatidasHCMBusiness = new IntegraBatidasHCMBusiness();

                gravaLog("Lendo registros no banco | VicSaudeSeguranca");
                var registrosPendentes = registroPontoBusiness.GetBatidasPendentesIntegracao();

                gravaLog(" Total de registros lidos: "+ registrosPendentes.Count.ToString() + " | VicSaudeSeguranca");

                if (registrosPendentes.Count > 0)
                {
                    gravaLog("Enviando registros ao AppServer | TOTVS HCM");
                    var retornoAppServer = integraBatidasHCMBusiness.IntegrarBatidasHCM(registrosPendentes, ConfigurationManager.AppSettings["urlAppServerHCM"].ToString());

                    gravaLog("Gravando registros retornados do AppServer no banco | VicSaudeSeguranca");
                    var result = registroPontoBusiness.SetRetornoIntegracaoHCM(retornoAppServer);

                    if (result)
                    {
                        gravaLog("Integracao dos registros ocorreu com sucesso | VicSaudeSeguranca => TOTVS HCM");
                    }
                }                              

                gravaLog("Rotina finalizada | VicSaudeSeguranca => TOTVS HCM");
            }
            catch (Exception erro)
            {
                gravaLog("Erro integracao | VicSaudeSeguranca => TOTVS HCM | " + erro.Message);
                Environment.ExitCode = 1;
            }
        }

        public static void gravaLog(string msg)
        {
            Log.LogMessageToFile(msg, "IntegraPontoHCM");
        }        
    }
}
