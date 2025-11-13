using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Data;
using VeilingPlatform.Model;
using VeilingPlatform.Model.Dto;

namespace VeilingPlatform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly DbConnect _context;

        public ProductController(DbConnect context)
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
                    Id = p.id,
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

        // PUT: api/products/{id} (Update existing product)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            product.name = dto.Name;
            product.Type = dto.Type;
            product.PotSize = dto.PotSize;
            product.Length = dto.Length;
            product.Quantity = dto.Quantity;
            product.price = dto.Price;
            product.supplier = dto.Supplier;
            product.auctionDate = dto.AuctionDate;
            product.AuctionId = dto.AuctionId;

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                {
                    if (!_context.Products.Any(e => e.id == id))
                        return NotFound();
                    else
                        throw;
                }
            }

            return NoContent();
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
                return NotFound(new { message = $"Product met ID {id} is niet gevonden." });
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Product is succesvol verwijderd." });
        }

    }
}
