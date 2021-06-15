using System;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class CentroCustoBusiness : BaseBusiness<CentroCustoEntity, ICentroCustoRepository>, ICentroCustoBusiness, IDisposable
    {
        public CentroCustoBusiness(VicSaudeSegurancaUnitOfWork uow, ICentroCustoRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
