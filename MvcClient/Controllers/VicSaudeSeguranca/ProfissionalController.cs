using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers
{
    public class ProfissionalController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View(), true);
        }
    }
}