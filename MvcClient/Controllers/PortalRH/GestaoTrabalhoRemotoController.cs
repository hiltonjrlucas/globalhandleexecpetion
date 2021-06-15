using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers
{
    public class GestaoTrabalhoRemotoController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}