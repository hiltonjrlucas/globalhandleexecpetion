using System.Collections.Generic;

namespace Model.ViewModels.AppServerHCM
{
    public class ExportDemonstrativoViewModel
    {
        public ExportDemonstrativoViewModel()
        {
            demonstrativos = new List<DemonstrativoPagamentoViewModel>();
        }
        public string exportType { get; set; }
        public string codUsuario { get; set; }
        public string pasUsuario { get; set; }
        public string nomeUsuario { get; set; }
        public string cargoUsuario { get; set; }
        public List<DemonstrativoPagamentoViewModel> demonstrativos { get; set; }
    }
}
