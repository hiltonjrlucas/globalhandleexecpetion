using Library;
using System.Configuration;
using System.Data.SqlClient;

namespace DAL.Dapper
{
    public class SqlConn
    {
        public static SqlConnection GetSqlConnVicSaudeSeguranca()
        {
            return new SqlConnection(
                            Criptografia.Descriptografar(ConfigurationManager.ConnectionStrings["VicSaudeSeguranca"].ConnectionString));
        }
    }
}
