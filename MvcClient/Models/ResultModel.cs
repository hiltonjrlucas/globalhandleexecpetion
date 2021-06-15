namespace VicPortalRH.Models
{
    public class ResultModel
    {
        public bool success { get; set; }
        public object data { get; set; }
        public object http500Message { get; set; }
        public object message { get; set; }
    }
}
