using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/[controller]")]
    [ApiController]
    public class ExperienciaCandidatoController : BaseController
    {
        private readonly IExperienciaCandidatoBusiness _experienciaCandidatoBusiness;

        public ExperienciaCandidatoController(IExperienciaCandidatoBusiness experienciaCandidatoBusiness)
        {
            _experienciaCandidatoBusiness = experienciaCandidatoBusiness;
        }

        [HttpDelete("{cdExperiencia:int}/{cdCandidato:int}")]
        public IActionResult Delete(int cdExperiencia, int cdCandidato)
        {
            ExperienciaCandidatoEntity existing = _experienciaCandidatoBusiness.GetSingleBy(g => g.cdExperiencia == cdExperiencia && g.cdCandidato == cdCandidato);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _experienciaCandidatoBusiness.Delete(d => d.cdExperiencia == cdExperiencia && d.cdCandidato == cdCandidato);

            return ApiResponse(result, null, "Objeto não deletado");
        }
    }
}