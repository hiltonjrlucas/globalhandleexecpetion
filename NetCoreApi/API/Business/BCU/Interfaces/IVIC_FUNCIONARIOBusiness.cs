using System.Collections.Generic;
using VicFramework.Business;
using VicFramework.Model.BCU;

namespace API.Business.BCU
{
    public interface IVIC_FUNCIONARIOBusiness : IBaseBusiness<VIC_FUNCIONARIOEntity>
    {
        IEnumerable<VIC_FUNCIONARIOEntity> GetFuncionariosByFilter(string empresa, string estabelecimento, string matricula, string nome, string area);
    }
}
