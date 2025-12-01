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
            var soldProducts = await _context.ProductSold
                .Select(ps => new ProductSoldDto
                {
                    Id = ps.ProductSoldId,
                    BuyerId = ps.BuyerId,
                    BuyerName = ps.Buyer != null ? ps.Buyer.Name : "Unknown", // fetch buyer name
                    ProductId = ps.ProductId,
                    DateSold = ps.DateSold,
                    PriceSold = ps.PriceSold
                })
                .ToListAsync();

            return Ok(soldProducts);
        }

        // POST: api/ProductSold
        [HttpPost]
        public async Task<ActionResult<AuctionProductSoldDto>> CreateProductSold(AuctionProductSoldDto pSDto)
        {
            var newProductSold = new ProductSold
            {
                BuyerId = pSDto.BuyerId,
                ProductId = pSDto.ProductId,
                DateSold = pSDto.DateSold,
                PriceSold = pSDto.PriceSold
            };

            _context.ProductSold.Add(newProductSold);
            await _context.SaveChangesAsync();

            var resultDto = new AuctionProductSoldDto
            {
                BuyerId = newProductSold.BuyerId,
                ProductId = newProductSold.ProductId,
                DateSold = newProductSold.DateSold,
                PriceSold = newProductSold.PriceSold
            };

            return Ok(resultDto);
        }
    }
}
