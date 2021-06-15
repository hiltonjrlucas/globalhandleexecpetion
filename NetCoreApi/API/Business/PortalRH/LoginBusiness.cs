using API.Business.BCU;
using API.Business.PortalRH.Interfaces;
using API.Model;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using VicFramework.Business;
using VicFramework.Library;
using VicFramework.Model.BCU;
using VicFramework.Model.Shared;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Model.VicSaudeSeguranca.Enum;
using VicFramework.Repository.PortalRH;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.PortalRH
{
    public class LoginBusiness : BaseBusiness<LoginEntity, ILoginRepository>, ILoginBusiness, IDisposable
    {
        private readonly IVIC_FUNCIONARIOBusiness _funcionarioBusiness;
        private readonly SmsService _sms;

        public LoginBusiness(VicSaudeSegurancaUnitOfWork uow,
                            ILoginRepository repository,
                            INotificacao notificacao,
                            IVIC_FUNCIONARIOBusiness funionarioBusiness,
                            SmsService sms)
                : base(uow, repository, notificacao)
        {
            _funcionarioBusiness = funionarioBusiness;
            _sms = sms;
        }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }

        public string GenerateAccessCode(string cdUsuario, string dsCelular)
        {
            int result = 0;
            string ticks = DateTime.Now.Ticks.ToString();
            string codigoAcesso = ticks.Substring(ticks.Length - 7, 6);

            LoginEntity entity = GetSingleBy(x => x.cdUsuario.Equals(cdUsuario));
            if (entity != null)
            {
                entity.cdCodigoAcesso = codigoAcesso;
                entity.dsCelular = dsCelular;

                result = Update(entity);
            }
            else
            {
                entity = new LoginEntity
                {
                    cdCodigoAcesso = codigoAcesso,
                    cdUsuario = cdUsuario,
                    stTotalFalhas = 0,
                    dsCelular = dsCelular
                };

                result = Add(entity);
            }

            if (result > 0)
            {
                return codigoAcesso;
            }

            return null;
        }

        public int ValidationFailed(string cdUsuario)
        {
            int result;
            LoginEntity entity = GetSingleBy(x => x.cdUsuario.Equals(cdUsuario));
            if (entity != null)
            {
                entity.stTotalFalhas += 1;

                result = Update(entity);
            }
            else
            {
                entity = new LoginEntity
                {
                    cdUsuario = cdUsuario,
                    stTotalFalhas = 1
                };

                result = Add(entity);
            }

            return result > 0 ? entity.stTotalFalhas : 0;
        }

        public bool ValidateAccessCode(string cdUsuario, string cdCodigoAcesso)
        {
            LoginEntity entity = GetSingleBy(x => x.cdUsuario.Equals(cdUsuario) && x.cdCodigoAcesso.Equals(cdCodigoAcesso));

            if (entity != null)
            {
                entity.cdCodigoAcesso = null;
                entity.stTotalFalhas = 0;

                return Update(entity) > 0;
            }

            return false;
        }

        public string GenerateTempPassword()
        {
            var numbers = "0123456789";
            var words = new List<string>
            {
                "paRd", "Prta", "iNta", "Fpr", "biCst", "chnLo", "Moo", "Lz", "Si", "gA", "inhA", "Brm", "Ndgo", "nMe", "Lgn", "snH", "anmL", "aV", "pSsro", "aiGd"
            };
            var characters = "!@#$%&";
            var password = words[new Random().Next(words.Count)];

            do
            {
                var character = characters[new Random().Next(characters.Length)].ToString();
                password = password.Insert(new Random().Next(password.Length), character);

                var number = numbers[new Random().Next(numbers.Length)].ToString();
                password = password.Insert(new Random().Next(password.Length), number);
            } while (password.Length < 8);

            return password;
        }

        public bool ChangeStatusUser(string cdUsuario, bool resetUser)
        {
            LoginEntity entity = GetSingleBy(x => x.cdUsuario.Equals(cdUsuario));
            if (entity != null)
            {
                entity.stResetado = resetUser;
                entity.dtUltimoReset = resetUser ? DateTime.Now : (DateTime?)null;


                return Update(entity) > 0;
            }

            return false;
        }

        public bool NeedChange(string cdUsuario)
        {
            LoginEntity entity = GetSingleBy(x => x.cdUsuario.Equals(cdUsuario));

            if (entity != null)
            {
                return entity.cdCodigoAcesso == null && entity.stResetado;
            }

            return false;
        }

        public bool UnlockUser(string cdUsuario)
        {
            LoginEntity entity = GetSingleBy(x => x.cdUsuario.Equals(cdUsuario));

            if (entity != null)
            {
                entity.cdCodigoAcesso = null;
                entity.stResetado = true;
                entity.stTotalFalhas = 0;
                entity.dtUltimoReset = null;

                return Update(entity) > 0;
            }

            return false;
        }

        public IEnumerable<LockedUserViewModel> LockedUsers()
        {
            var data = Search(s => s.stTotalFalhas >= 3).ToList();
            var funcionarios = _funcionarioBusiness.Search(s => data.Select(x => x.cdUsuario).Contains(s.lg_automatico)).ToList();

            return data.Select(s =>
            {
                var result = new LockedUserViewModel
                {
                    cdUsuario = s.cdUsuario,
                    dsCelular = s.dsCelular,
                };

                var userData = funcionarios.Where(w => w.lg_automatico.Equals(s.cdUsuario)).FirstOrDefault();
                if (userData != null)
                {
                    result.dsEmail = userData.ad_email;
                    result.dsUsuario = userData.ad_nome_abreviado;
                }

                return result;
            });
        }

        public int ValidateUser(string cdUsuario)
        {
            var user = _funcionarioBusiness.GetSingleBy(x => (x.ad_login.Equals(cdUsuario) || x.lg_automatico.Equals(cdUsuario)) && x.dat_desligto_func == null);
            if (user != null)
            {
                var userLogin = GetSingleBy(x => x.cdUsuario.Equals(cdUsuario));
                if (userLogin != null)
                {
                    if (!(userLogin.stTotalFalhas < 3))
                    {
                        return (int)ContaEnum.UserBlocked;
                    }

                    if (userLogin.dtUltimoReset.HasValue && DateTime.Now.Subtract(userLogin.dtUltimoReset.Value).Days < 1)
                    {
                        return (int)ContaEnum.UserChangeRecent;
                    }
                }

                return (int)ContaEnum.Ok;
            }

            return (int)ContaEnum.UserNotFound;
        }

        public void SendAccessCode(string cdUsuario, string dsCelular, string dsEmail, EmailConfigurations emailConfigurations)
        {
            string codigoAcesso = GenerateAccessCode(cdUsuario, dsCelular);
            if (!string.IsNullOrEmpty(codigoAcesso))
            {
                var message = string.Format("Use o código de validação {1} para o PortalRH Vicunha", cdUsuario, codigoAcesso);
                _sms.Send(new SmsModel
                {
                    Phone = dsCelular,
                    Message = message
                });

                if (!string.IsNullOrEmpty(dsEmail))
                {
                    var email = new ObjectEmail
                    {
                        assunto = "Código de validação de reset de senha PortalRH",
                        destinatario = dsEmail + "@vicunha.com.br",
                        mensagem = Email.GetEmailBody(message, emailConfigurations.HostImg),
                        remetente = emailConfigurations.Remetente,
                        smtpHost = emailConfigurations.HostSMTP,
                        smtpPort = emailConfigurations.PortSMTP,
                        CC = "",
                        CCO = ""
                    };

                    Email.SendEmail(email);
                }
            }
        }
    }
}
