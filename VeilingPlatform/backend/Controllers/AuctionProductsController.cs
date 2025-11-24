using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Data;
using VeilingPlatform.Model.Dto;

namespace VeilingPlatform.Controllers
{
    [ApiController]
    [Route("api/[controller]/")]
    public class AuctionProductsController : ControllerBase
    {
        private readonly DbConnect _context;

        public AuctionProductsController(DbConnect context)
        {
            _context = context;
        }

        // GET: api/products (Read from database)
        [HttpGet("{auctionId}")]
        public async Task<ActionResult<IEnumerable<AuctionProductsDto>>> GetAuctionProducts(int auctionId)
        {
            var auctionProducts = await _context.Products
                .Where(p => p.AuctionId == auctionId)
                .Select(p => new AuctionProductsDto
                    {
                        OriginalId = p.id,
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

            if (auctionProducts == null || auctionProducts.Count == 0)
            {
                return NotFound();
            }

            int counter = 1;
            foreach (var item in auctionProducts)
            {
                item.Id = counter++;
            }

            return Ok(auctionProducts);
        }
    }
}
