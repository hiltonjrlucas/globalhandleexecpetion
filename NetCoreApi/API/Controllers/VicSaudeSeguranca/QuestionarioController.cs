using API.Business.BCU;
using API.Business.VicSaudeSeguranca;
using API.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using VicFramework.Library;
using VicFramework.Model.BCU;
using VicFramework.Model.Shared;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/questionario")]
    [ApiController]
    public class QuestionarioController : BaseController
    {
        IQuestaoBusiness _business;
        IVIC_FUNCIONARIOBusiness _funcionario;

        public QuestionarioController(IQuestaoBusiness business,
                                      IVIC_FUNCIONARIOBusiness funcionario)
        {
            _business = business;
            _funcionario = funcionario;
        }

        [HttpPost()]
        public IActionResult Insert(QuestaoEntity questao)
        {

            QuestaoEntity existing = _business.GetSingleBy(g => g.dsQuestao == questao.dsQuestao);
            if (existing != null)
            {
                return BadRequest("Objeto Existente");
            }

            int result = _business.Add(questao);

            if (result > 0)
            {
                return Created($"/api/questionario/", questao);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet()]
        public IActionResult Get()
        {
            IEnumerable<QuestaoEntity> result = _business.GetAll(x => x.Opcoes);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet("{cdQuestao:int}")]
        public IActionResult Get(int cdQuestao)
        {
            QuestaoEntity result = _business.GetSingleBy(g => g.cdQuestao == cdQuestao);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPut()]
        public IActionResult Update(QuestaoEntity area)
        {
            QuestaoEntity existing = _business.GetSingleBy(g => g.cdQuestao == area.cdQuestao);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _business.Update(area);

            if (result > 0)
            {
                return Ok(area);
            }
            else
            {
                return BadRequest("Objeto não atualizado");
            }
        }

        [HttpDelete("{cdQuestao:int}")]
        public IActionResult Delete(int cdQuestao)
        {
            QuestaoEntity existing = _business.GetSingleBy(g => g.cdQuestao == cdQuestao);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _business.Delete(d => d.cdQuestao == cdQuestao);

            if (result > 0)
            {
                return Ok();
            }
            else
            {
                return BadRequest("Objeto não deletado");
            }
        }

        [HttpGet("build-questions/{cdUsuario}")]
        public IActionResult BuildQuestions(string cdUsuario) => 
            Ok(_business.BuildQuestions(cdUsuario));

        [HttpPost("send-code")]
        public IActionResult SendCode(QuestionarioViewModel model, [FromServices]EmailConfigurations emailConfigurations)
        {
            bool result = _business.SendCode(model, emailConfigurations);
            return result ? (IActionResult)Ok() : (IActionResult)BadRequest();
        } 
            
    }
}