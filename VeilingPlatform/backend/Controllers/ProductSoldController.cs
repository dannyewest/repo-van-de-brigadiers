using Microsoft.AspNetCore.Authorization;
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
        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<ActionResult<AuctionProductSoldDto>> CreateProductSold([FromBody] AuctionProductSoldDto pSDto)
        {
            var dbProduct = await _context.Products.FindAsync(pSDto.ProductId);

            if (dbProduct == null)
            {
                return NotFound("Product not found.");
            }

            if (pSDto.Amount <= 0)
            {
                return BadRequest("Amount must be greater than zero.");
            }
            
            if (pSDto.Amount > dbProduct.Quantity)
            {
                return BadRequest($"Insufficient stock. Available quantity: {dbProduct.Quantity}.");
            }

            if (pSDto.PriceSold < dbProduct.Price) 
            {
                return BadRequest($"Bid of {pSDto.PriceSold} is to low. Minimum price = {dbProduct.Price}.");
            }

            var newProductSold = new ProductSold
            {
                BuyerId = pSDto.BuyerId,
                ProductId = pSDto.ProductId,
                DateSold = DateTime.UtcNow,
                PriceSold = pSDto.PriceSold,
                Amount = pSDto.Amount
            };

            // Add the new ProductSold record
            _context.ProductSold.Add(newProductSold);

            // Update product stock
            dbProduct.Quantity -= pSDto.Amount;
            
            try 
            {
                await _context.SaveChangesAsync();
            } catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while saving the product sold record: " + ex.Message);
            }

            return Ok(new { Message = "Bid succesful!", NewStock = dbProduct.Quantity});
        }
    }
}
