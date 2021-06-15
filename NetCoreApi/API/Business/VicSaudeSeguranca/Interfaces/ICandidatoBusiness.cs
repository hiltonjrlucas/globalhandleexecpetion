using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public interface ICandidatoBusiness : IBaseBusiness<CandidatoEntity>
    {
        string GenerateAccessCode(int cdCandidato);
        CandidatoEntity ValidateAccessCode(int cdCandidato, string codigoAcesso);
    }
}
