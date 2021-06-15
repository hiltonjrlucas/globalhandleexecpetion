using System.Web.Configuration;
using System.Web.Http;

namespace ModeloNetFramework.api.Controllers
{
    public class BaseController : ApiController
    {
        public string urlAppServer = WebConfigurationManager.AppSettings["urlAppServerHCM"].ToString();
    }
}
