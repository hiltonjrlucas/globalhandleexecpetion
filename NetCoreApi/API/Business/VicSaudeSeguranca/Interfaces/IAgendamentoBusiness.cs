using System.Collections.Generic;
using System.IO;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public interface IAgendamentoBusiness : IBaseBusiness<AgendamentoEntity>
    {
        IEnumerable<dynamic> GetAgendamentoCadastros();
        IEnumerable<dynamic> GetAgendamentoAtendimento(int cdFilial, int cdProcedimento);
        IEnumerable<dynamic> GetConsultaAtendimento();        
        int InsertExcel(MemoryStream file);
    }
}
