using System;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class ExperienciaCandidatoBusiness : BaseBusiness<ExperienciaCandidatoEntity, IExperienciaCandidatoRepository>, IExperienciaCandidatoBusiness, IDisposable
    {
        public ExperienciaCandidatoBusiness(VicSaudeSegurancaUnitOfWork uow, IExperienciaCandidatoRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
