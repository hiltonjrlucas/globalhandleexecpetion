using System.Collections.Generic;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Business.PortalRH.Interfaces
{
    public interface IRegistroPontoBusiness : IBaseBusiness<RegistroPontoEntity>
    {
        IEnumerable<RegistroPontoEntity> GetRegistroPontosToday(string cdUsuario);
    }
}
