using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/controle-de-atendimento")]
    [ApiController]
    public class AtendimentoController : BaseController
    {
        IAtendimentoBusiness _atendimentoBusiness;
        IAgendamentoBusiness _agendamentoBusiness;

        public AtendimentoController(IAtendimentoBusiness atendimentoBusiness, IAgendamentoBusiness agendamentoBusiness)
        {
            _atendimentoBusiness = atendimentoBusiness;
            _agendamentoBusiness = agendamentoBusiness;
        }

        [Authorize("Bearer")]
        [HttpGet("GetRelacaoPessoal/{cdFilial:int}&{cdProcedimento:int}&{cdUsuario}")]
        public IActionResult GetRelacaoPessoal(int cdFilial, int cdProcedimento, string cdUsuario)
        {
            return Ok(_atendimentoBusiness.GetRelacaoPessoal(cdFilial, cdProcedimento, cdUsuario));
        }

        [Authorize("Bearer")]
        [HttpGet("GetAgendaAtendimento/{cdFilial:int}&{cdProcedimento:int}")]
        public IActionResult GetAgendaAtendimento(int cdFilial, int cdProcedimento)
        {
            return Ok(_agendamentoBusiness.GetAgendamentoAtendimento(cdFilial, cdProcedimento));
        }

        [Authorize("Bearer")]
        [HttpGet("GetConsultaAtendimento")]
        public IActionResult GetConsultaAtendimento()
        {
            return Ok(_agendamentoBusiness.GetConsultaAtendimento());
        }
    }
}