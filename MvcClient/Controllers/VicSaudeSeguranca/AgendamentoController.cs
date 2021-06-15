using Microsoft.AspNetCore.Mvc;

namespace VicPortalRH.Controllers.VicSaudeSeguranca
{
    public class AgendamentoController : BaseController
    {
        public IActionResult Index()
        {
            return Authorize(View(), true);
        }        
    }
}