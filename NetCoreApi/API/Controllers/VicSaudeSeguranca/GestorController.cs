using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/cadastro-de-gestor")]
    [ApiController]
    public class GestorController : BaseController
    {
        IGestorBusiness _gestorBusiness;

        public GestorController(IGestorBusiness gestorBusiness)
        {
            _gestorBusiness = gestorBusiness;
        }

        [HttpPost()]
        public IActionResult Insert(GestorEntity gestor)
        {
            GestorEntity existing = _gestorBusiness.GetSingleBy(g => g.cdFilial == gestor.cdFilial &&
                                                                         g.cdUsuario == gestor.cdUsuario &&
                                                                         g.cdCentroCusto == gestor.cdCentroCusto);
            if (existing != null)
            {
                return BadRequest("Objeto Existente");
            }

            int result = _gestorBusiness.Add(gestor);

            if (result > 0)
            {
                return Created($"/api/cadastro-de-gestor/{gestor.cdFilial}&{gestor.cdUsuario}&{gestor.cdCentroCusto}", gestor);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet()]
        public IActionResult Get()
        {
            IEnumerable<GestorEntity> result = _gestorBusiness.GetAll();

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpGet("{cdFilial:int}&{cdUsuario}&{cdCentroCusto}")]
        public IActionResult Get(int cdFilial, string cdUsuario, string cdCentroCusto)
        {
            GestorEntity result = _gestorBusiness.GetSingleBy(g => g.cdFilial == cdFilial &&
                                                                       g.cdUsuario == cdUsuario &&
                                                                       g.cdCentroCusto == cdCentroCusto);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPut()]
        public IActionResult Update(GestorEntity gestor)
        {
            GestorEntity existing = _gestorBusiness.GetSingleBy(g => g.cdFilial == gestor.cdFilial &&
                                                                         g.cdUsuario == gestor.cdUsuario &&
                                                                         g.cdCentroCusto == gestor.cdCentroCusto);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _gestorBusiness.Update(gestor);

            if (result > 0)
            {
                return Ok(gestor);
            }
            else
            {
                return BadRequest("Objeto não atualizado");
            }
        }

        [HttpDelete("{cdFilial:int}&{cdUsuario}&{cdCentroCusto}")]
        public IActionResult Delete(int cdFilial, string cdUsuario, string cdCentroCusto)
        {
            GestorEntity existing = _gestorBusiness.GetSingleBy(g => g.cdFilial == cdFilial &&
                                                                         g.cdUsuario == cdUsuario &&
                                                                         g.cdCentroCusto == cdCentroCusto);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _gestorBusiness.Delete(d => d.cdFilial == cdFilial &&
                                                       d.cdUsuario == cdUsuario &&
                                                       d.cdCentroCusto == cdCentroCusto);

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