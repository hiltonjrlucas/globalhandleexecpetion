using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers.VicSaudeSeguranca
{
    public class AtendimentoController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View());
        }
    }
}