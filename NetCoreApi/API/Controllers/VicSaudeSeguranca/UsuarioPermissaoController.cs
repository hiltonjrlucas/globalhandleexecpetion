using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/cadastro-usuario-permissao")]
    [ApiController]
    public class UsuarioPermissaoController : BaseController
    {
        IUsuarioPermissaoBusiness _usuarioPermissaoBusiness;

        public UsuarioPermissaoController(IUsuarioPermissaoBusiness usuarioPermissaoBusiness)
        {
            _usuarioPermissaoBusiness = usuarioPermissaoBusiness;
        }

        [HttpPost()]
        public IActionResult Insert(UsuarioPermissaoEntity entity)
        {
            UsuarioPermissaoEntity existing = _usuarioPermissaoBusiness
                .GetSingleBy(g => g.cdFilial == entity.cdFilial && g.cdUsuario == entity.cdUsuario && g.cdGrupo == entity.cdGrupo);
            if (existing != null)
            {
                return BadRequest("Objeto Existente");
            }

            int result = _usuarioPermissaoBusiness.Add(entity);

            if (result > 0)
            {
                return Created($"/api/cadastro-usuario-permissao/{entity.cdFilial}&{entity.cdUsuario}", entity);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet()]
        public IActionResult Get()
        {
            IEnumerable<UsuarioPermissaoEntity> result = _usuarioPermissaoBusiness.GetAll(g => g.GrupoUsuario);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpGet("{cdUsuarioPermissao:int}")]
        public IActionResult Get(int cdUsuarioPermissao)
        {
            UsuarioPermissaoEntity result = _usuarioPermissaoBusiness.GetSingleBy(g => g.cdUsuarioPermissao == cdUsuarioPermissao);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPut()]
        public IActionResult Update(UsuarioPermissaoEntity entity)
        {
            UsuarioPermissaoEntity existing = _usuarioPermissaoBusiness.GetSingleBy(g => g.cdUsuarioPermissao == entity.cdUsuarioPermissao);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _usuarioPermissaoBusiness.Update(entity);

            if (result > 0)
            {
                return Ok(entity);
            }
            else
            {
                return BadRequest("Objeto não atualizado");
            }
        }

        [HttpDelete("{cdUsuarioPermissao:int}")]
        public IActionResult Delete(int cdUsuarioPermissao)
        {
            UsuarioPermissaoEntity existing = _usuarioPermissaoBusiness.GetSingleBy(g => g.cdUsuarioPermissao == cdUsuarioPermissao);
            if (existing == null)
            {
                return NotFound();
            }

            int result = _usuarioPermissaoBusiness.Delete(d => d.cdUsuarioPermissao == cdUsuarioPermissao);

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
        [HttpGet("GetByGrupo/{cdGrupo:int}")]
        public IActionResult GetByGrupo(int cdGrupo)
        {
            var result = _usuarioPermissaoBusiness.Search(g => g.GrupoUsuario.cdGrupo == cdGrupo)
                                                  .Select(s => new { s.cdUsuario });

            if (result.ToList().Count() == 0) return NotFound();

            return Ok(result);
        }

        [Authorize("Bearer")]
        [HttpGet("CheckUserAdmin/{cdUsuario}")]
        public IActionResult CheckUserAdmin(string cdUsuario)
        {
            IEnumerable<UsuarioPermissaoEntity> result = _usuarioPermissaoBusiness.Search(g => g.GrupoUsuario.cdGrupo == 1 && g.cdUsuario == cdUsuario);

            if (result.ToList().Count() == 0) return NotFound();

            return Ok(result);
        }

        [Authorize("Bearer")]
        [HttpGet("CheckUserType/{cdUsuario}")]
        public IActionResult CheckUserType(string cdUsuario)
        {
            IEnumerable<UsuarioPermissaoEntity> result = _usuarioPermissaoBusiness.Search(g => g.cdUsuario == cdUsuario);

            if (result.ToList().Count() == 0) return NotFound();

            return Ok(result);
        }
    }
}