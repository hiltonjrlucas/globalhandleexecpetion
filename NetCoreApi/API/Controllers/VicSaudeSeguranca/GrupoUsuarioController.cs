using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/cadastro-grupo-usuario")]
    [ApiController]
    public class GrupoUsuarioController : BaseController
    {
        IGrupoUsuarioBusiness _grupoUsuarioBusiness;

        public GrupoUsuarioController(IGrupoUsuarioBusiness grupoUsuarioBusiness)
        {
            _grupoUsuarioBusiness = grupoUsuarioBusiness;
        }

        [HttpPost()]
        public IActionResult Insert(GrupoUsuarioEntity grupoUsuario)
        {
            GrupoUsuarioEntity existing = _grupoUsuarioBusiness.GetSingleBy(g => g.cdGrupo == grupoUsuario.cdGrupo);
            if (existing != null)
            {
                return BadRequest("Objeto Existente");
            }

            int result = _grupoUsuarioBusiness.Add(grupoUsuario);

            if (result > 0)
            {
                return Created($"/api/cadastro-grupo-usuario/{grupoUsuario.cdGrupo}", grupoUsuario);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet()]
        public IActionResult Get()
        {
            IEnumerable<GrupoUsuarioEntity> result = _grupoUsuarioBusiness.GetAll();

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpGet("{cdGrupo:int}")]
        public IActionResult Get(int cdGrupo)
        {
            GrupoUsuarioEntity result = _grupoUsuarioBusiness.GetSingleBy(g => g.cdGrupo == cdGrupo);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPut()]
        public IActionResult Update(GrupoUsuarioEntity grupoUsuario)
        {
            GrupoUsuarioEntity existing = _grupoUsuarioBusiness.GetSingleBy(g => g.cdGrupo == grupoUsuario.cdGrupo);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _grupoUsuarioBusiness.Update(grupoUsuario);

            if (result > 0)
            {
                return Ok(grupoUsuario);
            }
            else
            {
                return BadRequest("Objeto não atualizado");
            }
        }

        [HttpDelete("{cdGrupo:int}")]
        public IActionResult Delete(int cdGrupo)
        {
            GrupoUsuarioEntity existing = _grupoUsuarioBusiness.GetSingleBy(g => g.cdGrupo == cdGrupo);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _grupoUsuarioBusiness.Delete(d => d.cdGrupo == cdGrupo);

            if (result > 0)
            {
                return Ok();
            }
            else
            {
                return BadRequest("Objeto não deletado");
            }
        }
    }
}