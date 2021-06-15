using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers
{
    public class RegistroPontoController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View());
        }
    }
}