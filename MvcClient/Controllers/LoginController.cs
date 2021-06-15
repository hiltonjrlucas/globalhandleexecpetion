using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Security.Claims;
using VicFramework.Library;
using VicFramework.Model.Api;
using VicFramework.Model.VicSaudeSeguranca;
using VicPortalRH.Models;
using VicPortalRH.Services;

namespace VicPortalRH.Controllers
{
    public class LoginController : BaseController
    {
        IConfiguration _configuration;

        public LoginController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public IActionResult Index(bool Authenticated)
        {
            return View();
        }

        [HttpPost]
        public JsonResult GenerateToken(User user)
        {
            if (user != null)
            {
                TokenModel token = ApiService.GetToken(user);
                if (token.Authenticated)
                {
                    HttpContext.Session.SetString("Authenticated", token.Authenticated.ToString());
                    HttpContext.Session.SetString("SaudeSegurancaToken", (token.ApiSaudeSegurancaToken == null ? "" : token.ApiSaudeSegurancaToken));
                    HttpContext.Session.SetString("AppServerApiToken", (token.ApiAppServerToken == null ? "" : token.ApiAppServerToken));
                    HttpContext.Session.SetString("UserPass", Criptografia.Criptografar(user.AccessKey));

                    Claim acesso_registroPonto = token.Claims.Find(f => f.Type == "acesso_registroPonto");
                    if (acesso_registroPonto != null)
                    {
                        HttpContext.Session.SetString("AcessoRegistroPonto", acesso_registroPonto.Value);
                    }

                    Claim acesso_adminRH = token.Claims.Find(f => f.Type == "acesso_adminRH");
                    HttpContext.Session.SetString("AdminRH", acesso_adminRH != null ? acesso_adminRH.Value : "False");

                    RequestModel request = new RequestModel
                    {
                        type = "GET",
                        service = "SaudeSeguranca",
                        url = "cadastro-usuario-permissao/CheckUserType/" + user.UserID,
                        body = ""
                    };

                    Response result = ApiService.RequestApi(request, token.ApiSaudeSegurancaToken);
                    var typeUserAreaMedica = Criptografia.Criptografar("basico");

                    if (result.statusCode.ToString() == "OK")
                    {
                        IEnumerable<UsuarioPermissaoEntity> usuarioPermissao = JsonConvert.DeserializeObject<IEnumerable<UsuarioPermissaoEntity>>(result.content);
                        IEnumerator<UsuarioPermissaoEntity> enumerator = usuarioPermissao.GetEnumerator();
                        enumerator.MoveNext();
                        int grupo = enumerator.Current.cdGrupo;
                        switch (grupo)
                        {
                            case 1:
                                typeUserAreaMedica = Criptografia.Criptografar("administrador");
                                break;
                            case 2:
                                typeUserAreaMedica = Criptografia.Criptografar("atendente");
                                break;
                            case 3:
                                typeUserAreaMedica = Criptografia.Criptografar("gestor");
                                break;
                            default:
                                typeUserAreaMedica = Criptografia.Criptografar("basico");
                                break;
                        }

                        HttpContext.Session.SetString("AcessoAreaMedica", "True");
                    }
                    else
                    {
                        HttpContext.Session.SetString("AcessoAreaMedica", "False");
                    }

                    return Json(StaticService.JsonSuccess(new
                    {
                        authenticated = token.Authenticated,
                        claims = token.Claims,
                        userAreaMedica = result.statusCode.ToString() == "OK" ? typeUserAreaMedica : Criptografia.Criptografar("basico")
                    }));
                }

                return Json(StaticService.JsonSuccess(new
                {
                    authenticated = token.Authenticated,
                    message = token.Message
                }));
            }

            return Json(StaticService.JsonError("Falha na tentativa de login."));
        }

        [HttpPost]
        public JsonResult GenerateTokenCandidato()
        {
            try
            {
                User user = new User
                {
                    tpAutenticacao = 1,
                    AccessKey = _configuration["CurriculumAccess"],
                    UserID = "anonymous"
                };

                TokenModel token = ApiService.GetToken(user);
                if (token.Authenticated)
                {
                    HttpContext.Session.SetString("Authenticated", token.Authenticated.ToString());
                    HttpContext.Session.SetString("SaudeSegurancaToken", (token.ApiSaudeSegurancaToken == null ? "" : token.ApiSaudeSegurancaToken));
                    HttpContext.Session.SetString("AppServerApiToken", (token.ApiSaudeSegurancaToken == null ? "" : token.ApiAppServerToken));
                    HttpContext.Session.SetString("UserPass", Criptografia.Criptografar(user.AccessKey));

                    Claim acesso_registroPonto = token.Claims.Find(f => f.Type == "acesso_registroPonto");
                    if (acesso_registroPonto != null)
                    {
                        HttpContext.Session.SetString("AcessoRegistroPonto", acesso_registroPonto.Value);
                    }

                    return Json(StaticService.JsonSuccess(new
                    {
                        authenticated = token.Authenticated,
                        claims = token.Claims
                    }));
                }

                return Json(StaticService.JsonSuccess(false));
            }
            catch (System.Exception ex)
            {
                return Json(StaticService.JsonError(ex.Message));
            }
        }
    }
}