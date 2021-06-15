using System;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class OpcaoBusiness : BaseBusiness<OpcaoEntity, IOpcaoRepository>, IOpcaoBusiness, IDisposable
    {
        public OpcaoBusiness(VicSaudeSegurancaUnitOfWork uow, IOpcaoRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
