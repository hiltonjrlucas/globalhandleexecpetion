using System;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class UsuarioPermissaoBusiness : BaseBusiness<UsuarioPermissaoEntity, IUsuarioPermissaoRepository>, IUsuarioPermissaoBusiness, IDisposable
    {
        public UsuarioPermissaoBusiness(VicSaudeSegurancaUnitOfWork uow, IUsuarioPermissaoRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
