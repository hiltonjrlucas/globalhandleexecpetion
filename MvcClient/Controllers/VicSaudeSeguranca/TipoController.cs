using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers.VicSaudeSeguranca
{
    public class TipoController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View(), true);
        }
    }
}