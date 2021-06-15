using System;
using System.Collections.Generic;

namespace VicPortalRH.Models.Dto
{
    public class DemonstrativoPagamentoDto
    {
        public bool authenticated { get; set; }
        public string error { get; set; }
        public string exportType { get; set; }

        public FolhaPagamentoDto folhaPagamento { get; set; }
        public IEnumerable<EventoFolhaPagamentoDto> eventos { get; set; }
    }
}
