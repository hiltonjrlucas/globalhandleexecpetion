using API.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using VicFramework.Business;
using VicFramework.Model.BCU;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.BCU;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class AtendimentoBusiness : BaseBusiness<AgendamentoEntity, IAgendamentoRepository>, IAtendimentoBusiness, IDisposable
    {
        protected IUsuarioPermissaoRepository _usuarioPermissaoRepository;
        protected IProcedimentoRepository _procedimentoRepository;
        protected IProgramacaoRepository _programacaoRepository;
        protected ITurnoRepository _turnoRepository;
        protected IGestorRepository _gestorRepository;
        protected IVIC_FUNCIONARIORepository _VIC_FUNCIONARIORepository;

        public AtendimentoBusiness(VicSaudeSegurancaUnitOfWork uow,
                                   IAgendamentoRepository repository,
                                   IUsuarioPermissaoRepository usuarioPermissaoRepository,
                                   IProgramacaoRepository programacaoRepository,
                                   IProcedimentoRepository procedimentoRepository,
                                   ITurnoRepository turnoRepository,
                                   IGestorRepository gestorRepository,
                                   IVIC_FUNCIONARIORepository VIC_FUNCIONARIORepository) : base(uow, repository)
        {
            _usuarioPermissaoRepository = usuarioPermissaoRepository;
            _procedimentoRepository = procedimentoRepository;
            _programacaoRepository = programacaoRepository;
            _turnoRepository = turnoRepository;
            _gestorRepository = gestorRepository;
            _VIC_FUNCIONARIORepository = VIC_FUNCIONARIORepository;
        }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }

        public List<RelacaoPessoalDTO> GetRelacaoPessoal(int cdFilial, int cdProcedimento, string cdUsuario)
        {
            var lstRelacaoPessoal = new List<RelacaoPessoalDTO>();

            ProcedimentoEntity procedimento = _procedimentoRepository.GetSingleBy(g => g.cdFilial == cdFilial &&
                                                                                       g.cdProcedimento == cdProcedimento);

            int stProcedimento = procedimento != null ? procedimento.cdSituacao : 0;

            UsuarioPermissaoEntity usuarioPermissao = _usuarioPermissaoRepository.GetSingleBy(g => g.cdFilial == cdFilial &&
                                                                                                   g.cdUsuario == cdUsuario);

            RelacaoPessoalDTO pessoa = GetPessoa(cdUsuario);
            lstRelacaoPessoal.Add(pessoa);

            if (usuarioPermissao != null)
            {
                int grupoPermissão = usuarioPermissao.cdGrupo;
                var lstPessoalByPermissao = new List<RelacaoPessoalDTO>();
                var lstPessoalProgramacaoByFilial = new List<RelacaoPessoalDTO>();

                // Administrador ou Atendente
                if (grupoPermissão == 1 || grupoPermissão == 2)
                {
                    lstPessoalByPermissao = GetPessoasByPermissao(cdFilial);
                }

                if (grupoPermissão == 3)
                {
                    string lstCentroCusto;
                    List<string> lstCentroCustoGestor = _gestorRepository.Search(s => s.cdFilial == cdFilial && s.cdUsuario == cdUsuario)
                                                             .Select(s => s.cdCentroCusto)
                                                             .ToList();

                    if (lstCentroCustoGestor.Any())
                    {
                        lstCentroCusto = string.Join(",", lstCentroCustoGestor);
                    }
                    else
                    {
                        lstCentroCusto = pessoa.cdCentroCusto;
                    }
                    

                    lstPessoalByPermissao = GetPessoasByPermissao(cdFilial, lstCentroCusto);
                }

                if (stProcedimento > 0)
                {
                    lstPessoalProgramacaoByFilial = GetPessoasProgramacao(cdFilial, cdProcedimento, lstPessoalByPermissao);
                    return lstPessoalProgramacaoByFilial;
                }
                else
                {
                    return lstPessoalByPermissao;
                }

            }
            else
            {
                if (stProcedimento > 0)
                {
                    List<RelacaoPessoalDTO> lstPessoaProg = GetPessoaProgramacao(cdFilial, cdProcedimento, cdUsuario, pessoa);

                    if (lstPessoaProg.Any())
                    {
                        lstRelacaoPessoal.Clear();
                        lstRelacaoPessoal = lstPessoaProg;
                    }
                }
            }

            return lstRelacaoPessoal;
        }

        public RelacaoPessoalDTO GetPessoa(string cdUsuario)
        {
            var pessoa = new RelacaoPessoalDTO();

            VIC_FUNCIONARIOEntity funcionario = _VIC_FUNCIONARIORepository.GetSingleBy(g => g.ad_login == cdUsuario);

            if (funcionario != null)
            {
                TurnoEntity turno = _turnoRepository.GetSingleBy(g => g.cdFilial == funcionario.cdn_estab &&
                                                                  g.cdTurno == funcionario.cdn_turno_trab);

                string dsTurno = "";

                if (turno != null)
                {
                    dsTurno = turno.dsTurno;
                }

                pessoa.cdMatricula = funcionario.ad_login != null ? funcionario.ad_login :
                                     funcionario.cdn_empresa.ToString().PadLeft(2, '0') +
                                     funcionario.cdn_estab.ToString().PadLeft(2, '0') +
                                     funcionario.cdn_funcionario.ToString().PadLeft(5, '0'); ;
                pessoa.dsNome = funcionario.nom_pessoa_fisic;
                pessoa.cdCentroCusto = funcionario.cod_rh_ccusto;
                pessoa.dsSetor = funcionario.des_rh_ccusto;
                pessoa.dsArea = funcionario.des_area;
                pessoa.dsTurno = dsTurno;
                pessoa.cdGrupoFolga = Convert.ToInt32(funcionario.cdn_turma_trab);
            }

            return pessoa;
        }

        public List<RelacaoPessoalDTO> GetPessoaProgramacao(int cdFilial, int cdProcedimento, string cdUsuario, RelacaoPessoalDTO pessoa)
        {
            var lstRelacaoPessoal = new List<RelacaoPessoalDTO>();
            var lstProgramacaoAtendimento = _programacaoRepository.GetProgramacaoAtendimento(cdFilial, cdProcedimento, cdUsuario).ToList();

            if (lstProgramacaoAtendimento.Any())
            {
                foreach (var item in lstProgramacaoAtendimento)
                {
                    var tempPessoa = new RelacaoPessoalDTO();

                    tempPessoa.cdMatricula = pessoa.cdMatricula;
                    tempPessoa.dsNome = pessoa.dsNome;
                    tempPessoa.cdCentroCusto = pessoa.cdCentroCusto;
                    tempPessoa.dsSetor = pessoa.dsSetor;
                    tempPessoa.dsArea = pessoa.dsArea;
                    tempPessoa.dsTurno = pessoa.dsTurno;
                    tempPessoa.cdGrupoFolga = pessoa.cdGrupoFolga;
                    tempPessoa.dtValidade = item.dtValidade;
                    tempPessoa.dsProcedimento = item.dsProcedimento;
                    tempPessoa.dtProgramacao = item.dtAgendamento;
                    tempPessoa.cdSituacao = item.cdSituacao;
                    tempPessoa.dsSituacao = item.dsSituacao;
                    tempPessoa.idProgramacao = item.idProgramacao;

                    lstRelacaoPessoal.Add(tempPessoa);
                }
            }

            return lstRelacaoPessoal;
        }

        public List<RelacaoPessoalDTO> GetPessoasByPermissao(int cdFilial, string lstCentroCusto = "")
        {
            var lstPessoal = new List<RelacaoPessoalDTO>();
            var funcionarios = new List<VIC_FUNCIONARIOEntity>();

            if (lstCentroCusto == "")
            {
                funcionarios = _VIC_FUNCIONARIORepository.Search(g => g.cdn_estab == cdFilial &&
                                                                      g.dat_desligto_func == null).ToList();
            }
            else
            {
                funcionarios = _VIC_FUNCIONARIORepository.Search(g => g.cdn_estab == cdFilial &&
                                                                      lstCentroCusto.Contains(g.cod_rh_ccusto) &&
                                                                      g.dat_desligto_func == null).ToList();
            }

            List<TurnoEntity> lstTurnos = _turnoRepository.Search(g => g.cdFilial == cdFilial).ToList();
            string dsTurno = "";

            foreach (var item in funcionarios)
            {
                if (lstTurnos.Any())
                {
                    TurnoEntity turno = lstTurnos.Find(f => f.cdFilial == cdFilial && f.cdTurno == item.cdn_turno_trab);

                    dsTurno = turno != null ? turno.dsTurno : "";
                }

                var pessoa = new RelacaoPessoalDTO();
                pessoa.cdMatricula = item.ad_login != null ? item.ad_login :
                                     item.cdn_empresa.ToString().PadLeft(2, '0') +
                                     item.cdn_estab.ToString().PadLeft(2, '0') +
                                     item.cdn_funcionario.ToString().PadLeft(5, '0');
                pessoa.dsNome = item.nom_pessoa_fisic;
                pessoa.cdCentroCusto = item.cod_rh_ccusto;
                pessoa.dsSetor = item.des_rh_ccusto;
                pessoa.dsArea = item.des_area;
                pessoa.dsTurno = dsTurno;
                pessoa.cdGrupoFolga = Convert.ToInt32(item.cdn_turma_trab);
                lstPessoal.Add(pessoa);
            }
                    
            return lstPessoal;
        }

        public List<RelacaoPessoalDTO> GetPessoasProgramacao(int cdFilial, int cdProcedimento, List<RelacaoPessoalDTO> pessoas)
        {
            var lstRelacaoPessoal = new List<RelacaoPessoalDTO>();
            var lstProgramacaoAtendimento = _programacaoRepository.GetProgramacaoAtendimentoByFilial(cdFilial, cdProcedimento).ToList();

            foreach (var item in pessoas)
            {               
                if (lstProgramacaoAtendimento.Any())
                {
                    var lstProgPessoa = lstProgramacaoAtendimento.FindAll(f => f.cdMatricula == item.cdMatricula);

                    if (lstProgPessoa.Any())
                    {
                        foreach (var prog in lstProgPessoa)
                        {
                            var tempPessoa = new RelacaoPessoalDTO();

                            tempPessoa.cdMatricula = item.cdMatricula;
                            tempPessoa.dsNome = item.dsNome;
                            tempPessoa.cdCentroCusto = item.cdCentroCusto;
                            tempPessoa.dsSetor = item.dsSetor;
                            tempPessoa.dsArea = item.dsArea;
                            tempPessoa.dsTurno = item.dsTurno;
                            tempPessoa.cdGrupoFolga = item.cdGrupoFolga;
                            tempPessoa.dtValidade = prog.dtValidade;
                            tempPessoa.dsProcedimento = prog.dsProcedimento;
                            tempPessoa.dtProgramacao = prog.dtAgendamento;
                            tempPessoa.cdSituacao = prog.cdSituacao;
                            tempPessoa.dsSituacao = prog.dsSituacao;
                            tempPessoa.idProgramacao = prog.idProgramacao;

                            lstRelacaoPessoal.Add(tempPessoa);
                        }
                    }                    
                }
            }                       

            return lstRelacaoPessoal;
        }

    }

}
