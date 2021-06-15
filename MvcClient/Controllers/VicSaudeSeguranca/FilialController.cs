using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers
{
    public class FilialController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View(), true);
        }
    }
}