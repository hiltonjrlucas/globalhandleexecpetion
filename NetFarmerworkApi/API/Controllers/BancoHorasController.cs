using Business.AppServerHCM;
using Model.Dto.AppServerHCM;
using Model.ViewModels.AppServerHCM;
using System;
using System.Web.Configuration;
using System.Web.Http;

namespace ModeloNetFramework.api.Controllers
{
    [Authorize]
    [RoutePrefix("api/banco-horas-hcm")]
    public class BancoHorasController : BaseController
    {
        private readonly BancoHorasHCMBusiness _business;

        public BancoHorasController()
        {
            _business = new BancoHorasHCMBusiness();
        }

        [Route("resumo")]
        [HttpPost]
        public IHttpActionResult Resumo([FromBody]BancoHorasViewModel model)
        {
            try
            {   
                ResumoBancoHorasDto resumo = _business.Resumo(model, urlAppServer);

                return Ok(resumo);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [Route("detalhe")]
        [HttpPost]
        public IHttpActionResult Detalhe([FromBody]BancoHorasViewModel model)
        {
            try
            {
                DetalheBancoHorasDto detalhe = _business.Detalhe(model, urlAppServer);

                return Ok(detalhe);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}