using System;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class FilialBusiness : BaseBusiness<FilialEntity, IFilialRepository>, IFilialBusiness, IDisposable
    {
        public FilialBusiness(VicSaudeSegurancaUnitOfWork uow, IFilialRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
