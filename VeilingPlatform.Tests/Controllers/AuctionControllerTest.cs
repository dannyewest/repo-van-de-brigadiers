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
        private DbConnect GetInMemoryDb()
        {
            var options = new DbContextOptionsBuilder<DbConnect>()
                .UseInMemoryDatabase(databaseName: "AuctionDb_" + System.Guid.NewGuid())
                .Options;

            return new DbConnect(options);
        }

        // CREATE PRODUCT
        private Product CreateProduct(int id, string name)
        {
            return new Product
            {
                Id = id,
                Name = name,
                Type = "Flower",
                PotSize = "Medium",
                Length = 20,
                Quantity = 5,
                Price = 1.5m,
                Supplier = "TestSupplier",
                ImageUrl = "img.jpg",
                ImageAlt = "alt",
                AuctionId = null,
            };
        }

        // CREATE AUCTIONEER
        private Auctioneer CreateAuctioneer(int id, string name)
        {
            return new Auctioneer { Id = id, Name = name };
        }

        // GET AUCTIONS
        [Fact]
        public async Task GetAuctions_ReturnsAllAuctions()
        {
            // ARRANGE
            var context = GetInMemoryDb();

            var auctioneer = CreateAuctioneer(1, "Piet");
            context.Auctioneers.Add(auctioneer);

            var p1 = CreateProduct(1, "Orchidee");
            var p2 = CreateProduct(2, "Tulp");

            var auction = new Auction
            {
                Id = 100,
                AuctioneerId = auctioneer.Id,
                StartTime = System.DateTime.UtcNow,
                EndTime = System.DateTime.UtcNow.AddHours(1),
                Status = "Scheduled",
                ProductList = new List<Product> { p1, p2 },
            };

            p1.AuctionId = auction.Id;
            p2.AuctionId = auction.Id;

            context.Auctions.Add(auction);
            context.SaveChanges();

            var controller = new AuctionController(context);

            // ACT
            var result = await controller.GetAuctions(CancellationToken.None);

            // ASSERT
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var list = Assert.IsAssignableFrom<IEnumerable<AuctionDto>>(ok.Value);

            Assert.Single(list);
            Assert.Equal(2, list.First().Products.Count);
        }

        // GET AUCTION BY ID
        [Fact]
        public async Task GetAuctionById_ReturnsAuction()
        {
            // ARRANGE
            var context = GetInMemoryDb();

            var auctioneer = CreateAuctioneer(1, "Hans");
            context.Auctioneers.Add(auctioneer);

            var p1 = CreateProduct(1, "Roos");

            var auction = new Auction
            {
                Id = 101,
                AuctioneerId = auctioneer.Id,
                StartTime = System.DateTime.UtcNow,
                EndTime = System.DateTime.UtcNow.AddHours(1),
                Status = "Running",
                ProductList = new List<Product> { p1 },
            };

            p1.AuctionId = auction.Id;

            context.Auctions.Add(auction);
            context.SaveChanges();

            var controller = new AuctionController(context);

            // ACT
            var result = await controller.GetAuctionById(101, CancellationToken.None);

            // ASSERT
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var dto = Assert.IsType<AuctionDto>(ok.Value);

            Assert.Equal(101, dto.Id);
            Assert.Single(dto.Products);
        }

        // CREATE AUCTION
        [Fact]
        public async Task CreateAuction_CreatesAuction_WhenValid()
        {
            // ARRANGE
            var context = GetInMemoryDb();
            var controller = new AuctionController(context);

            var auctioneer = CreateAuctioneer(5, "Kees");
            context.Auctioneers.Add(auctioneer);

            var p1 = CreateProduct(10, "Pioen");
            var p2 = CreateProduct(11, "Dahlia");

            context.Products.AddRange(p1, p2);
            context.SaveChanges();

            var dto = new CreateAuctionDto
            {
                AuctioneerId = auctioneer.Id,
                StartsAt = DateTime.UtcNow,
                EndsAt = DateTime.UtcNow.AddHours(2),
                Status = "Scheduled",
                Products = new List<AuctionProductInputDto>
                {
                    new AuctionProductInputDto { Id = p1.Id, MaxPrice = 5 },
                    new AuctionProductInputDto { Id = p2.Id, MaxPrice = 10 },
                },
            };

            // ACT
            var result = await controller.CreateAuction(dto, CancellationToken.None);

            // ASSERT
            var created = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returned = Assert.IsType<AuctionDto>(created.Value);

            Assert.Equal(2, returned.Products.Count);
            Assert.NotEqual(0, returned.Id);

            Assert.Equal(returned.Id, context.Products.First(p => p.Id == p1.Id).AuctionId);
        }

        // DELETE AUCTION
        [Fact]
        public async Task DeleteAuction_RemovesAuction()
        {
            // ARRANGE
            var context = GetInMemoryDb();

            var auctioneer = CreateAuctioneer(20, "Jans");
            context.Auctioneers.Add(auctioneer);

            var auction = new Auction
            {
                Id = 200,
                AuctioneerId = auctioneer.Id,
                StartTime = System.DateTime.UtcNow,
                EndTime = System.DateTime.UtcNow.AddHours(1),
                Status = "Stopped",
            };

            context.Auctions.Add(auction);
            context.SaveChanges();

            var controller = new AuctionController(context);

            // ACT
            var result = await controller.DeleteAuction(200, CancellationToken.None);

            // ASSERT
            Assert.IsType<NoContentResult>(result);
            Assert.False(context.Auctions.Any(a => a.Id == 200));
        }

        // DELETE NotFound
        [Fact]
        public async Task DeleteAuction_ReturnsNotFound_WhenDoesNotExist()
        {
            // ARRANGE
            var context = GetInMemoryDb();
            var controller = new AuctionController(context);

            // ACT
            var result = await controller.DeleteAuction(999, CancellationToken.None);

            // ASSERT
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
