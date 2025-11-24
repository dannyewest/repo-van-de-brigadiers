using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Data;
using VeilingPlatform.Model;
using VeilingPlatform.Model.Dto;

namespace VeilingPlatform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductSoldController : ControllerBase
    {
        private readonly DbConnect _context;

        public ProductSoldController(DbConnect context)
        {
            _context = context;
        }

        // GET: api/ProductSold
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductSoldDto>>> GetSoldProducts()
        {
            var soldProducts = await _context.ProductSolds
                .Select(ps => new ProductSoldDto
                {
                    ProductSoldId = ps.ProductSoldId,
                    BuyerId = ps.BuyerId,
                    BuyerName = ps.Buyer != null ? ps.Buyer.Name : "Unknown", // haalt buyer naam op
                    ProductId = ps.ProductId,
                    DateSold = ps.DateSold,
                    PriceSold = ps.PriceSold
                })
                .ToListAsync();

            return Ok(soldProducts);
        }
    }
}
