using API.Business.BCU;
using API.Configurations;
using API.Model;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using VicFramework.Model.Api;

namespace API.Services
{
    public class ApiService
    {
        private readonly IConfiguration _configuration;

        public ApiService(IConfiguration Configuration)
        {
            _configuration = Configuration;
        }

        public Response RequestApi(string type, string metodo, string service, string body = "")
        {
            string URI = _configuration["URI_API_" + service] + metodo;
            HttpResponseMessage response = null;

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                switch (type)
                {
                    case "GET":
                        response = client.GetAsync(URI).Result;
                        break;
                    case "POST":
                        response = client.PostAsync(URI, new StringContent(body, Encoding.UTF8, "application/json")).Result;
                        break;
                    case "PUT":
                        response = client.PutAsync(URI, new StringContent(body, Encoding.UTF8, "application/json")).Result;
                        break;
                    case "DELETE":
                        response = client.DeleteAsync(URI).Result;
                        break;
                    default:
                        break;
                }
            }

            return new Response
            {
                success = response.IsSuccessStatusCode,
                statusCode = response.StatusCode,
                content = response.Content != null ? response.Content.ReadAsStringAsync().Result : ""
            };
        }

        public Authentication AuthenticateUserHCM(User usuario)
        {
            if (usuario.AccessKey.Equals(_configuration["CurriculumAccess"]))
            {
                return new Authentication
                {
                    AccessToken = "",
                    Login = new AutenticationHCM
                    {
                        Authenticated = true
                    }
                };
            }
            else
            {
                string user = JsonConvert.SerializeObject(new { usuario = usuario.UserID, senha = usuario.AccessKey });

                Response response = RequestApi("POST", "login-hcm/access-token", "AppServer", user);
                if (response.success)
                {
                    return JsonConvert.DeserializeObject<Authentication>(response.content, new ClaimConfiguration());
                }
                return new Authentication { Login = new AutenticationHCM { Message = "Usuário ou Senha inválidos." } };
            }
        }

        public Response ChangePassword(ChangePasswordModel model)
        {
            if (model != null)
            {
                return RequestApi("POST", "login-hcm/change-password", "AppServer", JsonConvert.SerializeObject(model));
            }

            return new Response
            {
                content = "",
                success = false,
                statusCode = System.Net.HttpStatusCode.NotFound
            };
        }
    }
}
