using System;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class LocalBusiness : BaseBusiness<LocalEntity, ILocalRepository>, ILocalBusiness, IDisposable    
    {
        public LocalBusiness(VicSaudeSegurancaUnitOfWork uow, ILocalRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
