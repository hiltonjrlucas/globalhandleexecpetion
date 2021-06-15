using Library;
using Library.Segurança;
using Model.Dto.AppServerHCM;
using Model.ViewModels;
using System.Web.Configuration;
using System.Web.Http;

namespace ModeloNetFramework.api.Controllers
{
    [RoutePrefix("api/jwt")]
    public class JwtController : ApiController
    {
        [AllowAnonymous]
        [Route("access-token")]
        [HttpPost()]
        public IHttpActionResult Authenticate([FromBody] Parameters parameters)
        {        
            bool isUserValid = Criptografia.Descriptografar(parameters.userAuthorized) == WebConfigurationManager.AppSettings["userAuthorized"].ToString();

            if (isUserValid)
            {
                string token = TokenGen.CreateToken(new LoginHcmDto { Authenticated = isUserValid });

                return Ok(token);
            }
            else 
            {
                return Unauthorized();
            }
        }     
    }
}
