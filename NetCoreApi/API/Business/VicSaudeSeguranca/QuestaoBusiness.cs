using API.Business.BCU;
using API.Business.PortalRH.Interfaces;
using API.Model;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using VicFramework.Business;
using VicFramework.Model.BCU;
using VicFramework.Model.Shared;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Model.VicSaudeSeguranca.Enum;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class QuestaoBusiness : BaseBusiness<QuestaoEntity, IQuestaoRepository>, IQuestaoBusiness, IDisposable
    {

        private ILoginBusiness _loginBusiness;
        private IVIC_FUNCIONARIOBusiness _VIC_FUNCIONARIOBusiness;

        public QuestaoBusiness(VicSaudeSegurancaUnitOfWork uow,
                                IQuestaoRepository repository,
                                ILoginBusiness loginBusiness,
                                IVIC_FUNCIONARIOBusiness VIC_FUNCIONARIOBusiness) : base(uow, repository)
        {
            _loginBusiness = loginBusiness;
            _VIC_FUNCIONARIOBusiness = VIC_FUNCIONARIOBusiness;
        }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }

        private string GetOptionValue(VIC_FUNCIONARIOEntity funcionario, string dsResposta, string format = "")
        {
            PropertyInfo prop = funcionario.GetType().GetProperties()
                .Where(x => x.Name.Contains(dsResposta))
                .FirstOrDefault();

            string response = prop != null ? prop.GetValue(funcionario).ToString() : "";
            if (!string.IsNullOrEmpty(format) && new string[] { "yyyy", "MM", "dd", "dd/MM/yyyy", "MMMM" }.Contains(format))
            {
                response = ((DateTime)prop.GetValue(funcionario)).ToString(format, new CultureInfo("pt-BR"));

                response = response.Substring(0, 1).ToUpper() + response.Substring(1, response.Length - 1);
            }

            return new CultureInfo("pt-Br", false).TextInfo.ToTitleCase(response.ToLower());
        }

        private QuestaoEntity NextQuestion(VIC_FUNCIONARIOEntity funcionario, int[] questoesAnteriores)
        {

            List<QuestaoEntity> questions = GetAll(x => x.Opcoes)
            .Where(w => !questoesAnteriores.Contains(w.cdQuestao))
            .OrderByDescending(x => x.cdQuestao).ToList();

            var cdQuestao = new Random().Next(1, questions.FirstOrDefault().cdQuestao);

            QuestaoEntity question = questions.Where(w => w.cdQuestao == cdQuestao).FirstOrDefault();

            if (question == null || questoesAnteriores.Contains(cdQuestao))
            {
                return NextQuestion(funcionario, questoesAnteriores);
            }

            string dataResposta = GetOptionValue(funcionario, question.dsResposta, question.dsFormato);
            if (!string.IsNullOrEmpty(dataResposta))
            {
                dataResposta = new CultureInfo("pt-BR", false).TextInfo.ToTitleCase(dataResposta.ToLower());
            }
            question = MixOpcoesAndGetFive(question, dataResposta);
            var idx = new Random().Next(0, 4);
            var idxRespostaNaLista = question.Opcoes.ToList().FindIndex(w => w.dsOpcao == dataResposta);

            if (idxRespostaNaLista >= 0)
            {
                question.Opcoes.ToList()[idxRespostaNaLista].dsOpcao = "Nenhuma das opções";
            }
            else
            {
                question.Opcoes.ToList()[idx].dsOpcao = dataResposta;
            }

            question.dsResposta = "";

            return question;

        }

        public bool ValidateAnswer(QuestionarioViewModel model)
        {
            if (model.respostas.Count != 5)
            {
                return false;
            }
            if (model.respostas.Select(s => s.cdQuestao).Distinct().Count() != 5)
            {
                return false;
            }

            VIC_FUNCIONARIOEntity funcionario = _VIC_FUNCIONARIOBusiness.GetSingleBy(x => x.lg_automatico.Equals(model.cdUsuario));
            if (funcionario == null)
            {
                return false;
            }

            List<QuestaoEntity> questions = GetAll(x => x.Opcoes)
                .Where(x => model.respostas.Select(s => s.cdQuestao)
                    .ToList()
                    .Contains(x.cdQuestao))
                .ToList();

            var errors = 0;

            foreach (var question in questions)
            {
                string expectedAnswer = GetOptionValue(funcionario, question.dsResposta, question.dsFormato);
                string currentAnswer =
                    model.respostas.Find(c => c.cdQuestao == question.cdQuestao).dsResposta.Equals("Nenhuma das opções")
                        ? expectedAnswer
                        : model.respostas.Find(c => c.cdQuestao == question.cdQuestao).dsResposta;
                errors = expectedAnswer != currentAnswer ? (errors + 1) : errors;
            }

            return errors == 0;
        }

        private QuestaoEntity MixOpcoesAndGetFive(QuestaoEntity questao, string resposta)
        {
            Random rng = new Random();
            List<OpcaoEntity> lista = questao.Opcoes.ToList();

            int n = lista.Count;
            while (n > 1)
            {
                n--;
                int k = rng.Next(n + 1);
                OpcaoEntity value = lista[k];
                lista[k] = lista[n];
                lista[n] = value;
            }

            questao.Opcoes = lista.Take(5).ToList();
            return questao;
        }

        public List<QuestaoEntity> BuildQuestions(string cdUsuario)
        {
            VIC_FUNCIONARIOEntity funcionario = _VIC_FUNCIONARIOBusiness.GetSingleBy(x => x.lg_automatico.Equals(cdUsuario));
            if (funcionario != null)
            {
                List<QuestaoEntity> lstQuestoes = new List<QuestaoEntity>();
                for (int i = 0; i < 5; i++)
                {
                    lstQuestoes.Add(NextQuestion(funcionario, lstQuestoes.Select(s => s.cdQuestao).ToArray()));
                }

                return lstQuestoes;
            }

            return null;
        }

        public bool SendCode(QuestionarioViewModel model, EmailConfigurations emailConfigurations)
        {
            bool validateQuestions = ValidateAnswer(model);
            if (validateQuestions)
            {
                _loginBusiness.SendAccessCode(model.cdUsuario, model.dsCelular, model.dsEmail, emailConfigurations);
            }
            else
            {
                _loginBusiness.ValidationFailed(model.cdUsuario);
            }

            return validateQuestions;


        }
    }
}
