using API.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using VicFramework.Library;
using VicFramework.Model.Api;

namespace API.Controllers.VicSaudeSeguranca
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginADController : BaseController
    {
        [AllowAnonymous]
        [HttpPost]
        public object Post(
        [FromBody] User usuario,
        [FromServices] TokenConfigurations tokenConfigurations)
        {
            bool credenciaisValidas = false;

            if (usuario != null && !string.IsNullOrWhiteSpace(usuario.UserID))
            {
                switch (usuario.tpAutenticacao)
                {
                    case 1:
                        credenciaisValidas = ActiveDirectory.UserActive(usuario.UserID);
                        break;
                    case 2:
                        credenciaisValidas = ActiveDirectory.UserAuthorized(usuario.UserID, Criptografia.Descriptografar(usuario.AccessKey));
                        break;
                    case 3:
                        credenciaisValidas = ActiveDirectory.UserGroupAuthorized(usuario.UserID, usuario.AccessKey);
                        break;
                    default:
                        break;
                }
            }

            if (credenciaisValidas)
            {
                ClaimsIdentity identity = new ClaimsIdentity(
                    new GenericIdentity(usuario.UserID, "Login"),
                    new[] {
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N")),
                        new Claim(JwtRegisteredClaimNames.UniqueName, usuario.UserID)
                    }
                );

                DateTime dataCriacao = DateTime.Now;
                DateTime dataExpiracao = dataCriacao +
                                         TimeSpan.FromSeconds(tokenConfigurations.Seconds);

                var handler = new JwtSecurityTokenHandler();
                var securityToken = handler.CreateToken(new SecurityTokenDescriptor
                {
                    Issuer = tokenConfigurations.Issuer,
                    Audience = tokenConfigurations.Audience,
                    SigningCredentials = tokenConfigurations.SigningCredentials,
                    Subject = identity,
                    NotBefore = dataCriacao,
                    Expires = dataExpiracao
                });
                var token = handler.WriteToken(securityToken);

                return new
                {
                    authenticated = true,
                    created = dataCriacao.ToString("yyyy-MM-dd HH:mm:ss"),
                    expiration = dataExpiracao.ToString("yyyy-MM-dd HH:mm:ss"),
                    accessToken = token,
                    message = "OK"
                };
            }
            else
            {
                return new
                {
                    authenticated = false,
                    message = "Falha ao autenticar"
                };
            }
        }
    }
}
