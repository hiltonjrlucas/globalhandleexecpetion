using System;

namespace API.Model
{
    public class RelacaoPessoalDTO
    {
        public string cdMatricula { get; set; }
        public string dsNome { get; set; }
        public string cdCentroCusto { get; set; }
        public string dsSetor { get; set; }
        public string dsArea { get; set; }
        public string dsTurno { get; set; }
        public int cdGrupoFolga { get; set; }
        public DateTime? dtValidade { get; set; }
        public string dsProcedimento { get; set; }
        public DateTime? dtProgramacao { get; set; }
        public int cdSituacao { get; set; }
        public string dsSituacao { get; set; }
        public int idProgramacao { get; set; }
    }
}
