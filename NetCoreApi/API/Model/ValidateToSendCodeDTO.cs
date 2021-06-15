namespace API.Model
{
    public class ValidateToSendCodeDTO
    {
        public bool userValidation { get; set; }
        public bool answerValidation { get; set; }
        public string key { get; set; }
    }
}
