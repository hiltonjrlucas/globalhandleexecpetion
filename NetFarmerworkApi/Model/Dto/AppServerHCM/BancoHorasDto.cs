using System;

namespace Model.Dto.AppServerHCM
{
    public class BancoHorasDto
    {
        public string codUsuario { get; set; }
        public int numMesRefer { get; set; }
        public int numAnoRefer { get; set; }
        public DateTime dtIniPeriod { get; set; }
        public DateTime dtFimPeriod { get; set; }
        public decimal qtdHrsPosit { get; set; }
        public decimal qtdHrsNegat { get; set; }
        public string tempoPositivo { get; set; }
        public string tempoNegativo { get; set; }
        public string tempoNoMes { get; set; }
    }
}
