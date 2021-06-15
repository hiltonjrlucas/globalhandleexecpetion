using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using VicFramework.Model.Api;
using VicPortalRH.Models;
using VicPortalRH.Services;

namespace VicPortalRH.Controllers
{
    public class ContaController : BaseController
    {
        private readonly IConfiguration _configuration;

        public ContaController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            return View();
        }

        public JsonResult RequestQuestions(string cdUsuario)
        {
            if (!string.IsNullOrEmpty(cdUsuario))
            {
                TokenModel token = ApiService.GetUserToken(cdUsuario);
                if (token.Authenticated)
                {
                    HttpContext.Session.SetString("Authenticated", token.Authenticated.ToString());
                    HttpContext.Session.SetString("SaudeSegurancaToken", (token.ApiSaudeSegurancaToken == null ? "" : token.ApiSaudeSegurancaToken));

                    RequestModel request = new RequestModel
                    {
                        type = "GET",
                        service = "SaudeSeguranca",
                        url = "/questionario/build-questions/" + cdUsuario,
                        body = ""
                    };

                    var response = ApiService.RequestApi(request, token.ApiSaudeSegurancaToken);
                    if (response.success)
                    {
                        return Json(StaticService.VerificaResponse(response));
                    }
                }

                return Json(StaticService.VerificaResponse(new Response {
                    success = false,
                    statusCode = HttpStatusCode.BadRequest,
                    content = ""
                }));
            }

            return Json(StaticService.VerificaResponse(new Response
            {
                success = false,
                statusCode = HttpStatusCode.BadRequest,
                content = ""
            }));
        }

        [HttpPost]
        public JsonResult ValidateQuestions(RequestModel request)
        {
            if (request != null)
            {
                RequestModel requestToAPI = new RequestModel
                {
                    type = "POST",
                    service = "SaudeSeguranca",
                    url = "/questionario/send-code",
                    body = request.body
                };

                string accessToken = HttpContext.Session.GetString("SaudeSegurancaToken");
                var response = ApiService.RequestApi(requestToAPI, accessToken);

                if (response.success)
                {
                    return Json(StaticService.VerificaResponse(response));
                }

                HttpContext.Session.SetString("SaudeSegurancaToken", "");
            }

            return Json(StaticService.JsonError(""));
        }
    }
}