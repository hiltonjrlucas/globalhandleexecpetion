using API.Business.PortalRH.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using VicFramework.Model.Shared;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.PortalRH
{
    [Authorize("PontoWeb")]
    [Route("api/[controller]")]
    [ApiController]
    public class RegistroPontoController : BaseController
    {
        private readonly IRegistroPontoBusiness _registroPontoBusiness;


        public RegistroPontoController(IRegistroPontoBusiness registroPontoBusiness, INotificacao notificacao) : base(notificacao)
        {
            _registroPontoBusiness = registroPontoBusiness;
        }

        [Route("[action]/{cdUsuario}")]
        [HttpGet]
        public IActionResult GetRegistroPontosToday(string cdUsuario)
        {
            //Busca o último registro inserido no dia de hoje
            List<RegistroPontoEntity> lstRegistroPonto = _registroPontoBusiness.GetRegistroPontosToday(cdUsuario).ToList();

            return Ok(lstRegistroPonto);
        }

        [HttpPost]
        public IActionResult Insert(RegistroPontoEntity registroPonto)
        {
            registroPonto.dtRegistro = DateTime.Now;
            var registros = _registroPontoBusiness.Add(registroPonto);

            //return Created("", registroPonto);
            return VerificarNotificacao(Created("", registroPonto), registros, registroPonto);
        }

        [Route("[action]/{cdUsuario}/{de}/{ate}")]
        [HttpGet]
        public IActionResult GetRegistroPontosByRangeDate(string cdUsuario, DateTime de, DateTime ate)
        {
            List<RegistroPontoEntity> lstRegistrosPontos = _registroPontoBusiness.Search(s => s.cdUsuario == cdUsuario &&
                                                                                                s.dtRegistro.Date >= de.Date &&
                                                                                                s.dtRegistro.Date <= ate.Date)
                                                                                    .OrderByDescending(o => o.dtRegistro)
                                                                                    .ToList(); 

            return Ok(lstRegistrosPontos);
        }

    }
}