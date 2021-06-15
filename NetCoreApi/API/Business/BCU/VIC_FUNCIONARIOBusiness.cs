using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using VicFramework.Business;
using VicFramework.Model.BCU;
using VicFramework.Repository.BCU;

namespace API.Business.BCU
{
    public class VIC_FUNCIONARIOBusiness : BaseBusiness<VIC_FUNCIONARIOEntity, IVIC_FUNCIONARIORepository>, IVIC_FUNCIONARIOBusiness, IDisposable
    {
        public VIC_FUNCIONARIOBusiness(BCUUnitOfWork uow, IVIC_FUNCIONARIORepository VIC_FUNCIONARIORepository) : base(uow, VIC_FUNCIONARIORepository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }

        public IEnumerable<VIC_FUNCIONARIOEntity> GetFuncionariosByFilter(string empresa, string estabelecimento, string matricula, string nome, string area)
        {
            IQueryable<VIC_FUNCIONARIOEntity> search = Search(s => s.dat_desligto_func == null).AsQueryable();

            if (empresa != "vazio")
            {
                search = search.Where(w => w.cdn_empresa == Convert.ToInt32(empresa));
            }

            if (estabelecimento != "vazio")
            {
                search = search.Where(w => w.cdn_estab == Convert.ToInt32(estabelecimento));
            }

            if (matricula != "vazio")
            {
                search = search.Where(w => w.cdn_funcionario == Convert.ToInt32(matricula));
            }

            if (nome != "vazio")
            {
                search = search.Where(w => w.nom_pessoa_fisic.Contains(nome));
            }

            if (area != "vazio")
            {
                search = search.Where(w => w.des_area.Contains(area));
            }

            IEnumerable<VIC_FUNCIONARIOEntity> result = search.ToList();

            return result;
        }
    }
}
