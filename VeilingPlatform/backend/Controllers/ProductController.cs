using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Data;
using VeilingPlatform.Model;
using VeilingPlatform.Model.Dto;

namespace VeilingPlatform.Controllers
{
    [ApiController]
    [Route("api")]
    public class ProductController : ControllerBase
    {
        private readonly DbConnect _context;

        public ProductController(DbConnect context)
        {
            _context = context;
        }

        // GET: api/products (Read from database)
        [HttpGet("products")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            return await _context.Products
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Type = p.Type,
                    PotSize = p.PotSize,
                    Length = p.Length,
                    Quantity = p.Quantity,
                    Price = p.Price,
                    Supplier = p.Supplier,
                    AuctionDate = p.AuctionDate,
                    AuctionId = p.AuctionId
                })
                .ToListAsync();
        }

        // GET: api/product/{id} (Read single product by id)
        [HttpGet("product/{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            var dto = new ProductDto
            {
                Name = product.Name,
                Type = product.Type,
                PotSize = product.PotSize,
                Length = product.Length,
                Quantity = product.Quantity,
                Price = product.Price,
                Supplier = product.Supplier,
                AuctionDate = product.AuctionDate,
                AuctionId = product.AuctionId
            };

            return dto;
        }

        // PUT: api/products/{id} (Update existing product)
        [HttpPut("product/{id}/update")]
        public async Task<IActionResult> UpdateProduct(int id, ProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            product.Name = dto.Name;
            product.Type = dto.Type;
            product.PotSize = dto.PotSize;
            product.Length = dto.Length;
            product.Quantity = dto.Quantity;
            product.Price = dto.Price;
            product.Supplier = dto.Supplier;
            product.AuctionDate = dto.AuctionDate;
            product.AuctionId = dto.AuctionId;

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                {
                    if (!_context.Products.Any(e => e.Id == id))
                        return NotFound();
                    else
                        throw;
                }
            }

            return NoContent();
        }

        // POST: api/products (Create into the database)
        [HttpPost("product/new")]
        public async Task<ActionResult<ProductDto>> CreateProduct(ProductDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = new Product
            {
                Name = dto.Name,
                Type = dto.Type,
                PotSize = dto.PotSize,
                Length = dto.Length,
                Quantity = dto.Quantity,
                Price = dto.Price,
                Supplier = dto.Supplier,
                AuctionDate = dto.AuctionDate,
                AuctionId = dto.AuctionId
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            dto.AuctionId = product?.AuctionId;
            return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, dto);
        }

        [HttpDelete("product/{id}/delete")]
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

        // Retrieve Products without an auctionId (Available Products to be put onto auction)
        [HttpGet("products/available")]
        public async Task<ActionResult<IEnumerable<SimpleProductDto>>> GetAvailableProducts(CancellationToken ct)
        {
            var items = await _context.Products
                .AsNoTracking()
                .Where(p => p.AuctionId == null)
                .Select(p => new SimpleProductDto
                {
                    Id   = p.Id,
                    Name = p.Name
                })
                .ToListAsync(ct);

            return Ok(items);
        }

    }
}
