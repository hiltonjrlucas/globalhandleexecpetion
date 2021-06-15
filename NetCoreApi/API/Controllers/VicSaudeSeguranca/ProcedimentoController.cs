using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/cadastro-de-procedimento")]
    [ApiController]
    public class ProcedimentoController : BaseController
    {
        IProcedimentoBusiness _procedimentoBusiness;

        public ProcedimentoController(IProcedimentoBusiness procedimentoBusiness)
        {
            _procedimentoBusiness = procedimentoBusiness;
        }

        [HttpPost()]
        public IActionResult Insert(ProcedimentoEntity procedimento)
        {
            ProcedimentoEntity existing = _procedimentoBusiness.GetSingleBy(g => g.cdFilial == procedimento.cdFilial &&
                                                                                 g.cdProcedimento == procedimento.cdProcedimento);
            if (existing != null)
            {
                return BadRequest("Objeto Existente");
            }

            int result = _procedimentoBusiness.Add(procedimento);

            if (result > 0)
            {
                return Created($"/api/cadastro-de-procedimento/{procedimento.cdFilial}&{procedimento.cdProcedimento}", procedimento);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet()]
        public IActionResult Get()
        {
            IEnumerable<ProcedimentoEntity> result = _procedimentoBusiness.GetAll();

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpGet("{cdFilial:int}&{cdProcedimento:int}")]
        public IActionResult Get(int cdFilial, int cdProcedimento)
        {
            ProcedimentoEntity result = _procedimentoBusiness.GetSingleBy(g => g.cdFilial == cdFilial &&
                                                                               g.cdProcedimento == cdProcedimento);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPut()]
        public IActionResult Update(ProcedimentoEntity procedimento)
        {
            ProcedimentoEntity existing = _procedimentoBusiness.GetSingleBy(g => g.cdFilial == procedimento.cdFilial &&
                                                                                 g.cdProcedimento == procedimento.cdProcedimento);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _procedimentoBusiness.Update(procedimento);

            if (result > 0)
            {
                return Ok(procedimento);
            }
            else
            {
                return BadRequest("Objeto não atualizado");
            }
        }

        [HttpDelete("{cdFilial:int}&{cdProcedimento:int}")]
        public IActionResult Delete(int cdFilial, int cdProcedimento)
        {
            ProcedimentoEntity existing = _procedimentoBusiness.GetSingleBy(g => g.cdFilial == cdFilial &&
                                                                                 g.cdProcedimento == cdProcedimento);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _procedimentoBusiness.Delete(d => d.cdFilial == cdFilial &&
                                                           d.cdProcedimento == cdProcedimento);

            if (result > 0)
            {
                return Ok();
            }
            else
            {
                return BadRequest("Objeto não deletado");
            }
        }

        [Authorize("Bearer")]
        [HttpGet("GetByFilial/{cdFilial:int}")]
        public IActionResult GetByFilial(int cdFilial)
        {
            return Ok(_procedimentoBusiness.Search(s => s.cdFilial == cdFilial)
                                           .Select(s => new { s.cdProcedimento, s.dsProcedimento }));
        }
    }
}