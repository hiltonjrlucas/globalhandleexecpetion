using System;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class ProcedimentoBusiness : BaseBusiness<ProcedimentoEntity, IProcedimentoRepository>, IProcedimentoBusiness, IDisposable
    {
        public ProcedimentoBusiness(VicSaudeSegurancaUnitOfWork uow, IProcedimentoRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
