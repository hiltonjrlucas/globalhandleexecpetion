using System.Collections.Generic;
using System.Security.Claims;

namespace API.Model
{
    public class Authentication
    {   
        public string AccessToken { get; set; } = "";
        public AutenticationHCM Login { get; set; }
    }
}
