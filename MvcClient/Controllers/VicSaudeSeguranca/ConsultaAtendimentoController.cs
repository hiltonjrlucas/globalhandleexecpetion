using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers.VicSaudeSeguranca
{
    public class ConsultaAtendimentoController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View(), true);
        }
    }
}