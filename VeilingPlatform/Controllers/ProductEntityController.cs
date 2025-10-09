using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Data;
using VeilingPlatform.Model;
using VeilingPlatform.Model.Dto;

namespace VeilingPlatform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductEntityController : ControllerBase
    {
        private readonly DbConnect _context;

        public ProductEntityController(DbConnect context)
        {
            _context = context;
        }

        // GET: api/products (Read from database)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            return await _context.Products
                .Select(p => new ProductDto
                {
                    Name = p.name,
                    Type = p.Type,
                    PotSize = p.PotSize,
                    Length = p.Length,
                    Quantity = p.Quantity,
                    Price = p.price,
                    Supplier = p.supplier,
                    AuctionDate = p.auctionDate,
                    AuctionId = p.AuctionId
                })
                .ToListAsync();
        }

        // GET: api/products/{id} (Read single product by id)
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            var dto = new ProductDto
            {
                Name = product.name,
                Type = product.Type,
                PotSize = product.PotSize,
                Length = product.Length,
                Quantity = product.Quantity,
                Price = product.price,
                Supplier = product.supplier,
                AuctionDate = product.auctionDate,
                AuctionId = product.AuctionId
            };

            return dto;
        }

        // POST: api/products (Create into the database)
        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(ProductDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = new Product
            {
                name = dto.Name,
                Type = dto.Type,
                PotSize = dto.PotSize,
                Length = dto.Length,
                Quantity = dto.Quantity,
                price = dto.Price,
                supplier = dto.Supplier,
                auctionDate = dto.AuctionDate,
                AuctionId = dto.AuctionId
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            dto.AuctionId = product.AuctionId;
            return CreatedAtAction(nameof(GetProducts), new { id = product.id }, dto);
        }


       [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

             if (product == null)
             {
                return NotFound(new Dictionary<string, string>
                {
                    { "message", $"Product met ID {id} is niet gevonden." }
                });
             }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new Dictionary<string, string>
            {
                { "message", "Product is succesvol verwijderd." }
            });
        }
    }
}
