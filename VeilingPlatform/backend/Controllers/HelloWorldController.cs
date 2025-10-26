using Microsoft.AspNetCore.Mvc;

namespace VeilingPlatform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HelloWorldController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { message = "Connectie werkt✅" });
        }
    }
}
