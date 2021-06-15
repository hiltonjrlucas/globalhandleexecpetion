using Microsoft.AspNetCore.Mvc;
using VicPortalRH.Services;

namespace VicPortalRH.Controllers
{
    public class HomeController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View());
        }

        [HttpPost]
        public JsonResult Logout()
        {
            HttpContext.Session.Clear();

            return Json(StaticService.JsonSuccess(Ok()));
        }
    }
}
