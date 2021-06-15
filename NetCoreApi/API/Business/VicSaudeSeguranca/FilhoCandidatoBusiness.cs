using System;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class FilhoCandidatoBusiness : BaseBusiness<FilhoCandidatoEntity, IFilhoCandidatoRepository>, IFilhoCandidatoBusiness, IDisposable
    {
        public FilhoCandidatoBusiness(VicSaudeSegurancaUnitOfWork uow, IFilhoCandidatoRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
