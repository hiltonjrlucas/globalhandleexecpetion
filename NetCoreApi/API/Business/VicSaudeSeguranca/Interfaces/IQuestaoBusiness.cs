using API.Model;
using System.Collections.Generic;
using VicFramework.Business;
using VicFramework.Model.BCU;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public interface IQuestaoBusiness : IBaseBusiness<QuestaoEntity>
    {
        List<QuestaoEntity> BuildQuestions(string cdUsuario);
        bool ValidateAnswer(QuestionarioViewModel model);
        bool SendCode(QuestionarioViewModel model, EmailConfigurations emailConfigurations);
    }
}
