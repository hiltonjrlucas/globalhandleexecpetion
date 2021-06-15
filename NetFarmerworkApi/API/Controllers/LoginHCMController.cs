using Business.AppServerHCM;
using Library.Segurança;
using Model.Dto.AppServerHCM;
using Model.ViewModels.AppServerHCM;
using System;
using System.Web.Configuration;
using System.Web.Http;

namespace AppServer.api.Controllers
{
    [RoutePrefix("api/login-hcm")]
    public class LoginHCMController : ApiController
    {
        private readonly LoginHCMBusiness _business;

        public LoginHCMController()
        {
            _business = new LoginHCMBusiness();
        }

        [AllowAnonymous]
        [Route("access-token")]
        [HttpPost()]
        public IHttpActionResult AccessToken([FromBody]LoginViewModel model)
        {
            try
            {
                var server = WebConfigurationManager.AppSettings["urlAppServerHCM"].ToString();

                LoginHcmDto login = _business.LoginHCM(model, server);
                if (login.Authenticated)
                {
                    string token = TokenGen.CreateToken(login);

                    return Ok(new
                    {
                        AccessToken = token,
                        Login = login
                    });
                }
                else
                {
                    return Unauthorized();
                }
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }

        [AllowAnonymous]
        [Route("change-password")]
        [HttpPost()]
        public IHttpActionResult ChangePassword([FromBody]SenhaViewModel model)
        {
            try
            {
                var server = WebConfigurationManager.AppSettings["urlAppServerHCM"].ToString();

                string message = _business.AlterarSenhaHCM(model, server);

                if (message.Contains("Usuário não encontrado"))
                {
                    return BadRequest(message);
                }

                return Ok(message);
            }
            catch (Exception)
            {
                return InternalServerError();
            }
        }
    }
}
