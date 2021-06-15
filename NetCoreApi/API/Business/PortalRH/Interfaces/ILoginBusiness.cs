using API.Model;
using System.Collections.Generic;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Business.PortalRH.Interfaces
{
    public interface ILoginBusiness : IBaseBusiness<LoginEntity>
    {
        string GenerateAccessCode(string cdUsuario, string dsCelular);
        int ValidationFailed(string cdUsuario);
        bool ValidateAccessCode(string cdUsuario, string cdCodigoAcesso);
        string GenerateTempPassword();
        bool ChangeStatusUser(string cdUsuario, bool resetUser);
        bool NeedChange(string cdUsuario);
        bool UnlockUser(string cdUsuario);
        IEnumerable<LockedUserViewModel> LockedUsers();
        int ValidateUser(string cdUsuario);
        void SendAccessCode(string cdUsuario, string dsCelular, string dswEmail, EmailConfigurations emailConfigurations);
    }
}
