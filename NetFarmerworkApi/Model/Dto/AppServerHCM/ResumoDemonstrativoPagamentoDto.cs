using Model.Dto.AppServerHCM;
using System.Collections.Generic;

namespace Model.AppServerHCM
{
    public class ResumoDemonstrativoPagamentoDto
    {
        public bool authenticated { get; set; }
        public string error { get; set; }
        public IEnumerable<ResumoPagamentoDto> resumos { get; set; }
    }
}
