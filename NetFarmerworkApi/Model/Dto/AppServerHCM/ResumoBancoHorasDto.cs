using System.Collections.Generic;

namespace Model.Dto.AppServerHCM
{
    public class ResumoBancoHorasDto
    {
        public bool authenticated { get; set; }
        public string error { get; set; }
        public string saldoAnoAnterior { get; set; }
        public string saldoAtual { get; set; }

        public IEnumerable<BancoHorasDto> resumos { get; set; }
    }
}
