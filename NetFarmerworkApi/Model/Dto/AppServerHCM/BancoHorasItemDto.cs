using System;

namespace Model.Dto.AppServerHCM
{
    public class BancoHorasItemDto
    {
        public string codUsuario { get; set; }
        public int numMesRefer { get; set; }
        public int numAnoRefer { get; set; }
        public DateTime dtIniPeriod { get; set; }
        public DateTime dtFimPeriod { get; set; }
        public DateTime dataLancto { get; set; }
        public int tipoLancto { get; set; }
        public string hraIniLancto { get; set; }
        public string hraFimLancto { get; set; }
        public string qtdHrsLancto { get; set; }
    }
}
