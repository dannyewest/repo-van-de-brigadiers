using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Data;
using VeilingPlatform.Model;
using VeilingPlatform.Model.Dto;
using Microsoft.AspNetCore.Authorization;

namespace VeilingPlatform.Controllers
{
    [ApiController]
    [Route("api")] // => /api/Auctions
    public class AuctionController : ControllerBase
    {
        private static readonly HashSet<string> AllowedStatuses =
            new(StringComparer.OrdinalIgnoreCase) { "Running", "Scheduled", "Stopped" };

        private readonly DbConnect _context;

        public AuctionController(DbConnect context)
        {
            _context = context;
        }

        // GET: /api/auctions
        [Authorize(Roles = "Auctioneer, Customer")]
        [HttpGet("auctions")]
        public async Task<ActionResult<IEnumerable<AuctionDto>>> GetAuctions(CancellationToken ct)
        {
            var items = await _context.Auctions
                .AsNoTracking()
                .Include(a => a.Auctioneer)
                .Include(a => a.ProductList)
                .Select(a => new AuctionDto
                {
                    Id = a.Id,
                    StartsAt = a.StartTime,
                    EndsAt = a.EndTime,
                    Status = a.Status,
                    Auctioneer = new AuctioneerDto
                    {
                        Id = a.Auctioneer.Id,
                        Name = a.Auctioneer.Name,
                    },
                    Products = a.ProductList.Select(p => new SimpleProductDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        MaxPrice = p.MaxPrice,
                        BasePrice = p.Price,
                        ImageUrl = p.ImageUrl
                    }).ToList()
                })
                .ToListAsync(ct);

            return Ok(items);
        }

        // GET: /api/auction/{id}
        [Authorize(Roles = "Auctioneer, Customer")]
        [HttpGet("auction/{id:int}")]
        public async Task<ActionResult<AuctionDto>> GetAuctionById(int id, CancellationToken ct)
        {
            var dto = await _context.Auctions
                .AsNoTracking()
                .Include(a => a.Auctioneer)
                .Include(a => a.ProductList)
                .Where(a => a.Id == id)
                .Select(a => new AuctionDto
                {
                    Id = a.Id,
                    StartsAt = a.StartTime,
                    EndsAt = a.EndTime,
                    Status = a.Status,
                    Auctioneer = new AuctioneerDto
                    {
                        Id = a.Auctioneer.Id,
                        Name = a.Auctioneer.Name,
                    },
                    Products = a.ProductList.Select(p => new SimpleProductDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        MaxPrice = p.MaxPrice,
                        BasePrice = p.Price,
                        ImageUrl = p.ImageUrl
                    }).ToList()
                })
                .FirstOrDefaultAsync(ct);

            if (dto == null)
                return NotFound();

            return Ok(dto);
        }

        // GET: /api/auctions/dashboard  (New endpoint for FE)
        [HttpGet("auctions/dashboard")]
        public async Task<ActionResult<IEnumerable<AuctionDashboardDto>>> GetDashboardAuctions(CancellationToken ct)
        {
            var items = await _context.Auctions
                .AsNoTracking()
                .Include(a => a.ProductList)
                .Select(a => new AuctionDashboardDto
                {
                    Id = a.Id,
                    StartsAt = a.StartTime,
                    EndsAt = a.EndTime,
                    Status = a.Status,

                    Products = a.ProductList.Select(p => new AuctionDashboardProductDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        BasePrice = p.Price,
                        ImageUrl = p.ImageUrl
                    }).ToList()
                })
                .ToListAsync(ct);

            return Ok(items);
        }

        // POST: /api/auction/create
        [Authorize(Roles = "Auctioneer")]
        [HttpPost("auction/create")]
        public async Task<ActionResult<AuctionDto>> CreateAuction([FromBody] CreateAuctionDto dto, CancellationToken ct)
        {
            if (dto == null)
                return BadRequest(new { error = "Body is empty or invalid." });

            if (dto.EndsAt < dto.StartsAt)
                return BadRequest(new { error = "endsAt must be later than startsAt." });

            var status = string.IsNullOrWhiteSpace(dto.Status) ? "Scheduled" : dto.Status.Trim();
            if (!AllowedStatuses.Contains(status))
                return BadRequest(new { error = $"Invalid status '{dto.Status}'." });

            var auctioneerExists = await _context.Auctioneers.AnyAsync(a => a.Id == dto.AuctioneerId, ct);
            if (!auctioneerExists)
                return BadRequest(new { error = $"Auctioneer with id {dto.AuctioneerId} does not exist." });

            if (dto.Products == null || dto.Products.Count == 0)
                return BadRequest(new { error = "No products given." });

            var productIds = dto.Products.Select(p => p.Id).ToList();

            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync(ct);

            if (products.Count != productIds.Count)
                return BadRequest(new { error = "Invalid product IDs." });

            var entity = new Auction
            {
                AuctioneerId = dto.AuctioneerId,
                StartTime = dto.StartsAt,
                EndTime = dto.EndsAt,
                Status = status,
            };

            _context.Auctions.Add(entity);
            await _context.SaveChangesAsync(ct);

            // Connect Product to Auction
            foreach (var p in products)
            {
                p.AuctionId = entity.Id;

                var input = dto.Products.First(x => x.Id == p.Id);
                p.MaxPrice = input.MaxPrice;
            }

            await _context.SaveChangesAsync(ct);

            entity.ProductList = products;

            var result = new AuctionDto
            {
                Id = entity.Id,
                StartsAt = entity.StartTime,
                EndsAt = entity.EndTime,
                Status = entity.Status,
                Auctioneer = new AuctioneerDto
                {
                    Id = entity.Auctioneer.Id,
                    Name = entity.Auctioneer.Name
                },
                Products = entity.ProductList.Select(p => new SimpleProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    MaxPrice = p.MaxPrice,
                    BasePrice = p.Price,
                    ImageUrl = p.ImageUrl
                }).ToList()
            };

            return CreatedAtAction(nameof(GetAuctionById), new { id = entity.Id }, result);
        }

        // PUT: /api/auction/{id}/update
        [Authorize(Roles = "Auctioneer")]
        [HttpPut("auction/{id:int}/update")]
        public async Task<IActionResult> UpdateAuction(int id, [FromBody] UpdateAuctionDto dto, CancellationToken ct)
        {
            if (dto == null)
                return BadRequest(new { error = "Body is empty or invalid." });

            var entity = await _context.Auctions
                .Include(a => a.ProductList)
                .FirstOrDefaultAsync(a => a.Id == id, ct);

            if (entity == null)
                return NotFound();

            if (dto.EndsAt < dto.StartsAt)
                return BadRequest(new { error = "endsAt must be later than startsAt." });

            var status = string.IsNullOrWhiteSpace(dto.Status)
                ? entity.Status ?? "Scheduled"
                : dto.Status.Trim();

            if (!AllowedStatuses.Contains(status))
                return BadRequest(new { error = $"Invalid status '{dto.Status}'." });

            var auctioneerExists = await _context.Auctioneers.AnyAsync(a => a.Id == dto.AuctioneerId, ct);
            if (!auctioneerExists)
                return BadRequest(new { error = $"Auctioneer with id {dto.AuctioneerId} does not exist." });

            entity.AuctioneerId = dto.AuctioneerId;
            entity.StartTime = dto.StartsAt;
            entity.EndTime = dto.EndsAt;
            entity.Status = status;

            var newProducts = dto.Products ?? new List<AuctionProductInputDto>();
            var newIds = newProducts.Select(p => p.Id).ToList();

            var currentProducts = entity.ProductList.ToList();

            // Remove products that are no longer associated in auction
            foreach (var p in currentProducts.Where(p => !newIds.Contains(p.Id)))
            {
                p.AuctionId = null;
                p.MaxPrice = null;
            }

            if (newIds.Count > 0)
            {
                var products = await _context.Products
                    .Where(p => newIds.Contains(p.Id))
                    .ToListAsync(ct);

                if (products.Count != newIds.Count)
                    return BadRequest(new { error = "Invalid product IDs." });

                foreach (var p in products)
                {
                    p.AuctionId = entity.Id;

                    var input = newProducts.First(x => x.Id == p.Id);
                    p.MaxPrice = input.MaxPrice;
                }
            }

            await _context.SaveChangesAsync(ct);
            return NoContent();
        }

        // DELETE: /api/auctions/{id}/delete
        [Authorize(Roles = "Auctioneer")]
        [HttpDelete("auction/{id:int}/delete")]
        public async Task<IActionResult> DeleteAuction(int id, CancellationToken ct)
        {
            var entity = await _context.Auctions.FindAsync(new object[] { id }, ct);
            if (entity == null)
                return NotFound();

            _context.Auctions.Remove(entity);
            await _context.SaveChangesAsync(ct);
            return NoContent();
        }
    }
}
