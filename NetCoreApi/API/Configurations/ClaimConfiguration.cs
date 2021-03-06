using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Security.Claims;

namespace API.Configurations
{
    public class ClaimConfiguration : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return (objectType == typeof(Claim));
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            JObject jo = JObject.Load(reader);
            string type = (string)jo["m_type"];
            string value = (string)jo["m_value"];

            return new Claim(type, value);
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanWrite
        {
            get { return false; }
        }
    }
}
