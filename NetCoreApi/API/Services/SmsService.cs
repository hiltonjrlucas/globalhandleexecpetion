using API.Configurations;
using API.Model;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using VicFramework.Library;
using VicFramework.Model.Shared;

namespace API.Services
{
    public class SmsService
    {
        private readonly IConfiguration _configuration;
        private readonly SmsConfigurations _smsConfig;
        private readonly EmailConfigurations _emailConfigurations;

        public SmsService(IConfiguration Configuration, SmsConfigurations smsConfig, EmailConfigurations emailConfigurations)
        {
            _configuration = Configuration;
            _smsConfig = smsConfig;
            _emailConfigurations = emailConfigurations;
        }

        public SmsResponse Send(SmsModel model)
        {
            HttpResponseMessage response = null;
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var body = new
                {
                    key =  _smsConfig.Key,
                    type = 9,
                    number = model.Phone,
	                msg = model.Message
                };
                
                response = client.PostAsync($"{_smsConfig.Url}send", new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json")).Result;
            }

            if (response.IsSuccessStatusCode)
            {
                SmsResponse balanceSms = Balance();
                if (int.TryParse(balanceSms.saldo_sms, out int balance))
                {
                    if (balance > -1 && balance <= _smsConfig.SmsLimit)
                    {
                        var message = $"API PortalRH informa que o serviço de envio de SMS possui apenas {balance} unidades disponíveis. Favor verificar o pacote e atualizar o saldo para que o serviço de envio de SMS continue funcionando corretamente.";

                        var email = new ObjectEmail
                        {
                            assunto = "Saldo serviço de SMS - LegalSMS ",
                            destinatario = _smsConfig.Admins,
                            mensagem = Email.GetEmailBody(message, _emailConfigurations.HostImg),
                            remetente = _emailConfigurations.Remetente,
                            smtpHost = _emailConfigurations.HostSMTP,
                            smtpPort = _emailConfigurations.PortSMTP,
                            CC = "",
                            CCO = ""
                        };

                        StatusEmail emailResponse = Email.SendEmail(email);
                        if (!emailResponse.sendedEmail)
                        {
                            Console.WriteLine(emailResponse.message);
                        }
                    }
                }
            }

            string data = (response.Content != null ? response.Content.ReadAsStringAsync().Result : "").Trim();

            return JsonConvert.DeserializeObject<SmsResponse>(data);
        }

        public SmsResponse Balance()
        {
            HttpResponseMessage response = null;
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var body = new {
                    key = _smsConfig.Key
                };

                response = client.PostAsync($"{_smsConfig.Url}balance", new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json")).Result;
            }

            string data = (response.Content != null ? response.Content.ReadAsStringAsync().Result : "").Trim();

            return JsonConvert.DeserializeObject<SmsResponse>(data);
        }
    }
}
