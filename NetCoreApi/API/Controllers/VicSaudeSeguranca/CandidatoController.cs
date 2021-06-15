using API.Business.VicSaudeSeguranca;
using API.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using VicFramework.Library;
using VicFramework.Model.Shared;
using VicFramework.Model.Shared.Enums;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/[controller]")]
    [ApiController]
    public class CandidatoController : BaseController
    {
        private readonly ICandidatoBusiness _business;

        public CandidatoController(ICandidatoBusiness business)
        {
            _business = business;
        }

        [Route("verify/{cpf}")]
        [HttpGet]
        public IActionResult Verify(string cpf)
        {
            CandidatoEntity candidato = _business
                .Search(g => g.stCpf.Equals(cpf), i => i.CargoCandidato, i => i.CursoCandidato, i => i.ExperienciaCandidato, i => i.FilhoCandidato)
                .FirstOrDefault();

            return Ok(new {
                candidato.cdCandidato,
                candidato.dsEmail,
                candidato.dsNome
            });
        }

        [HttpPost()]
        public IActionResult Insert(CandidatoEntity entity)
        {
            if (entity != null)
            {
                CandidatoEntity candidato = _business
                    .GetSingleBy(g => g.cdCandidato == entity.cdCandidato || g.stCpf == entity.stCpf || g.stRG == entity.stRG || g.stCTPS == entity.stCTPS);
                if (candidato != null)
                {
                    return BadRequest("Objeto Existente");
                }

                return ApiResponse(_business.Add(entity), entity, "Erro ao criar um Currículum.");
            }

            return BadRequest("Objeto nulo");
        }

        [HttpPut()]
        public IActionResult Update(CandidatoEntity entity)
        {
            if (entity != null)
            {
                CandidatoEntity candidato = _business
                    .GetSingleBy(g => g.cdCandidato == entity.cdCandidato || g.stCpf == entity.stCpf || g.stRG == entity.stRG || g.stCTPS == entity.stCTPS);
                if (candidato != null)
                {
                    return ApiResponse(_business.Update(entity), entity, "Erro ao atualizar o Currículum.");
                }

                return NotFound();
            }

            return BadRequest("Objeto nulo");
        }

        [Route("send-validation")]
        [HttpPost()]
        public IActionResult SendValidation(ValidacaoCandidato validacao, [FromServices]EmailConfigurations emailConfigurations)
        {
            StatusEmail response = new StatusEmail();
            string codigoAcesso = _business.GenerateAccessCode(validacao.candidato.cdCandidato);

            switch (validacao.origin)
            {
                case MessageType.Email:
                    var mensagem = $"Olá, seu código de acesso para o portal de Ficha de Cadastro Vicunha é: <strong>{codigoAcesso}</strong>";
                    var email = new ObjectEmail
                    {
                        assunto = "Código de acesso à Ficha de Cadastro Vicunha",
                        destinatario = validacao.candidato.dsEmail,
                        mensagem = Email.GetEmailBody(mensagem, emailConfigurations.HostImg),
                        remetente = emailConfigurations.Remetente,
                        smtpHost = emailConfigurations.HostSMTP,
                        smtpPort = emailConfigurations.PortSMTP,
                        CC = "",
                        CCO = ""
                    };

                    response = Email.SendEmail(email);
                    break;
                default:
                    break;
            }

            if (response.sendedEmail)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        [Route("validate/{cdCandidato:int}/{dsCodigoAcesso}")]
        [HttpGet()]
        public IActionResult Validation(int cdCandidato, string dsCodigoAcesso)
        {
            if (cdCandidato != 0 && !string.IsNullOrEmpty(dsCodigoAcesso))
            {
                CandidatoEntity candidato = _business.ValidateAccessCode(cdCandidato, dsCodigoAcesso);
                if (candidato != null)
                {
                    return Ok(candidato);
                }
            }

            return BadRequest("Código de Acesso inválido.");
        }
    }
}