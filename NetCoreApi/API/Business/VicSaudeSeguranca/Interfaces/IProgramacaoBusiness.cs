using System.IO;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public interface IProgramacaoBusiness : IBaseBusiness<ProgramacaoEntity>
    {
        int InsertExcel(MemoryStream file);
    }
}
