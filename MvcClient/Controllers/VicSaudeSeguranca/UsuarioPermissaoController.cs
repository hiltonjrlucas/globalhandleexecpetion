using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers
{
    public class UsuarioPermissaoController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View(), true);
        }
    }
}