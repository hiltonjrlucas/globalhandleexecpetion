using System;

namespace Model.Dto.AppServerHCM
{
    public class ResumoPagamentoDto
    {
        public string codUsuario { get; set; }
        public int numMesRefer { get; set; }
        public int numAnoRefer { get; set; }
        public int idiTipoFolha { get; set; }
        public int numParcelaFolha { get; set; }
        public DateTime datPagamento { get; set; }
        public decimal valLiquido { get; set; }
    }
}
