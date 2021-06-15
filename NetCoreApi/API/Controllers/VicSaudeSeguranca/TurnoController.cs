using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/cadastro-de-turno")]
    [ApiController]
    public class TurnoController : BaseController
    {
        ITurnoBusiness _turnoBusiness;

        public TurnoController(ITurnoBusiness turnoBusiness)
        {
            _turnoBusiness = turnoBusiness;
        }

        [HttpPost()]
        public IActionResult Insert(TurnoEntity turno)
        {
            TurnoEntity existing = _turnoBusiness.GetSingleBy(g => g.cdFilial == turno.cdFilial && 
                                                                   g.cdTurno == turno.cdTurno);
            if (existing != null)
            {
                return BadRequest("Objeto Existente");
            }

            int result = _turnoBusiness.Add(turno);

                if (result > 0)
                {
                    return Created($"/api/cadastro-de-turno/{turno.cdFilial}&{turno.cdTurno}", turno);
                }
                else
                {
                    return BadRequest();
                }

        }

        [HttpGet()]
        public IActionResult Get()
        {
            IEnumerable<TurnoEntity> result = _turnoBusiness.GetAll();

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpGet("{cdFilial:int}&{cdTurno:int}")]
        public IActionResult Get(int cdFilial, int cdTurno)
        {
            TurnoEntity result = _turnoBusiness.GetSingleBy(g => g.cdFilial == cdFilial && 
                                                                 g.cdTurno == cdTurno);

            if (result == null) return NotFound();

                return Ok(result);

        }

        [HttpPut()]
        public IActionResult Update(TurnoEntity turno)
        {
            TurnoEntity existing = _turnoBusiness.GetSingleBy(g => g.cdFilial == turno.cdFilial &&
                                                                   g.cdTurno == turno.cdTurno);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _turnoBusiness.Update(turno);

            if (result > 0)
            {
                return Ok(turno);
            }
            else
            {
                return BadRequest("Objeto não atualizado");
            }
        }

        [HttpDelete("{cdFilial:int}&{cdTurno:int}")]
        public IActionResult Delete(int cdFilial, int cdTurno)
        {
            TurnoEntity existing = _turnoBusiness.GetSingleBy(g => g.cdFilial == cdFilial &&
                                                                   g.cdTurno == cdTurno);
            if (existing == null)
            {
                return NotFound();
            }

                int result = _turnoBusiness.Delete(d => d.cdFilial == cdFilial &&
                                                        d.cdTurno == cdTurno);

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