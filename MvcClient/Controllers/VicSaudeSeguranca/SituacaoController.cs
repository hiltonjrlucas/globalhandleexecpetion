using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers
{
    public class SituacaoController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View(), true);
        }
    }
}