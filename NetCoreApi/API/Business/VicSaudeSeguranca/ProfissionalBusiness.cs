using System;
using System.Collections.Generic;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class ProfissionalBusiness : BaseBusiness<ProfissionalEntity, IProfissionalRepository>, IProfissionalBusiness, IDisposable
    {
        public ProfissionalBusiness(VicSaudeSegurancaUnitOfWork uow, IProfissionalRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }

        public IEnumerable<dynamic> GetProfissionalProcedimentos(int cdFilial, string cdProfissional)
        {
            return _repository.GetProfissionalProcedimentos(cdFilial, cdProfissional);
        }
    }
}
