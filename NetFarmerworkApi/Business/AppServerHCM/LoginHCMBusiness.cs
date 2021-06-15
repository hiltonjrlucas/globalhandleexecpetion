using DAL;
using Model.Dto.AppServerHCM;
using Model.ViewModels.AppServerHCM;
using Progress.Open4GL;
using Progress.Open4GL.Proxy;
using System.Security.Claims;

namespace Business.AppServerHCM
{
    public class LoginHCMBusiness
    {
        public LoginHcmDto LoginHCM(LoginViewModel model, string server)
        {
            ParamArray parametros = new ParamArray(6);
            LoginHcmDto login = new LoginHcmDto();

            var acessoRegistroPonto = false;

            parametros.AddParameter(0, model.usuario, ParamArrayMode.INPUT, Parameter.PRO_CHARACTER, 0, null);
            parametros.AddParameter(1, model.senha, ParamArrayMode.INPUT, Parameter.PRO_CHARACTER, 0, null);
            parametros.AddParameter(2, login.Authenticated, ParamArrayMode.OUTPUT, Parameter.PRO_LOGICAL, 0, null);
            parametros.AddParameter(3, login.AuthenticatedMessage, ParamArrayMode.OUTPUT, Parameter.PRO_CHARACTER, 0, null);
            parametros.AddParameter(4, acessoRegistroPonto, ParamArrayMode.OUTPUT, Parameter.PRO_LOGICAL, 0, null);
            parametros.AddParameter(5, login.RegistroPontoMessage, ParamArrayMode.OUTPUT, Parameter.PRO_CHARACTER, 0, null);

            AppServerConn.RunProgramAppServer(ref parametros, "esp/apiValidaUsuario.p", server);

            login.Authenticated = (bool)parametros.GetOutputParameter(2);
            login.AuthenticatedMessage = (string)parametros.GetOutputParameter(3);
            login.Claims.Add(new Claim("acesso_registroPonto", parametros.GetOutputParameter(4).ToString()));
            
            login.RegistroPontoMessage = (string)parametros.GetOutputParameter(5);

            return login;
        }

        public string AlterarSenhaHCM(SenhaViewModel model, string server)
        {
            ParamArray parametros = new ParamArray(4);
            string result = "";

            parametros.AddParameter(0, model.cdUsuario, ParamArrayMode.INPUT, Parameter.PRO_CHARACTER, 0, null);
            parametros.AddParameter(1, model.numDiasValidos, ParamArrayMode.INPUT, Parameter.PRO_INTEGER, 0, null);
            parametros.AddParameter(2, model.stSenha, ParamArrayMode.INPUT, Parameter.PRO_CHARACTER, 0, null);
            parametros.AddParameter(3, result, ParamArrayMode.OUTPUT, Parameter.PRO_CHARACTER, 0, null);

            AppServerConn.RunProgramAppServer(ref parametros, "esp/apiTrocaSenha.p", server);

            result = (string)parametros.GetOutputParameter(3);

            return result;
        }
    }
}
