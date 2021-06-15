using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers
{
    public class ProcedimentoController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View(), true);
        }
    }
}