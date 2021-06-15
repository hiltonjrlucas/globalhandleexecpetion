using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/cadastro-de-local")]
    [ApiController]
    public class LocalController : BaseController
    {
        ILocalBusiness _localBusiness;

        public LocalController(ILocalBusiness localBusiness)
        {
            _localBusiness = localBusiness;
        }

        [HttpPost()]
        public IActionResult Insert(LocalEntity local)
        {
            LocalEntity existing = _localBusiness.GetSingleBy(g => g.cdFilial == local.cdFilial &&
                                                                       g.cdLocal == local.cdLocal);
            if (existing != null)
            {
                return BadRequest("Objeto Existente");
            }

            int result = _localBusiness.Add(local);

            if (result > 0)
            {
                return Created($"/api/local/{local.cdFilial}&{local.cdLocal}", local);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet()]
        public IActionResult Get()
        {
            IEnumerable<LocalEntity> result = _localBusiness.GetAll();

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpGet("{cdFilial:int}&{cdLocal:int}")]
        public IActionResult Get(int cdFilial, int cdLocal)
        {
            LocalEntity result = _localBusiness.GetSingleBy(g => g.cdFilial == cdFilial &&
                                                                     g.cdLocal == cdLocal);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPut()]
        public IActionResult Update(LocalEntity local)
        {
            LocalEntity existing = _localBusiness.GetSingleBy(g => g.cdFilial == local.cdFilial &&
                                                                       g.cdLocal == local.cdLocal);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _localBusiness.Update(local);

            if (result > 0)
            {
                return Ok(local);
            }
            else
            {
                return BadRequest("Objeto não atualizado");
            }
        }

        [HttpDelete("{cdFilial:int}&{cdLocal:int}")]
        public IActionResult Delete(int cdFilial, int cdLocal)
        {
            LocalEntity existing = _localBusiness.GetSingleBy(g => g.cdFilial == cdFilial &&
                                                                        g.cdLocal == cdLocal);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _localBusiness.Delete(d => d.cdFilial == cdFilial &&
                                                    d.cdLocal == cdLocal);

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
            var result = _localBusiness.Search(s => s.cdFilial == cdFilial)
                                       .Select(s => new { s.cdLocal, s.dsLocal });

            if (result.ToList().Count() == 0) return NotFound();

            return Ok(result);

        }
    }
}