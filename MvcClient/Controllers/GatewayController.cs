using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using VicPortalRH.Models;
using VicPortalRH.Models.Dto;
using VicPortalRH.Services;

namespace VicPortalRH.Controllers
{
    public class GatewayController : Controller
    {
        private IConfiguration _configuration { get; }

        public GatewayController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public JsonResult RequestApi(RequestModel request)
        {
            string accessToken = "";
            switch (request.service)
            {
                case "AppServer":
                    accessToken = HttpContext.Session.GetString("AppServerApiToken");

                    if (!string.IsNullOrEmpty(request.body) && request.body.Contains("pasUsuario"))
                    {
                        request.body = request.body.Replace("_key", HttpContext.Session.GetString("UserPass"));
                    }

                    break;
                case "SaudeSeguranca":
                    accessToken = HttpContext.Session.GetString("SaudeSegurancaToken");
                    break;

                default:
                    break;
            }
            if (!string.IsNullOrEmpty(accessToken))
            {
                var response = ApiService.RequestApi(request, accessToken);
                return Json(StaticService.VerificaResponse(response));
            }
            else
            {
                return Json(StaticService.JsonError("TokenInvalido"));
            }

        }

        [HttpPost]
        public JsonResult DownloadFile(RequestModel request)
        {
            var response = RequestApi(request).Value as ResultModel;
            var download = JsonConvert.DeserializeObject<DownloadModel>(response.data.ToString());


            FileResult result = null;
            switch (download.classKey)
            {
                case "demonstrativo-pagamento":
                    var data = JsonConvert.DeserializeObject<List<DemonstrativoPagamentoDto>>(download.data.ToString());
                    if (download.type.Equals("pdf"))
                    {
                        var demonstrativos = new List<string>();
                        data.ForEach(item =>
                        {
                            var text = System.IO.File.ReadAllText("./wwwroot/Reports/demonstrativo-pagamento-item.html").ToString()
                            .Replace("{spanReferenciaPdf}", item.folhaPagamento.datPagamento.ToString("MMMM/yyyy"))
                            .Replace("{spanFuncionarioPdf}", item.folhaPagamento.nomeFuncionario)
                            .Replace("{spanFuncaoPdf}", item.folhaPagamento.funcaoFuncionario)
                            .Replace("{spanSalarioBasePdf}", item.folhaPagamento.valSalario.ToString("N2"))
                            .Replace("{spanProventosPdf}", item.folhaPagamento.valProventos.ToString("N2"))
                            .Replace("{spanDescontosPdf}", item.folhaPagamento.valDescontos.ToString("N2"))
                            .Replace("{spanFgtsPdf}", item.folhaPagamento.valFGTS.ToString("N2"))
                            .Replace("{spanSalarioLiquidoPdf}", item.folhaPagamento.valLiquido.ToString("N2"));

                            var rows = new List<string>();
                            item.eventos.ToList().ForEach(evento =>
                            {
                                var cells =
                                $"<td>{evento.codEvento}</td>" +
                                $"<td>{evento.desEvento}</td>" +
                                $"<td class=\"center\">{evento.idiTipoEvt}</td>" +
                                $"<td class=\"right\">{evento.qtdUnidadeEvt.ToString("N3")}</td>" +
                                $"<td class=\"right\">{evento.valEvt.ToString("N2")}</td>";

                                rows.Add(string.Format("<tr>{0}</tr>", cells));
                            });

                            text = text.Replace("{tbody}", string.Join("", rows.ToArray()));

                            demonstrativos.Add(text);
                        });

                        var report = System.IO.File.ReadAllText("./wwwroot/Reports/demonstrativo-pagamento.html").ToString()
                            .Replace("{items}", string.Join("", demonstrativos.ToArray()))
                            .Replace("{uri}", _configuration["URI_Application"]);

                        result = PdfService.CreatePdf(report, $"demonstrativo-pagamento-{DateTime.Now.Ticks}.pdf");
                    }

                    if (download.type.Equals("excel"))
                    {
                        var excelService = new ExcelService<EventoFolhaPagamentoDto>();
                        data.ForEach(item =>
                        {
                            var referencia = new DateTime(item.folhaPagamento.numAnoRefer, item.folhaPagamento.numMesRefer, 1).ToString("MMMM-yyyy");
                            var title = $"{referencia} - {item.folhaPagamento.descricaoTipoFolha}";

                            excelService.AddWorkSheet(title, referencia, item.eventos.ToList());
                        });

                        result = File(excelService.Build(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"{download.fileName}.xlsx");
                    }
                    break;
                default:
                    if (response.success)
                    {
                        return Json(StaticService.JsonSuccess(response.data));
                    }
                    else
                    {
                        return Json(StaticService.JsonError(response.data.ToString()));
                    }
            }

            return Json(StaticService.JsonSuccess(result));

        }        
    }
}