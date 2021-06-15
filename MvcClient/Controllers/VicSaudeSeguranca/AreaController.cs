using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers
{
    public class AreaController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View(), true);
        }
    }
}