using Progress.Open4GL.Proxy;
using System;

namespace DAL
{
    public class AppServerConn : IDisposable
    {
        bool disposed = false;

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposed)
            {
                return;
            }

            if (disposing)
            {
            }

            disposed = true;
        }

        ~AppServerConn()
        {
            Dispose(false);
        }

        public static bool RunProgramAppServer(ref ParamArray pParametrosAppServer,
                                                string pProgramaERP,
                                                string pdsAppServerOnLine)
        {
            Connection conexaoAPPServer = null;
            OpenAppObject aplicacaoAPPServer = null;

            try
            {



                conexaoAPPServer = new Connection(pdsAppServerOnLine, "", "", "");
                aplicacaoAPPServer = new OpenAppObject(conexaoAPPServer, "ems");

                aplicacaoAPPServer.RunProc(pProgramaERP, pParametrosAppServer);

                aplicacaoAPPServer.Dispose();
                conexaoAPPServer.Dispose();

                return true;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (aplicacaoAPPServer != null)
                {
                    aplicacaoAPPServer.Dispose();
                }
                if (conexaoAPPServer != null)
                {
                    conexaoAPPServer.Dispose();
                }

            }

        }

        public void valida(Exception ex)
        {
            if (ex.InnerException.InnerException.Message.Contains("xxxx"))
            {
                throw new Exception("appServer_inativo");
            }
        }
    }
}
