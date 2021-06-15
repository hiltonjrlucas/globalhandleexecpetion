using System.Collections.Generic;

namespace API.Model
{
    public class QuestionarioViewModel
    {
        public string cdUsuario { get; set; }
        public string dsCelular { get; set; }
        public string dsEmail { get; set; }
        public int cdQuestao { get; set; }
        public string dsResposta { get; set; }
        public List<RespostaViewModel> respostas { get; set; }
    }
}
