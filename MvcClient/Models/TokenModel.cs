using System.Collections.Generic;
using System.Security.Claims;

namespace VicPortalRH.Models
{
    public class TokenModel
    {
        public TokenModel()
        {
            Claims = new List<Claim>();
        }

        public bool Authenticated { get; set; }
        public string Created { get; set; }
        public string Expiration { get; set; }
        public string ApiSaudeSegurancaToken { get; set; }
        public string ApiAppServerToken { get; set; }
        public List<Claim> Claims { get; set; }
        public string Message { get; set; }
    }
}
