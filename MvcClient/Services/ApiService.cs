using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using VicFramework.Model.Api;
using VicPortalRH.Configurations;
using VicPortalRH.Models;

namespace VicPortalRH.Services
{       
    public class ApiService
    {
        private static IConfiguration _configuration;

        public ApiService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public static TokenModel GetToken(User user)
        {
            TokenModel tokenResult = new TokenModel();

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                string url = $"{ _configuration["URI_API_SaudeSeguranca"]}/login/access-token";
                HttpResponseMessage respToken = client
                    .PostAsync(url, new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json")).Result;

                string conteudo = respToken.Content.ReadAsStringAsync().Result;
                tokenResult = JsonConvert.DeserializeObject<TokenModel>(conteudo, new ClaimConfiguration());
            }

            return tokenResult;
        }

        public static Response RequestApi(RequestModel request, string accessToken)
        {
            string URI = _configuration["URI_API_" + request.service] + request.url;

            HttpResponseMessage response = null;

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();                
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                switch (request.type)
                {
                    case "GET":
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        response = client.GetAsync(URI).Result;
                        break;
                    case "POST":
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        response = client.PostAsync(URI, new StringContent(request.body, Encoding.UTF8, "application/json")).Result;
                        break;
                    case "PUT":
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        response = client.PutAsync(URI, new StringContent(request.body, Encoding.UTF8, "application/json")).Result;
                        break;
                    case "DELETE":
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        response = client.DeleteAsync(URI).Result;
                        break;
                    case "POSTBYTE":
                        string contentTypeValue = "application/octet-stream";
                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(contentTypeValue));                        

                        byte[] data = Convert.FromBase64String(request.body);
                        ByteArrayContent byteContent = new ByteArrayContent(data);
                        byteContent.Headers.Remove("Content-Type");
                        byteContent.Headers.Add("Content-Type", contentTypeValue);

                        response = client.PostAsync(URI, byteContent).Result;
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

        public static TokenModel GetUserToken(string matricula)
        {   
            TokenModel tokenResult = new TokenModel();

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                string url = $"{ _configuration["URI_API_SaudeSeguranca"]}/login/user-access-token/{matricula}";
                HttpResponseMessage respToken = client.PostAsync(url, null).Result;

                string conteudo = respToken.Content.ReadAsStringAsync().Result;
                tokenResult = JsonConvert.DeserializeObject<TokenModel>(conteudo);
            }

            return tokenResult;
        }
    }
}
