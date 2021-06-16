using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalcController : ControllerBase
    {
        [Route("div/{number}")]
        [HttpGet]
        public IActionResult calculoComplexo(int number)
        {
            double calc = 15 / number;
            return Ok(calc);
        }
    }
}
