using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Data;
using VeilingPlatform.Model.Dto;

namespace VeilingPlatform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuctionProductsController : ControllerBase
    {
        private readonly DbConnect _context;

        public AuctionProductsController(DbConnect context)
        {
            _context = context;
        }

        // GET: api/products (Read from database)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuctionProductsDto>>> GetProducts()
        {
            return await _context.Products.Select(p => new AuctionProductsDto
                {
                    Id = p.id,
                    Name = p.name,
                    Type = p.Type,
                    PotSize = p.PotSize,
                    Length = p.Length,
                    Quantity = p.Quantity,
                    Price = p.price,
                    Supplier = p.supplier,
                    AuctionDate = p.auctionDate
                })
                .ToListAsync();
        }
    }
}
