using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers
{
    public class GrupoUsuarioController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View(), true);
        }
    }
}