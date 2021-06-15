using System.Collections.Generic;
using System.Security.Claims;

namespace API.Model
{
    public class AutenticationHCM
    {
        public AutenticationHCM()
        {
            Claims = new List<Claim>();
        }

        public bool Authenticated { get; set; }
        public string AuthenticatedMessage { get; set; }
        public string RegistroPontoMessage { get; set; }
        public List<Claim> Claims { get; set; }
        public string Message { get; set; }
    }
}
