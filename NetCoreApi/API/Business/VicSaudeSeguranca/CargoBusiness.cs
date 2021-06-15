using System;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class CargoBusiness : BaseBusiness<CargoEntity, ICargoRepository>, ICargoBusiness, IDisposable
    {
        public CargoBusiness(VicSaudeSegurancaUnitOfWork uow, ICargoRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
