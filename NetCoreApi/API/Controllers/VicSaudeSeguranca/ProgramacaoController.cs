using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/cadastro-de-programacao")]
    [ApiController]
    public class ProgramacaoController : BaseController
    {
        IProgramacaoBusiness _programacaoBusiness;

        public ProgramacaoController(IProgramacaoBusiness programacaoBusiness)
        {
            _programacaoBusiness = programacaoBusiness;
        }

        [HttpPost()]
        public IActionResult Insert(ProgramacaoEntity programacao)
        {
            ProgramacaoEntity existing = _programacaoBusiness.GetSingleBy(g => g.idProgramacao == programacao.idProgramacao);
            if (existing != null)
            {
                return BadRequest("Objeto Existente");
            }

            int result = _programacaoBusiness.Add(programacao);

            if (result > 0)
            {
                return Created($"/api/programacao/{programacao.idProgramacao}", programacao);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet()]
        public IActionResult Get()
        {
            IEnumerable<ProgramacaoEntity> result = _programacaoBusiness.GetAll(g => g.Procedimento);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpGet("{idProgramacao:int}")]
        public IActionResult Get(int idProgramacao)
        {
            ProgramacaoEntity result = _programacaoBusiness.GetSingleBy(g => g.idProgramacao == idProgramacao);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPut()]
        public IActionResult Update(ProgramacaoEntity programacao)
        {
            ProgramacaoEntity existing = _programacaoBusiness.GetSingleBy(g => g.idProgramacao == programacao.idProgramacao);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _programacaoBusiness.Update(programacao);

            if (result > 0)
            {
                return Ok(programacao);
            }
            else
            {
                return BadRequest("Objeto não atualizado");
            }
        }

        [HttpDelete("{idProgramacao:int}")]
        public IActionResult Delete(int idProgramacao)
        {
            ProgramacaoEntity existing = _programacaoBusiness.GetSingleBy(g => g.idProgramacao == idProgramacao);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _programacaoBusiness.Delete(d => d.idProgramacao == idProgramacao);

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
        [HttpPost("InsertExcel")]
        public IActionResult InsertExcel([FromBody] byte[] rawData)
        {
            MemoryStream stream = new MemoryStream(rawData);

            int result = _programacaoBusiness.InsertExcel(stream);

            return Ok(result);
        }
    }
}