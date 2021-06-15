using System.Collections.Generic;
using System.Security.Claims;

namespace Model.Dto.AppServerHCM
{
    public class LoginHcmDto
    {
        public LoginHcmDto()
        {
            Claims = new List<Claim>();            
        }

        public bool Authenticated { get; set; }
        public string AuthenticatedMessage { get; set; }
        public string RegistroPontoMessage { get; set; }
        public List<Claim> Claims { get; set; }
    }
}
