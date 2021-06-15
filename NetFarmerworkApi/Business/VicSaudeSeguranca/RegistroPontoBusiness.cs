using DAL.Dapper.VicSaudeSeguranca;
using Model.Entities.VicSaudeSeguranca;
using System.Collections.Generic;
using System.Data;

namespace Business.VicSaudeSeguranca
{
    public class RegistroPontoBusiness
    {
        RegistroPontoRepository registroPontoRepository;

        public RegistroPontoBusiness()
        {
            registroPontoRepository = new RegistroPontoRepository();
        }

        public IList<RegistroPontoEntity> GetBatidasPendentesIntegracao()
        {
            return registroPontoRepository.GetBatidasPendentesIntegracao();
        }

        public bool SetRetornoIntegracaoHCM(DataTable registrosRetorno)
        {
            return registroPontoRepository.SetRetornoIntegracaoHCM(registrosRetorno);
        }
    }
       
}
