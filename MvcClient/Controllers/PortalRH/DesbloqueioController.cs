using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers.PortalRH
{   
    public class DesbloqueioController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View());
        }
    }
}