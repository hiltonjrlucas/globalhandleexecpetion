using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System;

namespace API.GlobalExceptionHandling
{
    public class GlobalExceptionHandlingFilter : IExceptionFilter
    {
        private readonly ILoggerFactory _loggerFactory;
        private readonly IHostingEnvironment _env;

        public GlobalExceptionHandlingFilter(IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            _env = env;
            _loggerFactory = loggerFactory;
        }

        public void OnException(ExceptionContext context)
        {

            if (context != null && context.Exception != null)
            {
                var logger = _loggerFactory.CreateLogger("GlobalExceptionHandler");
                try
                {
                    if (!_env.IsDevelopment())
                    {
                        //salvar em DB
                        logger.LogError($"Exception details PROD: {context.Exception} \n\n");
                    }
                    else
                    {
                        logger.LogError($"Exception details DEV: {context.Exception} \n\n");
                    }
                }
                catch (Exception erro)
                {
                    logger.LogError($"Write Log in DB error: {erro} \n\n");
                    logger.LogError($"Original error: {context.Exception} \n\n");
                }
                finally
                {
                    var obj = new ObjectResult(null);
                    obj.StatusCode = StatusCodes.Status500InternalServerError;
                    obj.Value = "Error in request...";
                    context.HttpContext.Response.ContentType = "application/json";
                    context.ExceptionHandled = true;
                    context.Result = obj;
                }
            }
        }
    }
}
