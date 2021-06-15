using Model.Dto.AppServerHCM;
using System.Collections.Generic;

namespace Model.AppServerHCM
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
