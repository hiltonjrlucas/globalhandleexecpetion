using API.Business.BCU;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using VicFramework.Model.BCU;

namespace API.Controllers.BCU
{
    [Route("api/[controller]")]
    public class BCUController : BaseController
    {
        IVIC_FUNCIONARIOBusiness _vicfuncionarioBusiness;

        public BCUController(IVIC_FUNCIONARIOBusiness vicfuncionarioBusiness)
        {
            _vicfuncionarioBusiness = vicfuncionarioBusiness;
        }

        [Authorize("Bearer")]
        [HttpGet("Funcionario/{login}")]
        public IActionResult Get(string login)
        {
            bool isInt;

            isInt = int.TryParse(login.Substring(0, 2), out int empresa);
            isInt = int.TryParse(login.Substring(2, 2), out int estabelecimento);
            isInt = int.TryParse(login.Substring(4), out int funcionario);

            return Ok(_vicfuncionarioBusiness.GetSingleBy(p => p.cdn_empresa == empresa  &&
                                                               p.cdn_estab == estabelecimento &&
                                                               p.cdn_funcionario == funcionario));
        }

        [Authorize("Bearer")]
        [HttpGet("GetFuncionarios/{cdFilial:int}")]
        public IActionResult GetFuncionarios(int cdFilial)
        {
            return Ok(_vicfuncionarioBusiness.Search(s => s.cdn_estab == cdFilial &&
                                                              s.ad_login != null &&
                                                              s.dat_desligto_func == null)
                                                 .Select(s => new {
                                                     cdUsuario = s.ad_login,
                                                     dsUsuario = s.ad_login + "-" + s.nom_pessoa_fisic
                                                 }));
        }

        [Authorize("Bearer")]
        [HttpGet("GetFuncionariosByFilter/{empresa}&{estabelecimento}&{matricula}&{nome}&{area}")]
        public IActionResult GetFuncionariosByFilter(string empresa, string estabelecimento, string matricula, string nome, string area)
        {
            IEnumerable<VIC_FUNCIONARIOEntity> result = _vicfuncionarioBusiness.GetFuncionariosByFilter(empresa, estabelecimento, matricula, nome, area);

            if (result == null) return NotFound();

            return Ok(result);
        }
    }
}