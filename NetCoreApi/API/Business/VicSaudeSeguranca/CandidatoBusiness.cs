using System;
using VicFramework.Business;
using VicFramework.Library;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class CandidatoBusiness : BaseBusiness<CandidatoEntity, ICandidatoRepository>, ICandidatoBusiness, IDisposable
    {
        public CandidatoBusiness(VicSaudeSegurancaUnitOfWork uow, ICandidatoRepository repository) : base(uow, repository) { }

        public string GenerateAccessCode(int cdCandidato)
        {
            CandidatoEntity candidato = GetSingleBy(x => x.cdCandidato == cdCandidato);
            if (candidato != null)
            {
                string ticks = DateTime.Now.Ticks.ToString();
                string codigoAcesso = ticks.Substring(ticks.Length - 7, 6);
                candidato.dsCodigoAcesso = Criptografia.Criptografar(codigoAcesso);

                _repository.Update(candidato);
                if (_uow.Commit() > 0)
                {
                    return codigoAcesso;
                }
            }

            return null;
        }

        public CandidatoEntity ValidateAccessCode(int cdCandidato, string codigoAcesso)
        {
            CandidatoEntity candidato = GetSingleBy(x => x.cdCandidato == cdCandidato);
            if (candidato != null)
            {
                bool validated = Criptografia.Descriptografar(candidato.dsCodigoAcesso).Equals(codigoAcesso);
                if (validated)
                {
                    candidato.dsCodigoAcesso = null;
                    _repository.Update(candidato);

                    if(_uow.Commit() > 0)
                    {
                        return candidato;
                    }
                }
            }

            return null;
        }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }
    }
}
