using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers
{
    public class DemonstrativoPagamentoController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View());
        }
    }
}