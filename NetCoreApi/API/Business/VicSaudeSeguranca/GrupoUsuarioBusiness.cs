using System;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class GrupoUsuarioBusiness : BaseBusiness<GrupoUsuarioEntity, IGrupoUsuarioRepository>, IGrupoUsuarioBusiness, IDisposable
    {
        public GrupoUsuarioBusiness(VicSaudeSegurancaUnitOfWork uow, IGrupoUsuarioRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
