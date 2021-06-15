using System.Collections.Generic;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public interface IProfissionalBusiness : IBaseBusiness<ProfissionalEntity>
    {
        IEnumerable<dynamic> GetProfissionalProcedimentos(int cdFilial, string cdProfissional);
    }
}
