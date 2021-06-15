using API.Business.VicSaudeSeguranca;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using VicFramework.Model.VicSaudeSeguranca;

namespace API.Controllers.VicSaudeSeguranca
{
    [Authorize("Bearer")]
    [Route("api/[controller]")]
    [ApiController]
    public class CargoController : BaseController
    {
        private readonly ICargoBusiness _cargoBusiness;

        public CargoController(ICargoBusiness cargoBusiness)
        {
            _cargoBusiness = cargoBusiness;
        }

        [HttpGet()]
        public IActionResult Get()
        {
            IEnumerable<CargoEntity> result = _cargoBusiness.GetAll();

            if (result == null) return NotFound();

            return Ok(result);
        }
    }
}