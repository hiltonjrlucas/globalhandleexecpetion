using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/cadastro-centro-custo")]
    [ApiController]
    public class CentroCustoController : BaseController
    {
        ICentroCustoBusiness _centroCustoBusiness;

        public CentroCustoController(ICentroCustoBusiness centroCustoBusiness)
        {
            _centroCustoBusiness = centroCustoBusiness;
        }

        [HttpPost()]
        public IActionResult Insert(CentroCustoEntity centroCusto)
        {
            CentroCustoEntity existing = _centroCustoBusiness.GetSingleBy(g => g.cdCentroCusto == centroCusto.cdCentroCusto);
            if (existing != null)
            {
                return BadRequest("Objeto Existente");
            }

            int result = _centroCustoBusiness.Add(centroCusto);

            if (result > 0)
            {
                return Created($"/api/cadastro-centro-custo/{centroCusto.cdCentroCusto}", centroCusto);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet()]
        public IActionResult Get()
        {
            IEnumerable<CentroCustoEntity> result = _centroCustoBusiness.GetAll(g => g.Area);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpGet("{cdCentroCusto}")]
        public IActionResult Get(string cdCentroCusto)
        {
            CentroCustoEntity result = _centroCustoBusiness.GetSingleBy(g => g.cdCentroCusto == cdCentroCusto);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPut()]
        public IActionResult Update(CentroCustoEntity centroCusto)
        {
            CentroCustoEntity existing = _centroCustoBusiness.GetSingleBy(g => g.cdCentroCusto == centroCusto.cdCentroCusto);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _centroCustoBusiness.Update(centroCusto);

            if (result > 0)
            {
                return Ok(centroCusto);
            }
            else
            {
                return BadRequest("Objeto não atualizado");
            }
        }

        [HttpDelete("{cdCentroCusto}")]
        public IActionResult Delete(string cdCentroCusto)
        {
            CentroCustoEntity existing = _centroCustoBusiness.GetSingleBy(g => g.cdCentroCusto == cdCentroCusto);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _centroCustoBusiness.Delete(d => d.cdCentroCusto == cdCentroCusto);

            if (result > 0)
            {
                return Ok();
            }
            else
            {
                return BadRequest("Objeto não deletado");
            }
        }
    }
}