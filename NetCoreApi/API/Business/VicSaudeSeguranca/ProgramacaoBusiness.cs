using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using VicFramework.Business;
using VicFramework.Model.VicSaudeSeguranca;
using VicFramework.Repository.VicSaudeSeguranca;

namespace API.Business.VicSaudeSeguranca
{
    public class ProgramacaoBusiness : BaseBusiness<ProgramacaoEntity, IProgramacaoRepository>, IProgramacaoBusiness, IDisposable
    {
        public ProgramacaoBusiness(VicSaudeSegurancaUnitOfWork uow, IProgramacaoRepository repository) : base(uow, repository) { }

        public void Dispose()
        {
            if (_uow != null)
            {
                _uow.Dispose();
            }
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
                        var programacao = new ProgramacaoEntity
                        {
                            cdFilial = Convert.ToInt32(worksheet.Cells[row, 1].Value),
                            cdProcedimento = Convert.ToInt32(worksheet.Cells[row, 2].Value),
                            cdMatricula = Convert.ToString(worksheet.Cells[row, 3].Value),
                            dtValidade = Convert.ToDateTime(worksheet.Cells[row, 4].Value),
                            cdSituacao = 0
                        };

                        ProgramacaoEntity existing = _repository.Search(s => s.cdFilial == programacao.cdFilial &&
                                                                             s.cdProcedimento == programacao.cdProcedimento &&
                                                                             s.cdMatricula == programacao.cdMatricula &&
                                                                             s.dtValidade == programacao.dtValidade &&
                                                                             s.cdSituacao == 0)
                                                                .FirstOrDefault();

                        if (existing == null)
                        {
                            result += Add(programacao);
                        }
                        
                    }
                    else
                    {
                        break;
                    }
                }
            }

            return result;
        }
    }
}
