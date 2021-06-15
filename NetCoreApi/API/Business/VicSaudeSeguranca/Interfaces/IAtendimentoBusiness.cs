using API.Model;
using System.Collections.Generic;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public interface IAtendimentoBusiness : IBaseBusiness<AgendamentoEntity>
    {
        List<RelacaoPessoalDTO> GetRelacaoPessoal(int cdFilial, 
                                                  int cdProcedimento, 
                                                  string cdUsuario);
    }
}
