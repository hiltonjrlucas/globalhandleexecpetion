using System;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca 
{
    public class TurnoBusiness : BaseBusiness<TurnoEntity, ITurnoRepository>, ITurnoBusiness, IDisposable
    {
        public TurnoBusiness(VicSaudeSegurancaUnitOfWork uow, ITurnoRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
