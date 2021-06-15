using System;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class GestorBusiness : BaseBusiness<GestorEntity, IGestorRepository>, IGestorBusiness, IDisposable
    {
        public GestorBusiness(VicSaudeSegurancaUnitOfWork uow, IGestorRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
