using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Data;
using VeilingPlatform.Model;
using VeilingPlatform.Model.Dto;
using System.Security.Claims;


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
        [Authorize(Roles = "Supplier,Auctioneer, Customer")]
        [HttpGet("products")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            var products = await _context.Products
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Type = p.Type,
                    PotSize = p.PotSize,
                    Length = p.Length,
                    Quantity = p.Quantity,
                    Supplier = p.Supplier,
                    BasePrice = p.Price,
                    AuctionDate = p.AuctionDate,
                    AuctionId = p.AuctionId,
                    Image = p.ImageUrl,
                    ImageAlt = p.ImageAlt
                })
                .ToListAsync();

            return Ok(products);
        }

        // GET: api/product/{id} (Read single product by id)
        [Authorize(Roles = "Supplier,Auctioneer")]
        [HttpGet("product/{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound();

            var dto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Type = product.Type,
                PotSize = product.PotSize,
                Length = product.Length,
                Quantity = product.Quantity,
                BasePrice = product.Price,
                Supplier = product.Supplier,
                AuctionDate = product.AuctionDate,
                AuctionId = product.AuctionId,
                Image = product.ImageUrl,
                ImageAlt = product.ImageAlt
            };

            return Ok(dto);
        }

        [Authorize(Roles = "Supplier,Auctioneer")]
        [HttpPost("product")]
        public async Task<ActionResult<ProductDto>> MakeProduct(ProductSupplierDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (dto.BasePrice < 0)
                return BadRequest("Price cannot be negative.");

            // Get supplier name from authenticated user
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized("Supplier identity missing.");

            int userId = int.Parse(userIdClaim);

            // Fetch supplier from database
            var supplierUser = await _context.Users
            .OfType<Supplier>()
            .FirstOrDefaultAsync(u => u.Id == userId);

            if (supplierUser == null)
                return Unauthorized("Only suppliers can create products.");

            string supplierName = supplierUser.Name;

            var product = new Product
            {
                Name = dto.Name,
                Type = dto.Type,
                PotSize = dto.PotSize,
                Length = (int)dto.Length,
                Quantity = dto.Quantity,
                Price = dto.BasePrice,
                Supplier = supplierName,
                AuctionDate = dto.AuctionDate,
                ImageUrl = dto.Image,
                ImageAlt = dto.ImageAlt,
                AuctionId = null
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var response = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Type = product.Type,
                PotSize = product.PotSize,
                Length = product.Length,
                Quantity = product.Quantity,
                BasePrice = product.Price,
                Supplier = product.Supplier,
                AuctionDate = product.AuctionDate,
                AuctionId = product.AuctionId
            };

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, response);
        }


        // PUT: api/ProductEntity/{id}  →  update product
        [Authorize(Roles = "Supplier,Auctioneer")]
        [HttpPut("Product/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductSupplierDto dto)
        {
            if (id <= 0)
                return BadRequest("Invalid ID.");

            if (dto.BasePrice < 0)
                return BadRequest("Price cannot be negative.");

            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            product.Name = dto.Name;
            product.Type = dto.Type;
            product.PotSize = dto.PotSize;
            product.Length = (int)dto.Length;
            product.Quantity = dto.Quantity;
            product.Price = dto.BasePrice;
            product.Supplier = dto.Supplier;
            product.AuctionDate = dto.AuctionDate;
            product.Price = dto.BasePrice;
            product.Supplier = dto.Supplier;
            product.ImageUrl = dto.Image;
            product.ImageAlt = dto.ImageAlt;

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }


        // DELETE: api/ProductEntity/{id}  →  delete product
        [Authorize(Roles = "Supplier,Auctioneer")]
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

        // Retrieve Products without an auctionId and part of the auction (Available Products to be put onto auction)
        [Authorize(Roles = "Supplier,Auctioneer")]
        [HttpGet("products/available")]
        public async Task<ActionResult<IEnumerable<SimpleProductDto>>> GetAvailableProducts(
            [FromQuery] int? auctionId,
            CancellationToken ct)
        {
            var query = _context.Products
                .AsNoTracking()
                .AsQueryable()
                .Where(p =>
                    p.AuctionId == null ||
                    (auctionId != null && p.AuctionId == auctionId)
                )
            ;

            var items = await query
                .Select(p => new SimpleProductDto
                {
                    Id = p.Id,
                    Name = p.Name
                })
                .ToListAsync(ct);

            return Ok(items);
        }

    }
}
