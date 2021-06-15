using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VicFramework.Model.Shared;

namespace API.Controllers
{
    [Produces("application/json")]
    public abstract class BaseController : ControllerBase
    {

        private readonly INotificacao _notificacao;
        public BaseController(INotificacao notificacao)
        {
            _notificacao = notificacao;
        }

        public BaseController() { }

        protected IActionResult VerificarNotificacao(IActionResult acao)
        {
            return _notificacao.HasNotificacao() 
                    ? BadRequest(_notificacao.GetNotificacoes())
                    : acao;
        }

        protected IActionResult VerificarNotificacao(IActionResult acao, int result, object newObj)
        {
            return _notificacao.HasNotificacao()
                    ? BadRequest(_notificacao.GetNotificacoes())
                    : result > 0 
                        ? acao
                        : Conflict(newObj);
        }

        public ObjectResult ApiResponse(int result, object data, string errorMessage)
        {
            if (result > 0)
            {
                return StatusCode(StatusCodes.Status200OK, data);
            }

            return StatusCode(StatusCodes.Status400BadRequest, errorMessage);
        }
    }
}
