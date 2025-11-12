using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Data;            // jouw DbContext namespace
using VeilingPlatform.Model;           // Auction, Product
using VeilingPlatform.Model.Dto;       // AuctionDto, ProductDto

namespace VeilingPlatform.Controllers
{
    [ApiController]
    [Route("api/[controller]s")] // => /api/Auctions
    public class AuctionController : ControllerBase
    {
        private readonly DbConnect _context; // jouw DbContext type

        public AuctionController(DbConnect context)
        {
            _context = context;
        }

        // GET: /api/Auctions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuctionDto>>> GetAuctions(CancellationToken ct)
        {
            var items = await _context.Auctions
                .AsNoTracking()
                .Select(a => new AuctionDto
                {
                    Id = a.Id,
                    // entity heeft StartTime/EndTime (DateTime) -> DTO heeft StartDate/EndDate (DateTimeOffset)
                    StartDate = new DateTimeOffset(a.StartTime, TimeSpan.Zero),
                    EndDate   = new DateTimeOffset(a.EndTime,   TimeSpan.Zero),
                    Products = a.ProductList.Select(p => new ProductDto
                    {
                        Id         = p.id,
                        Name       = p.name,
                        Type       = p.Type,
                        PotSize    = p.PotSize,
                        Length     = p.Length,
                        Quantity   = p.Quantity,
                        Price      = p.price,
                        Supplier   = p.supplier,
                        AuctionDate= p.auctionDate,
                        AuctionId  = p.AuctionId
                    }).ToList()
                })
                .ToListAsync(ct);

            return Ok(items);
        }

        // GET: /api/Auctions/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<AuctionDto>> GetAuctionById(int id, CancellationToken ct)
        {
            var dto = await _context.Auctions
                .AsNoTracking()
                .Where(a => a.Id == id)
                .Select(a => new AuctionDto
                {
                    Id = a.Id,
                    StartDate = new DateTimeOffset(a.StartTime, TimeSpan.Zero),
                    EndDate   = new DateTimeOffset(a.EndTime,   TimeSpan.Zero),
                    Products = a.ProductList.Select(p => new ProductDto
                    {
                        Id         = p.id,
                        Name       = p.name,
                        Type       = p.Type,
                        PotSize    = p.PotSize,
                        Length     = p.Length,
                        Quantity   = p.Quantity,
                        Price      = p.price,
                        Supplier   = p.supplier,
                        AuctionDate= p.auctionDate,
                        AuctionId  = p.AuctionId
                    }).ToList()
                })
                .FirstOrDefaultAsync(ct);

            if (dto == null) return NotFound();
            return Ok(dto);
        }

        // POST: /api/Auctions
        [HttpPost]
        public async Task<ActionResult<AuctionDto>> CreateAuction([FromBody] CreateAuctionDto dto, CancellationToken ct)
        {
            var entity = new Auction
            {
                // DTO => entity translatie (Offset -> DateTime)
                StartTime = dto.StartDate.UtcDateTime,
                EndTime   = dto.EndDate.UtcDateTime,
                // Eventueel Status/AuctioneerId invullen als je die hebt
            };

            _context.Auctions.Add(entity);
            await _context.SaveChangesAsync(ct);

            var result = new AuctionDto
            {
                Id = entity.Id,
                StartDate = new DateTimeOffset(entity.StartTime, TimeSpan.Zero),
                EndDate   = new DateTimeOffset(entity.EndTime,   TimeSpan.Zero),
                Products  = new List<ProductDto>()
            };

            return CreatedAtAction(nameof(GetAuctionById), new { id = entity.Id }, result);
        }

        // PUT: /api/Auctions/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAuction(int id, [FromBody] UpdateAuctionDto dto, CancellationToken ct)
        {
            var entity = await _context.Auctions.FindAsync([id], ct);
            if (entity == null) return NotFound();

            entity.StartTime = dto.StartDate.UtcDateTime;
            entity.EndTime   = dto.EndDate.UtcDateTime;

            await _context.SaveChangesAsync(ct);
            return NoContent();
        }

        // DELETE: /api/Auctions/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAuction(int id, CancellationToken ct)
        {
            var entity = await _context.Auctions.FindAsync([id], ct);
            if (entity == null) return NotFound();

            _context.Auctions.Remove(entity);
            await _context.SaveChangesAsync(ct);
            return NoContent();
        }
    }
}
