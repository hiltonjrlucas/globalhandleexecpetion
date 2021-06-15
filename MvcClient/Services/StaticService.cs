using Newtonsoft.Json;
using System.Net;
using VicFramework.Model.Api;
using VicPortalRH.Models;

namespace VicPortalRH.Services
{
    public static class StaticService
    {
        public static ResultModel JsonSuccess(object dataResult)
        {
            ResultModel resultado = new ResultModel()
            {
                success = true,
                data = dataResult
            };

            return resultado;
        }

        public static ResultModel JsonError(object messageResult, object http500messageResult = null)
        {
            ResultModel resultado = new ResultModel()
            {
                success = false,
                data = null,
                message = messageResult,
                http500Message = http500messageResult
            };

            return resultado;
        }

        public static ResultModel VerificaResponse(Response response)
        {
            return response.success
                    ? JsonSuccess(JsonConvert.DeserializeObject(response.content))
                    : ResponseNotSuccess(response);
        }

        public static ResultModel ResponseNotSuccess(Response response)
        {
            switch (response.statusCode)
            {
                case HttpStatusCode.InternalServerError: return JsonError(null, JsonConvert.DeserializeObject(response.content));
                case HttpStatusCode.Unauthorized: return JsonError("TokenInvalido");
                default:  return JsonError(JsonConvert.DeserializeObject(response.content)); 
            }
        }
    }
}
