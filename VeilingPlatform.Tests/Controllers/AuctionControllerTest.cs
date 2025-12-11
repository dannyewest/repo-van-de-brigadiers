using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Controllers;
using VeilingPlatform.Data;
using VeilingPlatform.Model;
using VeilingPlatform.Model.Dto;

namespace VeilingPlatform.Tests.Controllers
{
    public class AuctionControllerTest
    {
        // Helper: Create in-memory DB for each test.
        private DbConnect CreateDb()
        {
            var options = new DbContextOptionsBuilder<DbConnect>()
                .UseInMemoryDatabase("AuctionDb_" + Guid.NewGuid())
                .Options;

            return new DbConnect(options);
        }

        // GET /auctions
        [Fact]
        public async Task GetAuctions_ReturnsAllAuctions()
        {
            // ARRANGE: Insert auctioneer with an auction with two products.
            var db = CreateDb();

            var auctioneer = TestDataFactory.CreateAuctioneer(1, "Piet");
            db.Auctioneers.Add(auctioneer);

            var p1 = TestDataFactory.CreateProductWithId(1, "Orchidee");
            var p2 = TestDataFactory.CreateProductWithId(2, "Tulp");

            var auction = new Auction
            {
                Id = 100,
                AuctioneerId = auctioneer.Id,
                StartTime = DateTime.UtcNow,
                EndTime = DateTime.UtcNow.AddHours(1),
                Status = "Scheduled",
                ProductList = new List<Product> { p1, p2 },
            };

            p1.AuctionId = auction.Id;
            p2.AuctionId = auction.Id;

            db.Auctions.Add(auction);
            db.SaveChanges();

            var controller = new AuctionController(db);

            // ACT: Retrieve all auctions.
            var result = await controller.GetAuctions(CancellationToken.None);

            // ASSERT: Expect one auction with both products.
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var list = Assert.IsAssignableFrom<IEnumerable<AuctionDto>>(ok.Value);

            Assert.Single(list);
            Assert.Equal(2, list.First().Products.Count); // includes both products.
        }

        // GET /auction/{id}
        [Fact]
        public async Task GetAuctionById_ReturnsAuction()
        {
            // ARRANGE: Insert an auctioneer and a single auction with one item.
            var db = CreateDb();

            var auctioneer = TestDataFactory.CreateAuctioneer(1, "Hans");
            db.Auctioneers.Add(auctioneer);

            var p1 = TestDataFactory.CreateProductWithId(1, "Roos");

            var auction = new Auction
            {
                Id = 101,
                AuctioneerId = auctioneer.Id,
                StartTime = DateTime.UtcNow,
                EndTime = DateTime.UtcNow.AddHours(1),
                Status = "Running",
                ProductList = new List<Product> { p1 },
            };

            p1.AuctionId = auction.Id;

            db.Auctions.Add(auction);
            db.SaveChanges();

            var controller = new AuctionController(db);

            // ACT: request auction by ID.
            var result = await controller.GetAuctionById(101, CancellationToken.None);

            // ASSERT: Expected to be returned + matching with auction DTO.
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var dto = Assert.IsType<AuctionDto>(ok.Value);

            Assert.Equal(101, dto.Id); // ID must match.
            Assert.Single(dto.Products);
        }

        // POST /auction (CreateAuction)
        [Fact]
        public async Task CreateAuction_CreatesAuction_WhenValid()
        {
            // ARRANGE: Add an auctioneer and two valid products to be included.
            var db = CreateDb();
            var controller = new AuctionController(db);

            var auctioneer = TestDataFactory.CreateAuctioneer(5, "Kees");
            db.Auctioneers.Add(auctioneer);

            var p1 = TestDataFactory.CreateProductWithId(10, "Pioen");
            var p2 = TestDataFactory.CreateProductWithId(11, "Dahlia");

            db.Products.AddRange(p1, p2);
            db.SaveChanges();

            var dto = TestDataFactory.CreateValidAuctionDto(
                auctioneer.Id,
                new List<AuctionProductInputDto>
                {
                    new AuctionProductInputDto { Id = p1.Id, MaxPrice = 5 },
                    new AuctionProductInputDto { Id = p2.Id, MaxPrice = 10 },
                }
            );

            // ACT: Creates the new auction
            var result = await controller.CreateAuction(dto, CancellationToken.None);

            // ASSERT: Returned auction should contain the two products,
            // Products will have the auctionId updated.
            var created = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returned = Assert.IsType<AuctionDto>(created.Value);

            Assert.Equal(2, returned.Products.Count);
            Assert.NotEqual(0, returned.Id);

            // Product is assigned to the newly created auction.
            Assert.Equal(returned.Id, db.Products.First(p => p.Id == p1.Id).AuctionId);
        }

        // DELETE /auction/{id}
        [Fact]
        public async Task DeleteAuction_RemovesAuction_WhenExists()
        {
            // ARRANGE: Insert an Auction and Auctioneer for valid data target to be deleted.
            var db = CreateDb();

            var auctioneer = TestDataFactory.CreateAuctioneer(20, "Jans");
            db.Auctioneers.Add(auctioneer);

            var auction = new Auction
            {
                Id = 200,
                AuctioneerId = auctioneer.Id,
                StartTime = DateTime.UtcNow,
                EndTime = DateTime.UtcNow.AddHours(1),
                Status = "Stopped",
            };

            db.Auctions.Add(auction);
            db.SaveChanges();

            var controller = new AuctionController(db);

            // ACT: Attemppt to delete the auction with the existing ID 200.
            var result = await controller.DeleteAuction(200, CancellationToken.None);

            // ASSERT: Delete is succesful and auction is removed from the DB.
            Assert.IsType<NoContentResult>(result);
            Assert.False(db.Auctions.Any(a => a.Id == 200));
        }

        // DELETE - When auction does not exist
        [Fact]
        public async Task DeleteAuction_ReturnsNotFound_WhenMissing()
        {
            // ARRANGE: Creates a DB, no auctions present.
            var db = CreateDb();
            var controller = new AuctionController(db);

            var auctioneer = TestDataFactory.CreateAuctioneer(20, "Jans");
            db.Auctioneers.Add(auctioneer);

            var auction = new Auction
            {
                Id = 200,
                AuctioneerId = auctioneer.Id,
                StartTime = DateTime.UtcNow,
                EndTime = DateTime.UtcNow.AddHours(1),
                Status = "Stopped",
            };

            db.Auctions.Add(auction);
            db.SaveChanges();

            // ASSERT: Check if exists in DB.
            // ACT: Retrieve all auctions.
            var result1 = await controller.GetAuctions(CancellationToken.None);

            // ASSERT: Expect one auction with both products.
            var ok = Assert.IsType<OkObjectResult>(result1.Result);
            var list = Assert.IsAssignableFrom<IEnumerable<AuctionDto>>(ok.Value);

            Assert.Single(list);

            // ACT: Attempts to Delete an Auction with an valid ID.
            var result2 = await controller.DeleteAuction(200, CancellationToken.None);
            Assert.IsType<NoContentResult>(result2);

            // ACT: Attempts to Delete an Auction with an invalid ID.
            var result3 = await controller.DeleteAuction(999, CancellationToken.None);

            // ASSERT: Result should be expected to be NotFound, HTTP 404.
            Assert.IsType<NotFoundResult>(result3);
        }
    }
}
