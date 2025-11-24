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

        // GET: api/ProductEntity  →  get all products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            var products = await _context.Products
                .Select(p => new ProductDto
                {
                    Id = p.id,
                    Name = p.name,
                    Type = p.Type,
                    PotSize = p.PotSize,
                    Length = p.Length,
                    Quantity = p.Quantity,
                    BasePrice = p.price,
                    Supplier = p.supplier,

                })
                .ToListAsync();

            return Ok(products);
        }

        // GET: api/ProductEntity/{id} → get single product
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound();

            var dto = new ProductDto
            {
                Id = product.id,
                Name = product.name,
                Type = product.Type,
                PotSize = product.PotSize,
                Length = product.Length,
                Quantity = product.Quantity,
                BasePrice = product.price,
                Supplier = product.supplier,
                AuctionDate = product.auctionDate,
                AuctionId = null
            };

            return Ok(dto);
        }

        // POST: api/ProductEntity  →  create new product
        [HttpPost]
        public async Task<ActionResult<ProductSupplierDto>> CreateProduct(ProductSupplierDto dto)
        {

            if (dto.ImageFile == null || dto.ImageFile.Length == 0)
            {
                ModelState.AddModelError("ImageFile", "image is nessesary");
            }

            var uploadPath = "\\flowers\\" + dto.ImageFile.FileName;
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            using (var stream = new FileStream(uploadPath, FileMode.Create))
            {
                await dto.ImageFile.CopyToAsync(stream);
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var product = new Product
            {
                name = dto.Name,
                Type = dto.Type,
                PotSize = dto.PotSize,
                Length = (int)dto.Length,
                Quantity = dto.Quantity,
                price = dto.BasePrice,
                supplier = dto.Supplier,
                AuctionId = null,
                ImageUrl = dto.Image,
                ImageAlt = dto.ImageAlt
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            dto.Id = product.id; // return the new ID
            return CreatedAtAction(nameof(GetProduct), new { id = product.id }, dto);
        }

        // PUT: api/ProductEntity/{id}  →  update product
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductDto dto)
        {
            if (id <= 0)
                return BadRequest("Invalid ID.");

            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            product.name = dto.Name;
            product.Type = dto.Type;
            product.PotSize = dto.PotSize;
            product.Length = (int)dto.Length;
            product.Quantity = dto.Quantity;
            product.price = dto.BasePrice;
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
                if (!_context.Products.Any(e => e.id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/ProductEntity/{id}  →  delete product
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
