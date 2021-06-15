using Dapper;
using Model.Entities.VicSaudeSeguranca;
using System;
using System.Collections.Generic;
using System.Data;

namespace DAL.Dapper.VicSaudeSeguranca
{
    public class RegistroPontoRepository
    {
        public IList<RegistroPontoEntity> GetBatidasPendentesIntegracao()
        {
            using (var conexao = SqlConn.GetSqlConnVicSaudeSeguranca())
            {
                // 0 = registros que ainda não integraram
                return conexao.Query<RegistroPontoEntity>(
                    @"SELECT cdUsuario,
                             dtRegistro,
                             idRegistroPonto 
                      FROM RegistroPonto 
                      WHERE stIntegracao = 0").AsList();
            }
        }

        public bool SetRetornoIntegracaoHCM(DataTable registrosRetorno)
        {
            using (var conexao = SqlConn.GetSqlConnVicSaudeSeguranca())
            {
                conexao.Open();                
                using (var transaction = conexao.BeginTransaction())
                {
                    try
                    {
                        var affectedRows = 0;
                        foreach (DataRow row in registrosRetorno.Rows)
                        {
                            affectedRows = affectedRows +
                                        conexao.Execute(@"UPDATE RegistroPonto 
                                                          SET stIntegracao = @st, 
                                                              dtIntegracao = GETDATE(), 
                                                              descErroIntegracao = @erro 
                                                          WHERE idRegistroPonto = @id",
                                                        new
                                                        {
                                                            st = row.Field<string>("desValid").Contains("[OK]") ? 1 : 0,
                                                            erro = row.Field<string>("desValid").Contains("[OK]") ? null : row.Field<string>("desValid"),
                                                            id = row.Field<decimal>("id")                                                            
                                                        },
                                                        transaction: transaction);
                        }

                        transaction.Commit();

                        return affectedRows == registrosRetorno.Rows.Count;
                    }
                    catch (Exception erro)
                    {
                        transaction.Rollback();
                        throw new Exception(erro.Message);
                    }
                }
            }
        }
    }
}
