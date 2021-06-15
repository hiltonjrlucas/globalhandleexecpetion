using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VicFramework.Model.Shared;

namespace VicPortalRH.Controllers
{
    public class BaseController : Controller
    {
        public IActionResult Authorize(ViewResult view, bool CheckAreaMedica = false)
        {
            bool Authenticated = HttpContext.Session.GetString("Authenticated") == "True";

            if (Authenticated)
            {
                if (CheckAreaMedica)
                {
                    if (HttpContext.Session.GetString("AcessoAreaMedica") == "True")
                    {
                        return View(view);
                    }
                    else
                    {
                        return RedirectToAction("index", "Home");
                    }
                }

                return View(view);
            }
            else
            {
                return RedirectToAction("index", "Login", new { Authenticated });
            }
        }
    }
}