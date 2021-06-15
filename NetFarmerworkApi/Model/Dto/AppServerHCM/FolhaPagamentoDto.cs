using System;

namespace Model.Dto.AppServerHCM
{
    public class FolhaPagamentoDto
    {
        public string codUsuario { get; set; }
        public string nomeFuncionario { get; set; }
        public string funcaoFuncionario { get; set; }
        public int numMesRefer { get; set; }
        public int numAnoRefer { get; set; }
        public int idiTipoFolha { get; set; }
        public int numParcelaFolha { get; set; }
        public DateTime datPagamento { get; set; }
        public decimal valLiquido { get; set; }
        public decimal valProventos { get; set; }
        public decimal valDescontos { get; set; }
        public decimal valSalario { get; set; }
        public decimal valSalarioINSS { get; set; }
        public decimal valBaseFGTS { get; set; }
        public decimal valFGTS { get; set; }
        public decimal valBaseIRF { get; set; }
        public int qtiEvento { get; set; }
    }
}
