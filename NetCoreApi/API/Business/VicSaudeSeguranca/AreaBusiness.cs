using System;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class AreaBusiness : BaseBusiness<AreaEntity, IAreaRepository>, IAreaBusiness, IDisposable
    {
        public AreaBusiness(VicSaudeSegurancaUnitOfWork uow, IAreaRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
