using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/cadastro-de-agendamento")]
    [ApiController]
    public class AgendamentoController : BaseController
    {
        IAgendamentoBusiness _agendamentoBusiness;

        public AgendamentoController(IAgendamentoBusiness agendamentoBusiness)
        {
            _agendamentoBusiness = agendamentoBusiness;
        }

        [HttpPost()]
        public IActionResult Insert(AgendamentoEntity agendamento)
        {
            AgendamentoEntity existing = _agendamentoBusiness.GetSingleBy(g => g.cdFilial == agendamento.cdFilial &&
                                                                               g.dtAgendamento == agendamento.dtAgendamento &&
                                                                               g.cdProfissional == agendamento.cdProfissional);
            if (existing != null)
            {
                return BadRequest("Objeto Existente");
            }

            int result = _agendamentoBusiness.Add(agendamento);

            if (result > 0)
            {
                return Created($"/api/agendamento/{agendamento.cdFilial}&{agendamento.dtAgendamento}&{agendamento.cdProfissional}", agendamento);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet()]
        public IActionResult Get()
        {
            IEnumerable<AgendamentoEntity> result = _agendamentoBusiness.GetAll();

            return Ok(result);
        }

        [HttpGet("{cdFilial:int}&{dtAgendamento:datetime}&{cdProfissional}")]
        public IActionResult Get(int cdFilial, DateTime dtAgendamento, string cdProfissional)
        {
            AgendamentoEntity result = _agendamentoBusiness.GetSingleBy(g => g.cdFilial == cdFilial &&
                                                                             g.dtAgendamento == dtAgendamento &&
                                                                             g.cdProfissional == cdProfissional);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPut()]
        public IActionResult Update(AgendamentoEntity agendamento)
        {
            AgendamentoEntity existing = _agendamentoBusiness.GetSingleBy(g => g.cdFilial == agendamento.cdFilial &&
                                                                               g.dtAgendamento == agendamento.dtAgendamento &&
                                                                               g.cdProfissional == agendamento.cdProfissional);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _agendamentoBusiness.Update(agendamento);

            if (result > 0)
            {
                return Ok(agendamento);
            }
            else
            {
                return BadRequest("Objeto não atualizado");
            }
        }

        [HttpDelete("{cdFilial:int}&{dtAgendamento:datetime}&{cdProfissional:int}")]
        public IActionResult Delete(int cdFilial, DateTime dtAgendamento, string cdProfissional)
        {
            AgendamentoEntity existing = _agendamentoBusiness.GetSingleBy(g => g.cdFilial == cdFilial &&
                                                                               g.dtAgendamento == dtAgendamento &&
                                                                               g.cdProfissional == cdProfissional);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _agendamentoBusiness.Delete(d => d.cdFilial == cdFilial &&
                                                          d.dtAgendamento == dtAgendamento &&
                                                          d.cdProfissional == cdProfissional);

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
        [HttpGet("GetAgendamentoCadastros")]
        public IActionResult GetAgendamentoCadastros()
        {
            return Ok(_agendamentoBusiness.GetAgendamentoCadastros());
        }

        [Authorize("Bearer")]
        [HttpPost("InsertExcel")]
        public IActionResult InsertExcel([FromBody] byte[] rawData)
        {
            MemoryStream stream = new MemoryStream(rawData);

            int result = _agendamentoBusiness.InsertExcel(stream);

            if (result > 0)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest();
            }            
        }
    }
}