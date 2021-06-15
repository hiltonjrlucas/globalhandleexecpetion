using API.Business.PortalRH.Interfaces;
using API.Business.VicSaudeSeguranca;
using API.Model;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using VicFramework.Library;
using VicFramework.Model.Api;
using VicFramework.Model.Shared;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Model.VicSaudeSeguranca.Enum;

namespace API.Controllers.PortalRH
{
    [Route("api/login")]
    public class LoginController : BaseController
    {
        private ApiService _api;
        private readonly SmsService _sms;
        private readonly IUsuarioPermissaoBusiness _usuarioPermissaoBusiness;
        private readonly IConfiguration _configuration;
        private readonly ILoginBusiness _loginBusiness;

        public LoginController(ApiService api,  
                               IConfiguration configuration, 
                               ILoginBusiness loginBusiness, 
                               SmsService sms, 
                               IUsuarioPermissaoBusiness usuarioPermissaoBusiness)
        {
            _api = api;
            _configuration = configuration;
            _loginBusiness = loginBusiness;
            _sms = sms;
            _usuarioPermissaoBusiness = usuarioPermissaoBusiness;
        }

        [AllowAnonymous]
        [Route("access-token")]
        [HttpPost]
        public object Post(
        [FromBody]User usuario,
        [FromServices]TokenConfigurations tokenConfigurations)
        {
            int validation = _loginBusiness.ValidateUser(usuario.UserID);
            if (validation == (int)ContaEnum.UserNotFound || validation == (int)ContaEnum.UserBlocked)
            {
                return new
                {
                    authenticated = false,
                    message = validation
                };
            }

            Authentication auth = new Authentication();

            if (usuario != null && !string.IsNullOrWhiteSpace(usuario.UserID))
            {
                auth = _api.AuthenticateUserHCM(usuario);
            }

            if (auth.Login.Authenticated)
            {
                ClaimsIdentity identity = new ClaimsIdentity(
                    new GenericIdentity(usuario.UserID, "Login"),
                    new[] {
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N")),
                        new Claim(JwtRegisteredClaimNames.UniqueName, usuario.UserID)
                    }
                );

                var isAdminRH = _usuarioPermissaoBusiness.GetSingleBy(x => x.cdUsuario.Equals(usuario.UserID) && x.GrupoUsuario.dsGrupo.Equals("AdministradorRH"));

                auth.Login.Claims.Add(new Claim("acesso_adminRH", isAdminRH != null ? "True" : "False"));

                identity.AddClaims(auth.Login.Claims);

                DateTime dataCriacao = DateTime.Now;
                DateTime dataExpiracao = usuario.AccessKey.Equals(_configuration["CurriculumAccess"]) ?
                    dataCriacao + TimeSpan.FromHours(2) : dataCriacao + TimeSpan.FromSeconds(tokenConfigurations.Seconds);

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
                var accessToken = handler.WriteToken(securityToken);

                return new
                {
                    authenticated = true,
                    created = dataCriacao.ToString("yyyy-MM-dd HH:mm:ss"),
                    expiration = dataExpiracao.ToString("yyyy-MM-dd HH:mm:ss"),
                    apiSaudeSegurancaToken = accessToken,
                    apiAppServerToken = auth.AccessToken,
                    claims = auth.Login.Claims,
                    message = "OK"
                };
            }
            else
            {
                return new
                {
                    authenticated = false,
                    message = auth.Login.Message
                };
            }
        }

        [AllowAnonymous]
        [Route("user-access-token/{cdUsuario}")]
        [HttpPost]
        public object UserAccessToken(
        string cdUsuario,
        [FromServices]TokenConfigurations tokenConfigurations)
        {
            if (!string.IsNullOrEmpty(cdUsuario))
            {
                int validation = _loginBusiness.ValidateUser(cdUsuario);
                if (validation != (int)ContaEnum.Ok)
                {   
                    return new
                    {
                        authenticated = false,
                        message = validation
                    };
                }

                ClaimsIdentity identity = new ClaimsIdentity(
                    new GenericIdentity(cdUsuario, "Conta"),
                    new[] {
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N")),
                        new Claim(JwtRegisteredClaimNames.UniqueName, cdUsuario)
                    }
                );

                DateTime dataCriacao = DateTime.Now;
                DateTime dataExpiracao = dataCriacao + TimeSpan.FromSeconds(tokenConfigurations.Seconds);

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
                var accessToken = handler.WriteToken(securityToken);

                return new
                {
                    authenticated = true,
                    created = dataCriacao.ToString("yyyy-MM-dd HH:mm:ss"),
                    expiration = dataExpiracao.ToString("yyyy-MM-dd HH:mm:ss"),
                    apiSaudeSegurancaToken = accessToken,
                    message = "OK"
                };
            }
            else
            {
                return new
                {
                    authenticated = false,
                    message = "Matrícula não informada"
                };
            }
        }

        [Route("send-validation")]
        [HttpPost]
        public IActionResult SendValidation([FromBody]LoginModel model, [FromServices]EmailConfigurations emailConfigurations)
        {
            if (model != null)
            {
                string codigoAcesso = _loginBusiness.GenerateAccessCode(model.cdUsuario, model.dsCelular);
                if (!string.IsNullOrEmpty(codigoAcesso))
                {
                    var message = string.Format("Olá, o seu código de validação para o PortalRH é {1}", model.cdUsuario, codigoAcesso);
                    _sms.Send(new SmsModel
                    {
                        Phone = model.dsCelular,
                        Message = message
                    });

                    if (!string.IsNullOrEmpty(model.dsEmail))
                    {
                        var email = new ObjectEmail
                        {
                            assunto = "Código de validação de reset de senha PortalRH",
                            destinatario = model.dsEmail,
                            mensagem = Email.GetEmailBody(message, emailConfigurations.HostImg),
                            remetente = emailConfigurations.Remetente,
                            smtpHost = emailConfigurations.HostSMTP,
                            smtpPort = emailConfigurations.PortSMTP,
                            CC = "",
                            CCO = ""
                        };

                        Email.SendEmail(email);
                    }

                    return Ok();
                }

                return BadRequest("Erro ao criar código de acesso.");
            }

            return BadRequest("Objeto nulo");
        }

        [Route("validation-failed")]
        [HttpPost]
        public IActionResult ValidationFailed([FromBody]LoginModel model, [FromServices]EmailConfigurations emailConfigurations)
        {
            if (model != null)
            {
                int loginFailedCount = _loginBusiness.ValidationFailed(model.cdUsuario);
                if (loginFailedCount != 0)
                {
                    return Ok(loginFailedCount);
                }

                return BadRequest("Erro ao contabilizar o contador de falhas no login.");
            }

            return BadRequest("Objeto nulo");
        }

        [Authorize("Bearer")]
        [Route("validate")]
        [HttpPost]
        public IActionResult ValidateAccessCode([FromBody]LoginModel model, [FromServices]EmailConfigurations emailConfigurations)
        {
            if (model != null)
            {
                bool isValid = _loginBusiness.ValidateAccessCode(model.cdUsuario, model.cdCodigoAcesso);
                var changed = new ResetedPasswordModel
                {
                    reseted = false,
                    message = !isValid ? "Código de validação inválido." : ""
                };

                if (isValid)
                {
                    var change = new ChangePasswordModel
                    {
                        cdUsuario = model.cdUsuario,
                        stSenha = _loginBusiness.GenerateTempPassword(),
                        numDiasValidos = 1
                    };

                    var response = _api.ChangePassword(change);
                    if (response.success)
                    {
                        bool reseted = _loginBusiness.ChangeStatusUser(model.cdUsuario, true);
                        if (!reseted)
                        {
                            return BadRequest("Reset não permitido ou Usuário não encontrado.");
                        }

                        var message = string.Format("{0}. Sua senha temporária é {1}", JsonConvert.DeserializeObject<string>(response.content), change.stSenha);
                        _sms.Send(new SmsModel
                        {
                            Phone = model.dsCelular,
                            Message = message
                        });

                        if (!string.IsNullOrEmpty(model.dsEmail))
                        {
                            var email = new ObjectEmail
                            {
                                assunto = "Reset de senha PortalRH Vicunha",
                                destinatario = model.dsEmail + "@vicunha.com.br",
                                mensagem = Email.GetEmailBody(message, emailConfigurations.HostImg),
                                remetente = emailConfigurations.Remetente,
                                smtpHost = emailConfigurations.HostSMTP,
                                smtpPort = emailConfigurations.PortSMTP,
                                CC = "",
                                CCO = ""
                            };

                            Email.SendEmail(email);
                        }

                        changed.reseted = true;
                        changed.message = "";

                        return Ok(changed);
                    }

                    changed.message = response.content;
                }

                return BadRequest(changed.message);
            }

            return BadRequest("Objeto nulo");
        }

        [Route("change-password")]
        [HttpPut]
        public IActionResult ChangePassword([FromBody]ChangePasswordModel model)
        {
            if (model != null)
            {
                if (!string.IsNullOrEmpty(model.stSenhaNova) && !string.IsNullOrEmpty(model.stConfirmSenha) && (model.stConfirmSenha.Equals(model.stSenhaNova)))
                {
                    Authentication auth = _api.AuthenticateUserHCM(new User
                    {
                        UserID = model.cdUsuario,
                        AccessKey = model.stSenha,
                        tpAutenticacao = 1
                    });

                    if (auth.Login.Authenticated)
                    {
                        int numDias = (int)DateTime.Now.AddYears(1).Subtract(DateTime.Now).TotalDays;

                        var response = _api.ChangePassword(new ChangePasswordModel
                        {
                            cdUsuario = model.cdUsuario,
                            numDiasValidos = numDias,
                            stSenha = model.stSenhaNova
                        });
                        if (response.success)
                        {
                            bool changed = _loginBusiness.ChangeStatusUser(model.cdUsuario, false);

                            if (!changed)
                            {
                                return BadRequest("Erro ao atualizar senha, tente novamente.");
                            }

                            return Ok(new
                            {
                                changed = true,
                                message = JsonConvert.DeserializeObject<string>(response.content)
                            });
                        }

                        return BadRequest(JsonConvert.DeserializeObject<string>(response.content));
                    }

                    return Ok(new
                    {
                        changed = false,
                        message = auth.Login.Message
                    });
                }

                return BadRequest("A nova senha está diferente da senha de confirmação.");
            }

            return BadRequest("Objeto nulo");
        }

        [Route("check-need-change/{cdUsuario}")]
        [HttpGet]
        public IActionResult Status(string cdUsuario)
        {
            if (!string.IsNullOrEmpty(cdUsuario))
            {
                bool status = _loginBusiness.NeedChange(cdUsuario);

                return Ok(status);
            }

            return Ok(false);
        }

        [Authorize("AdminRH")]
        [Route("locked-users")]
        [HttpGet]
        public IActionResult LockedUsers()
        {
            IEnumerable<LockedUserViewModel> result = _loginBusiness.LockedUsers();

            if (result == null) return NotFound();

            return Ok(result);
        }

        [Authorize("AdminRH")]
        [Route("unlock-user")]
        [HttpPost]
        public IActionResult UnlockUser([FromBody]LoginModel model, [FromServices]EmailConfigurations emailConfigurations)
        {
            if (model != null)
            {
                bool isValid = _loginBusiness.UnlockUser(model.cdUsuario);
                if (isValid)
                {
                    var change = new ChangePasswordModel
                    {
                        cdUsuario = model.cdUsuario,
                        stSenha = _loginBusiness.GenerateTempPassword(),
                        numDiasValidos = 1
                    };

                    var response = _api.ChangePassword(change);
                    if (response.success)
                    {
                        var message = string.Format("Usuário desbloqueado e senha resetada, para acessar o PortalRH utilize a seguinte senha {0}", change.stSenha);
                        _sms.Send(new SmsModel
                        {
                            Phone = model.dsCelular,
                            Message = message
                        });

                        if (!string.IsNullOrEmpty(model.dsEmail))
                        {
                            var email = new ObjectEmail
                            {
                                assunto = "Desbloqueio usuário PortalRH",
                                destinatario = model.dsEmail,
                                mensagem = Email.GetEmailBody(message, emailConfigurations.HostImg),
                                remetente = emailConfigurations.Remetente,
                                smtpHost = emailConfigurations.HostSMTP,
                                smtpPort = emailConfigurations.PortSMTP,
                                CC = "",
                                CCO = ""
                            };

                            Email.SendEmail(email);
                        }

                        return Ok(new
                        {
                            unlocked = true
                        });
                    }

                    return Ok(new
                    {
                        unlocked = false,
                        message = response.content
                    });
                }

                return BadRequest("Desbloqueio não disponível.");
            }

            return BadRequest("Objeto nulo");
        }
    }
}
