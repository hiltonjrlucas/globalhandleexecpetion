using VicFramework.Model.Shared;
using VicFramework.Model.Shared.Enums;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Model
{
    public class ValidacaoCandidato
    {
        public CandidatoEntity candidato { get; set; }
        public MessageType origin { get; set; }
    }
}
