using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers
{
    public class CentroCustoController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View(), true);
        }
    }
}