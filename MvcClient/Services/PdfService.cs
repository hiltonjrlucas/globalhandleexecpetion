using Microsoft.AspNetCore.Mvc;
using OpenHtmlToPdf;

namespace VicPortalRH.Services
{
    public class PdfService
    {   
        public static FileResult CreatePdf(string content, string fileName)
        {   
            var result = Pdf.From(content)
                .WithGlobalSetting("orientation", "Portrait")
                .WithObjectSetting("web.defaultEncoding", "utf-8")
                .OfSize(PaperSize.A4)
                .Content();

            FileResult report = new FileContentResult(result, "application/pdf");
            report.FileDownloadName = fileName;

            return report;
        }
    }
}