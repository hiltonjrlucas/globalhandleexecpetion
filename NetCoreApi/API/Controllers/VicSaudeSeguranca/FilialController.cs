using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/cadastro-de-filial")]
    [ApiController]
    public class FilialController : BaseController
    {
        IFilialBusiness _filialBusiness;

        public FilialController(IFilialBusiness filialBusiness)
        {
            _filialBusiness = filialBusiness;
        }

        [HttpPost()]
        public IActionResult Insert(FilialEntity filial)
        {
            FilialEntity existing = _filialBusiness.GetSingleBy(g => g.cdFilial == filial.cdFilial);
            if (existing != null)
            {
                return BadRequest("Objeto Existente");
            }

            int result = _filialBusiness.Add(filial);

            if (result > 0)
            {
                return Created($"/api/cadastro-de-filial/{filial.cdFilial}", filial);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet()]
        public IActionResult Get()
        {
            IEnumerable<FilialEntity> result = _filialBusiness.GetAll();

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpGet("{cdFilial:int}")]
        public IActionResult Get(int cdFilial)
        {
            FilialEntity result = _filialBusiness.GetSingleBy(g => g.cdFilial == cdFilial);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPut()]
        public IActionResult Update(FilialEntity filial)
        {
            FilialEntity existing = _filialBusiness.GetSingleBy(g => g.cdFilial == filial.cdFilial);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _filialBusiness.Update(filial);

            if (result > 0)
            {
                return Ok(filial);
            }
            else
            {
                return BadRequest("Objeto não atualizado");
            }
        }

        [HttpDelete("{cdFilial:int}")]
        public IActionResult Delete(int cdFilial)
        {
            FilialEntity existing = _filialBusiness.GetSingleBy(g => g.cdFilial == cdFilial);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _filialBusiness.Delete(d => d.cdFilial == cdFilial);

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