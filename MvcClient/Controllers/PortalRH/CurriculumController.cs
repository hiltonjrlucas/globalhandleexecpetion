using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers
{
    public class CurriculumController : BaseController
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}