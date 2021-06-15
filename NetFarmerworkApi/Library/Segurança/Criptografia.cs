using System;

namespace Library
{
    public class Criptografia
    {
        // Chave definida no documento de padronização de desenvolvimento.
        private static int vlChave = 90;

        /// <summary>
        /// Criptografa o texto utilizando a chave padrão de acordo com o documento de padronização de desenvolvimento.
        /// </summary>
        /// <param name="txtCriptografar">Texto a ser criptografado.</param>
        /// <returns></returns>
        public static string Criptografar(string txtCriptografar)
        {
            try
            {
                string txtCriptografado = "";

                for (int i = 0; i < txtCriptografar.Length; i++)
                {
                    int vlASCII = (int)txtCriptografar[i];

                    int vlASCIIC = vlASCII + vlChave;

                    txtCriptografado += vlASCIIC.ToString("X");
                }

                return txtCriptografado;
            }
            catch (Exception erro)
            {
                throw new Exception(erro.Message);
            }
        }

        /// <summary>
        /// Descriptografa o texto utilizando a chave padrão de acordo com o documento de padronização de desenvolvimento.
        /// </summary>
        /// <param name="txtDescriptografar">Texto a ser descriptografado.</param>
        /// <returns></returns>
        public static string Descriptografar(string txtDescriptografar)
        {
            try
            {
                string txtDescriptografado = "";

                if (txtDescriptografar != null)
                {
                    while (txtDescriptografar.Length > 0)
                    {
                        txtDescriptografado += Convert.ToChar(Convert.ToUInt32(txtDescriptografar.Substring(0, 2), 16) - vlChave).ToString();
                        txtDescriptografar = txtDescriptografar.Substring(2, txtDescriptografar.Length - 2);
                    }

                    return txtDescriptografado;
                }
                else
                {
                    return "";
                }
            }
            catch (Exception erro)
            {
                throw new Exception(erro.Message);
            }
        }
    }
}
