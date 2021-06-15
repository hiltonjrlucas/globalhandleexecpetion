using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/cadastro-de-tipo")]
    [ApiController]
    public class TipoController : BaseController
    {
        ITipoBusiness _tipoBusiness;

        public TipoController(ITipoBusiness tipoBusiness)
        {
            _tipoBusiness = tipoBusiness;
        }

        [HttpPost()]
        public IActionResult Insert(TipoEntity tipo)
        {
            TipoEntity existing = _tipoBusiness.GetSingleBy(g => g.cdTipo == tipo.cdTipo);
            if (existing != null)
            {
                return BadRequest("Objeto Existente");
            }

            int result = _tipoBusiness.Add(tipo);

            if (result > 0)
            {
                return Created($"/api/tipo/{tipo.cdTipo}", tipo);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet()]
        public IActionResult Get()
        {
            IEnumerable<TipoEntity> result = _tipoBusiness.GetAll();

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpGet("{cdTipo:int}")]
        public IActionResult Get(int cdTipo)
        {
            TipoEntity result = _tipoBusiness.GetSingleBy(g => g.cdTipo == cdTipo);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPut()]
        public IActionResult Update(TipoEntity tipo)
        {
            TipoEntity existing = _tipoBusiness.GetSingleBy(g => g.cdTipo == tipo.cdTipo);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _tipoBusiness.Update(tipo);

            if (result > 0)
            {
                return Ok(tipo);
            }
            else
            {
                return BadRequest("Objeto não atualizado");
            }
        }

        [HttpDelete("{cdTipo:int}")]
        public IActionResult Delete(int cdTipo)
        {
            TipoEntity existing = _tipoBusiness.GetSingleBy(g => g.cdTipo == cdTipo);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _tipoBusiness.Delete(d => d.cdTipo == cdTipo);

            if (result > 0)
            {
                return Ok();
            }
            else
            {
                return BadRequest("Objeto não deletado");
            }
        }

        [HttpGet("GetTiposAtivos")]
        public IActionResult GetTiposAtivos()
        {
            var result = _tipoBusiness.Search(g => g.cdStatus == 1)
                                      .Select(s => new { s.cdTipo, s.dsTipo });

            if (result.ToList().Count() == 0) return NotFound();

            return Ok(result);
        }
    }
}