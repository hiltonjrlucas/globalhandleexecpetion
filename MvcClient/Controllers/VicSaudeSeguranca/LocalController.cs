using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers.VicSaudeSeguranca
{
    public class LocalController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View(), true);
        }
    }
}