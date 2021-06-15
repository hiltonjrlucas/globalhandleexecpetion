using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/cadastro-situacao-agendamento")]
    [ApiController]
    public class SituacaoController : BaseController
    {
        ISituacaoBusiness _situacaoBusiness;

        public SituacaoController(ISituacaoBusiness situacaoBusiness)
        {
            _situacaoBusiness = situacaoBusiness;
        }

        [HttpPost()]
        public IActionResult Insert(SituacaoEntity situacao)
        {
            SituacaoEntity existing = _situacaoBusiness.GetSingleBy(g => g.cdSituacao == situacao.cdSituacao);
            if (existing != null)
            {
                return BadRequest("Objeto Existente");
            }

            int result = _situacaoBusiness.Add(situacao);

            if (result > 0)
            {
                return Created($"/api/cadastro-situacao-agendamento/{situacao.cdSituacao}", situacao);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet()]
        public IActionResult Get()
        {
            IEnumerable<SituacaoEntity> result = _situacaoBusiness.GetAll();

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpGet("{cdSituacao:int}")]
        public IActionResult Get(int cdSituacao)
        {
            SituacaoEntity result = _situacaoBusiness.GetSingleBy(g => g.cdSituacao == cdSituacao);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPut()]
        public IActionResult Update(SituacaoEntity situacao)
        {
            SituacaoEntity existing = _situacaoBusiness.GetSingleBy(g => g.cdSituacao == situacao.cdSituacao);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _situacaoBusiness.Update(situacao);

            if (result > 0)
            {
                return Ok(situacao);
            }
            else
            {
                return BadRequest("Objeto não atualizado");
            }
        }

        [HttpDelete("{cdSituacao:int}")]
        public IActionResult Delete(int cdSituacao)
        {
            SituacaoEntity existing = _situacaoBusiness.GetSingleBy(g => g.cdSituacao == cdSituacao);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _situacaoBusiness.Delete(d => d.cdSituacao == cdSituacao);

            if (result > 0)
            {
                return Ok();
            }
            else
            {
                return BadRequest("Objeto não deletado");
            }
        }

        [HttpGet("GetSituacoesAtivas")]
        public IActionResult GetSituacoesAtivas()
        {
            var result = _situacaoBusiness.Search(g => g.cdStatus == 1)
                                           .Select(s => new { s.cdSituacao, s.dsSituacao });

            if (result.ToList().Count() == 0) return NotFound();

            return Ok(result);
        }
    }
}