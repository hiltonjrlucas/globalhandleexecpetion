using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/cadastro-de-area")]
    [ApiController]
    public class AreaController : BaseController
    {
        IAreaBusiness _areaBusiness;

        public AreaController(IAreaBusiness areaBusiness)
        {
            _areaBusiness = areaBusiness;
        }

        [HttpPost()]
        public IActionResult Insert(AreaEntity area)
        {

            AreaEntity existing = _areaBusiness.GetSingleBy(g => g.cdArea == area.cdArea);
            if (existing != null)
            {
                return BadRequest("Objeto Existente");
            }

            int result = _areaBusiness.Add(area);

            if (result > 0)
            {
                return Created($"/api/cadastro-de-area/{area.cdArea}", area);
            }
            else
            {
                return BadRequest();
            }

        }

        [HttpGet()]
        public IActionResult Get()
        {
            IEnumerable<AreaEntity> result = _areaBusiness.GetAll();

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpGet("{cdArea:int}")]
        public IActionResult Get(int cdArea)
        {
            AreaEntity result = _areaBusiness.GetSingleBy(g => g.cdArea == cdArea);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPut()]
        public IActionResult Update(AreaEntity area)
        {
            AreaEntity existing = _areaBusiness.GetSingleBy(g => g.cdArea == area.cdArea);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _areaBusiness.Update(area);

            if (result > 0)
            {
                return Ok(area);
            }
            else
            {
                return BadRequest("Objeto não atualizado");
            }
        }

        [HttpDelete("{cdArea:int}")]
        public IActionResult Delete(int cdArea)
        {
            AreaEntity existing = _areaBusiness.GetSingleBy(g => g.cdArea == cdArea);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _areaBusiness.Delete(d => d.cdArea == cdArea);

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