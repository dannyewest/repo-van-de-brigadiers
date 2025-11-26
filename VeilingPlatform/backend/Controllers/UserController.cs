using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Data;
using VeilingPlatform.Model;


namespace VeilingPlatform.Controllers
{
    [ApiController]
    [Route("api")]
    public class UserController : ControllerBase
    {
        private readonly DbConnect _context;

        public UserController(DbConnect context)
        {
            _context = context;
        }

    
       [HttpGet("auctioneers")]
        public async Task<ActionResult<IEnumerable<UserOutPutDto>>> GetAuctioneers()
        {
            var auctioneers = await _context.Users
                .OfType<Auctioneer>()
                .Select(a => new UserOutPutDto
                {
                    a.Id,
                    a.Name,                  
                })
                .ToListAsync();

            return Ok(auctioneers);
        }

        [HttpGet("suppliers")]
        public async Task<ActionResult<IEnumerable<UserOutPutDto>>> GetSuppliers()
        {
            var suppliers = await _context.Users
                .OfType<Supplier>()
                .Select(a => new UserOutPutDto
                {
                    a.Id,
                    a.Name,                  
                })
                .ToListAsync();

            return Ok(suppliers);
        }
    }
}
