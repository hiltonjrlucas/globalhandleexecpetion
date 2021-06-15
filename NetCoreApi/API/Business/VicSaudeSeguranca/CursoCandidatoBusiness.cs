using System;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class CursoCandidatoBusiness : BaseBusiness<CursoCandidatoEntity, ICursoCandidatoRepository>, ICursoCandidatoBusiness, IDisposable
    {
        public CursoCandidatoBusiness(VicSaudeSegurancaUnitOfWork uow, ICursoCandidatoRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
