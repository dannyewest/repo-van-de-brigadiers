using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Data;
using VeilingPlatform.Model;
using VeilingPlatform.Model.Dto;

namespace VeilingPlatform.Controllers
{
    [ApiController]
    [Route("api/[controller]s")] // => /api/Auctions
    public class AuctionController : ControllerBase
    {
        private static readonly HashSet<string> AllowedStatuses =
            new(StringComparer.OrdinalIgnoreCase) { "Running", "Scheduled", "Stopped" };

        private readonly DbConnect _context;

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
                    Id        = a.Id,
                    StartDate = new DateTimeOffset(a.StartTime, TimeSpan.Zero),
                    EndDate   = new DateTimeOffset(a.EndTime,   TimeSpan.Zero),
                    Status    = a.Status,
                    Products  = a.ProductList.Select(p => new ProductDto
                    {
                        Id          = p.id,
                        Name        = p.name,
                        Type        = p.Type,
                        PotSize     = p.PotSize,
                        Length      = p.Length,
                        Quantity    = p.Quantity,
                        Price       = p.price,
                        Supplier    = p.supplier,
                        AuctionDate = p.auctionDate,
                        AuctionId   = p.AuctionId
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
                    Id        = a.Id,
                    StartDate = new DateTimeOffset(a.StartTime, TimeSpan.Zero),
                    EndDate   = new DateTimeOffset(a.EndTime,   TimeSpan.Zero),
                    Status    = a.Status,
                    Products  = a.ProductList.Select(p => new ProductDto
                    {
                        Id          = p.id,
                        Name        = p.name,
                        Type        = p.Type,
                        PotSize     = p.PotSize,
                        Length      = p.Length,
                        Quantity    = p.Quantity,
                        Price       = p.price,
                        Supplier    = p.supplier,
                        AuctionDate = p.auctionDate,
                        AuctionId   = p.AuctionId
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
            var status = string.IsNullOrWhiteSpace(dto.Status) ? "Scheduled" : dto.Status.Trim();
            if (!AllowedStatuses.Contains(status))
                return BadRequest(new { error = $"Invalid status '{dto.Status}'. Allowed: Running, Scheduled, Stopped." });

            var entity = new Auction
            {
                StartTime = dto.StartDate.UtcDateTime,
                EndTime   = dto.EndDate.UtcDateTime,
                Status    = status,
            };

            _context.Auctions.Add(entity);
            await _context.SaveChangesAsync(ct);

            var result = new AuctionDto
            {
                Id        = entity.Id,
                StartDate = new DateTimeOffset(entity.StartTime, TimeSpan.Zero),
                EndDate   = new DateTimeOffset(entity.EndTime,   TimeSpan.Zero),
                Status    = entity.Status,
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

            if (!AllowedStatuses.Contains(dto.Status))
                return BadRequest(new { error = $"Invalid status '{dto.Status}'. Allowed: Running, Scheduled, Stopped." });

            entity.StartTime = dto.StartDate.UtcDateTime;
            entity.EndTime   = dto.EndDate.UtcDateTime;
            entity.Status    = dto.Status;

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
