namespace API.Model
{
    public class ChangePasswordModel
    {
        public string cdUsuario { get; set; }
        public string stSenha { get; set; }
        public string stSenhaNova { get; set; }
        public string stConfirmSenha { get; set; }
        public int numDiasValidos { get; set; }
    }
}
