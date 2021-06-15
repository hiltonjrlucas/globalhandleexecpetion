namespace Model.ViewModels.AppServerHCM
{
    public class DemonstrativoPagamentoViewModel
    {
        public string codUsuario { get; set; }
        public string pasUsuario { get; set; }
        public int mesRef { get; set; }
        public int anoRef { get; set; }

        //[1: Normal; 2: Adiantamento; 3: 13º Normal; 4: Adiantamento 13º]
        public int idTipoFolha { get; set; }
        public int parcela { get; set; }
    }
}
