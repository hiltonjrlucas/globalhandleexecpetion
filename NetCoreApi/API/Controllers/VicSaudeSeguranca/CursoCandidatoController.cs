using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/[controller]")]
    [ApiController]
    public class CursoCandidatoController : BaseController
    {
        private readonly ICursoCandidatoBusiness _cursoCandidatoBusiness;

        public CursoCandidatoController(ICursoCandidatoBusiness cursoCandidatoBusiness)
        {
            _cursoCandidatoBusiness = cursoCandidatoBusiness;
        }

        [HttpDelete("{cdCurso:int}/{cdCandidato:int}")]
        public IActionResult Delete(int cdCurso, int cdCandidato)
        {
            CursoCandidatoEntity existing = _cursoCandidatoBusiness.GetSingleBy(g => g.cdCurso == cdCurso && g.cdCandidato == cdCandidato);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _cursoCandidatoBusiness.Delete(d => d.cdCurso == cdCurso && d.cdCandidato == cdCandidato);

            return ApiResponse(result, null, "Objeto não deletado");
        }
    }
}