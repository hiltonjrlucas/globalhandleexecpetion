using API.Business.BCU;
using API.Business.PortalRH;
using API.Business.PortalRH.Interfaces;
using API.Business.VicSaudeSeguranca;
using Microsoft.Extensions.DependencyInjection;
using VicFramework.Library;
using VicFramework.Model.Shared;
using VicFramework.Model.Shared.Entities;
using VicFramework.Repository.BCU;
using VicFramework.Repository.PortalRH;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API
{
    public class NativeInjector
    {
        public static void RegisterServices(IServiceCollection services)
        {
            //BCU   
            services.AddScoped<BCUUnitOfWork>();
            services.AddScoped<IVIC_FUNCIONARIOBusiness, VIC_FUNCIONARIOBusiness>();
            services.AddScoped<IVIC_FUNCIONARIORepository, VIC_FUNCIONARIORepository>();

            #region VicSaudeSeguranca
            services.AddScoped<VicSaudeSegurancaUnitOfWork>();

            #region Repository
            services.AddScoped<IAgendamentoRepository, AgendamentoRepository>();
            services.AddScoped<IAreaRepository, AreaRepository>();
            services.AddScoped<ICentroCustoRepository, CentroCustoRepository>();
            services.AddScoped<IFilialRepository, FilialRepository>();
            services.AddScoped<IGestorRepository, GestorRepository>();
            services.AddScoped<IGrupoUsuarioRepository, GrupoUsuarioRepository>();
            services.AddScoped<ILocalRepository, LocalRepository>();
            services.AddScoped<IProcedimentoRepository, ProcedimentoRepository>();
            services.AddScoped<IProfissionalRepository, ProfissionalRepository>();
            services.AddScoped<IProgramacaoRepository, ProgramacaoRepository>();
            services.AddScoped<ISituacaoRepository, SituacaoRepository>();
            services.AddScoped<ITipoRepository, TipoRepository>();
            services.AddScoped<ITurnoRepository, TurnoRepository>();
            services.AddScoped<IUsuarioPermissaoRepository, UsuarioPermissaoRepository>();
            services.AddScoped<IRegistroPontoRepository, RegistroPontoRepository>();
            services.AddScoped<ICandidatoRepository, CandidatoRepository>();
            services.AddScoped<IFilhoCandidatoRepository, FilhoCandidatoRepository>();
            services.AddScoped<ICursoCandidatoRepository, CursoCandidatoRepository>();
            services.AddScoped<IExperienciaCandidatoRepository, ExperienciaCandidatoRepository>();
            services.AddScoped<ICargoRepository, CargoRepository>();
            services.AddScoped<IQuestaoRepository, QuestaoRepository>();
            services.AddScoped<IOpcaoRepository, OpcaoRepository>();
            services.AddScoped<ILoginRepository, LoginRepository>();
            #endregion

            #region Business
            services.AddScoped<IAgendamentoBusiness, AgendamentoBusiness>();
            services.AddScoped<IAtendimentoBusiness, AtendimentoBusiness>();
            services.AddScoped<IAreaBusiness, AreaBusiness>();
            services.AddScoped<ICentroCustoBusiness, CentroCustoBusiness>();
            services.AddScoped<IFilialBusiness, FilialBusiness>();
            services.AddScoped<IGestorBusiness, GestorBusiness>();
            services.AddScoped<IGrupoUsuarioBusiness, GrupoUsuarioBusiness>();
            services.AddScoped<ILocalBusiness, LocalBusiness>();
            services.AddScoped<IProcedimentoBusiness, ProcedimentoBusiness>();
            services.AddScoped<IProfissionalBusiness, ProfissionalBusiness>();
            services.AddScoped<IProgramacaoBusiness, ProgramacaoBusiness>();
            services.AddScoped<ISituacaoBusiness, SituacaoBusiness>();
            services.AddScoped<ITipoBusiness, TipoBusiness>();
            services.AddScoped<ITurnoBusiness, TurnoBusiness>();
            services.AddScoped<IUsuarioPermissaoBusiness, UsuarioPermissaoBusiness>();
            services.AddScoped<IRegistroPontoBusiness, RegistroPontoBusiness>();
            services.AddScoped<IRegistroPontoRepository, RegistroPontoRepository>();
            services.AddScoped<IQuestaoBusiness, QuestaoBusiness>();
            services.AddScoped<IOpcaoBusiness, OpcaoBusiness>();
            services.AddScoped<ILoginBusiness, LoginBusiness>();

            // Filters - Exceptions
            services.AddScoped<GlobalExceptionHandlingFilter>();

            //Notificacoes
            services.AddScoped<INotificacao, Notificacao>();
            services.AddScoped<ICandidatoBusiness, CandidatoBusiness>();
            services.AddScoped<IFilhoCandidatoBusiness, FilhoCandidatoBusiness>();
            services.AddScoped<ICursoCandidatoBusiness, CursoCandidatoBusiness>();
            services.AddScoped<IExperienciaCandidatoBusiness, ExperienciaCandidatoBusiness>();
            services.AddScoped<ICargoBusiness, CargoBusiness>();
            #endregion

            #endregion
        }
    }
}

