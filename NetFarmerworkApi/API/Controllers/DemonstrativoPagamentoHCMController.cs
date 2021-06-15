using Business.AppServerHCM;
using Library;
using Model.AppServerHCM;
using Model.ViewModels;
using Model.ViewModels.AppServerHCM;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Configuration;
using System.Web.Http;

namespace AppServer.api.Controllers
{
    [Authorize]
    [RoutePrefix("api/demonstrativo-pagamento-hcm")]
    public class DemonstrativoPagamentoHCMController : ApiController
    {
        private readonly DemonstrativoPagamentoHCMBusiness _business;

        public DemonstrativoPagamentoHCMController()
        {
            _business = new DemonstrativoPagamentoHCMBusiness();
        }

        [Route("resumo")]
        [HttpPost]
        public IHttpActionResult Resumo([FromBody]DemonstrativoPagamentoViewModel model)
        {
            try
            {
                if (!string.IsNullOrEmpty(model.pasUsuario))
                {
                    model.pasUsuario = Criptografia.Descriptografar(model.pasUsuario);
                }

                var connString = WebConfigurationManager.AppSettings["urlAppServerHCM"].ToString();
                ResumoDemonstrativoPagamentoDto resumo = _business.Resumo(model, connString);

                return Ok(resumo);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Route("detalhe")]
        [HttpPost]
        public IHttpActionResult Detalhe([FromBody]DemonstrativoPagamentoViewModel model)
        {
            try
            {
                if (!string.IsNullOrEmpty(model.pasUsuario))
                {
                    model.pasUsuario = Criptografia.Descriptografar(model.pasUsuario);
                }

                var connString = WebConfigurationManager.AppSettings["urlAppServerHCM"].ToString();
                DemonstrativoPagamentoDto demonstrativo = _business.FolhaPagamento(model, connString);

                return Ok(demonstrativo);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Route("export")]
        [HttpPost]
        public IHttpActionResult Export([FromBody]ExportDemonstrativoViewModel data)
        {
            try
            {
                var export = new List<DemonstrativoPagamentoDto>();
                data.demonstrativos.ForEach(item =>
                {
                    if (!string.IsNullOrEmpty(data.pasUsuario))
                    {
                        item.codUsuario = data.codUsuario;
                        item.pasUsuario = Criptografia.Descriptografar(data.pasUsuario);
                    }

                    var connString = WebConfigurationManager.AppSettings["urlAppServerHCM"].ToString();

                    DemonstrativoPagamentoDto demonstrativo = _business.FolhaPagamento(item, connString);
                    demonstrativo.folhaPagamento.nomeFuncionario = data.nomeUsuario;
                    demonstrativo.folhaPagamento.funcaoFuncionario = data.cargoUsuario;
                    demonstrativo.exportType = data.exportType;

                    export.Add(demonstrativo);
                });

                return Ok(new DownloadViewModel {
                    classKey = "demonstrativo-pagamento",
                    type = data.exportType,
                    fileName = $"demonstrativo-pagamento-{DateTime.Now.Ticks}",
                    data = export.OrderByDescending(o => o.folhaPagamento.datPagamento)
                });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
