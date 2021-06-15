using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/cadastro-de-profissional")]
    [ApiController]
    public class ProfissionalController : BaseController
    {
        IProfissionalBusiness _profissionalBusiness;

        public ProfissionalController(IProfissionalBusiness profissionalBusiness)
        {
            _profissionalBusiness = profissionalBusiness;
        }

        [HttpPost()]
        public IActionResult Insert(ProfissionalEntity profissional)
        {
            ProfissionalEntity existing = _profissionalBusiness.GetSingleBy(g => g.cdFilial == profissional.cdFilial &&
                                                                                 g.cdProfissional == profissional.cdProfissional &&
                                                                                 g.cdProcedimento == profissional.cdProcedimento);
            if (existing != null)
            {
                return BadRequest("Objeto Existente");
            }

            int result = _profissionalBusiness.Add(profissional);

            if (result > 0)
            {
                return Created($"/api/cadastro-de-profissional/{profissional.cdFilial}&{profissional.cdProfissional}&{profissional.cdProcedimento}", profissional);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet()]
        public IActionResult Get()
        {
            IEnumerable<ProfissionalEntity> result = _profissionalBusiness.GetAll(g => g.Procedimento);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpGet("{cdFilial:int}&{cdProfissional}&{cdProcedimento:int}")]
        public IActionResult Get(int cdFilial, string cdProfissional, int cdProcedimento)
        {
            ProfissionalEntity result = _profissionalBusiness.GetSingleBy(g => g.cdFilial == cdFilial &&
                                                                               g.cdProfissional == cdProfissional &&
                                                                               g.cdProcedimento == cdProcedimento);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPut()]
        public IActionResult Update(ProfissionalEntity profissional)
        {
            ProfissionalEntity existing = _profissionalBusiness.GetSingleBy(g => g.cdFilial == profissional.cdFilial &&
                                                                                 g.cdProfissional == profissional.cdProfissional &&
                                                                                 g.cdProcedimento == profissional.cdProcedimento);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _profissionalBusiness.Update(profissional);

            if (result > 0)
            {
                return Ok(profissional);
            }
            else
            {
                return BadRequest("Objeto não atualizado");
            }
        }

        [HttpDelete("{cdFilial:int}&{cdProfissional}&{cdProcedimento:int}")]
        public IActionResult Delete(int cdFilial, string cdProfissional, int cdProcedimento)
        {
            ProfissionalEntity existing = _profissionalBusiness.GetSingleBy(g => g.cdFilial == cdFilial &&
                                                                                 g.cdProfissional == cdProfissional &&
                                                                                 g.cdProcedimento == cdProcedimento);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _profissionalBusiness.Delete(d => d.cdFilial == cdFilial &&
                                                           d.cdProfissional == cdProfissional &&
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
            var result = _profissionalBusiness.Search(s => s.cdFilial == cdFilial)
                                              .Select(s => new { s.cdProfissional, s.dsProfissional })
                                              .Distinct();

            if (result.ToList().Count() == 0) return NotFound();

            return Ok(result);

        }

        [Authorize("Bearer")]
        [HttpGet("GetProfissionalProcedimentos/{cdFilial:int}&{cdProfissional}")]
        public IActionResult GetProfissionalProcedimentos(int cdFilial, string cdProfissional)
        {
            IEnumerable<dynamic> result = _profissionalBusiness.GetProfissionalProcedimentos(cdFilial, cdProfissional);

            if (result.ToList().Count() == 0) return NotFound();

            return Ok(result);

        }
    }
}