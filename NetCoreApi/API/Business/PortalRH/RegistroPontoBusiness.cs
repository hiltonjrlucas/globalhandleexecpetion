using API.Business.PortalRH.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using VicFramework.Business;
using VicFramework.Model.Shared;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Model.VicSaudeSeguranca.Enum.RegistroPonto;
using VicFramework.Repository.PortalRH;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.PortalRH
{
    public class RegistroPontoBusiness : BaseBusiness<RegistroPontoEntity, IRegistroPontoRepository>, IRegistroPontoBusiness, IDisposable
    {

        public RegistroPontoBusiness(VicSaudeSegurancaUnitOfWork uow, IRegistroPontoRepository repository, INotificacao notificacao) 
                : base(uow, repository, notificacao) { }

        public override int Add(RegistroPontoEntity registroPontoEntity)
        {

            bool isValid = false;
            RegistroPontoEntity lastRegistroPonto = Search(s => s.cdUsuario == registroPontoEntity.cdUsuario
                                                                && s.dtRegistro.Date == DateTime.Today.Date)
                                                         .OrderByDescending(o => o.dtRegistro)
                                                         .FirstOrDefault();
            if (lastRegistroPonto != null)
            {
                isValid = lastRegistroPonto.cdTipoRegistro != registroPontoEntity.cdTipoRegistro;
            }
            else
            {
                isValid = registroPontoEntity.cdTipoRegistro == (int)cdTipoRegistro.Entrada;
            }

            if (isValid)
            {
                return base.Add(registroPontoEntity);
            }
            else {
                _notificacao.SetNotificacao("Batida fora da ordem estabelecida!");
                return 0;
            }
        }

        public IEnumerable<RegistroPontoEntity> GetRegistroPontosToday(string cdUsuario)
        {
            List<RegistroPontoEntity> lstRegistroPonto = Search(s => s.cdUsuario == cdUsuario
                                                                && s.dtRegistro.Date == DateTime.Today.Date)
                                                         .OrderByDescending(o => o.dtRegistro)
                                                         .Take(2).
                                                         OrderBy(o => o.cdTipoRegistro)
                                                         .ToList();
            if (lstRegistroPonto.Count() == (int)cdTipoRegistro.Saida)
            {

                RegistroPontoEntity registroPontoEntrada = lstRegistroPonto.Where(w => w.cdTipoRegistro == (int)cdTipoRegistro.Entrada).Single();
                RegistroPontoEntity registroPontoSaida = lstRegistroPonto.Where(w => w.cdTipoRegistro == (int)cdTipoRegistro.Saida).Single();

                if (registroPontoEntrada.dtRegistro > registroPontoSaida.dtRegistro)
                {
                    lstRegistroPonto.Remove(registroPontoSaida);
                }

            }

            return lstRegistroPonto;
        }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
