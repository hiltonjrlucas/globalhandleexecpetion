using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers
{
    public class GestorController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View(), true);
        }
    }
}