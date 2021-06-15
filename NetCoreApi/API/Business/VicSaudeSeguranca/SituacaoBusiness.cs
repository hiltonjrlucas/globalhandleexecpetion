using System;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class SituacaoBusiness : BaseBusiness<SituacaoEntity, ISituacaoRepository>, ISituacaoBusiness, IDisposable
    {
        public SituacaoBusiness(VicSaudeSegurancaUnitOfWork uow, ISituacaoRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
