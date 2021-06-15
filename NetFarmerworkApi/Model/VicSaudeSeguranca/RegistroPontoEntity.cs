using System;

namespace Model.VicSaudeSeguranca
{
    public class RegistroPontoEntity
    {
        public int idRegistroPonto { get; set; }
        public string cdUsuario { get; set; }
        public int cdTipoRegistro { get; set; }
        public DateTime dtRegistro { get; set; }
        public bool stIntegracao { get; set; }
        public DateTime? dtIntegracao { get; set; }
    }
}
