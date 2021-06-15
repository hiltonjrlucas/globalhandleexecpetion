using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers.VicSaudeSeguranca
{
    public class TurnoController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View(), true);
        }
    }
}