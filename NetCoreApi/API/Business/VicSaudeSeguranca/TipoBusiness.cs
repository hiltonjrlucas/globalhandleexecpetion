using System;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class TipoBusiness : BaseBusiness<TipoEntity, ITipoRepository>, ITipoBusiness, IDisposable
    {
        public TipoBusiness(VicSaudeSegurancaUnitOfWork uow, ITipoRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
