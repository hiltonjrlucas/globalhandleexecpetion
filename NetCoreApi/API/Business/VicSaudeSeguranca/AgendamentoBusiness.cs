using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class AgendamentoBusiness : BaseBusiness<AgendamentoEntity, IAgendamentoRepository>, IAgendamentoBusiness, IDisposable
    {
        protected IAreaRepository _areaRepository;
        public AgendamentoBusiness(VicSaudeSegurancaUnitOfWork uow, 
                                    IAgendamentoRepository repository, 
                                    IAreaRepository areaRepository) : base(uow, repository)
        {
            _areaRepository = areaRepository;
        }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
        }

        public IEnumerable<dynamic> GetAgendamentoCadastros()
        {
            return _repository.GetAgendamentoCadastros();
        }

        public IEnumerable<dynamic> GetAgendamentoAtendimento(int cdFilial, int cdProcedimento)
        {
            return _repository.GetAgendamentoAtendimento(cdFilial, cdProcedimento);
        }

        public int InsertExcel(MemoryStream file)
        {
            int result = 0;

            using (var package = new ExcelPackage(file))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[1];

                var rowCount = worksheet.Dimension?.Rows;
                var colCount = worksheet.Dimension?.Columns;

                if (!rowCount.HasValue || !colCount.HasValue)
                {
                    return result;
                }

                for (int row = 2; row <= rowCount.Value; row++)
                {
                    if (worksheet.Cells[row, 1].Value != null)
                    {
                        var agenda = new AgendamentoEntity
                        {
                            cdFilial = Convert.ToInt32(worksheet.Cells[row, 1].Value),
                            cdProfissional = Convert.ToString(worksheet.Cells[row, 2].Value),
                            cdProcedimento = Convert.ToInt32(worksheet.Cells[row, 3].Value),
                            cdLocal = Convert.ToInt32(worksheet.Cells[row, 4].Value),
                            dtAgendamento = Convert.ToDateTime(worksheet.Cells[row, 5].Value),
                            cdGrupoFolga = Convert.ToInt32(worksheet.Cells[row, 6].Value),
                            cdSituacao = 1
                        };

                        result += Add(agenda);
                    }
                    else
                    {
                        break;
                    }
                }
            }

            return result;
        }

        public IEnumerable<dynamic> GetConsultaAtendimento()
        {
            return _repository.GetConsultaAtendimento();
        }
    }
}
