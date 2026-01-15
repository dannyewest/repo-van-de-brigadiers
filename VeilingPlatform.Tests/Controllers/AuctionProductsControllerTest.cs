using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Controllers;
using VeilingPlatform.Data;
using VeilingPlatform.Model.Dto;
using Xunit;

namespace VeilingPlatform.Tests.Controllers
{
    public class AuctionProductsControllerTest
    {
        // Helper: Create in-memory DB for each test.
        private DbConnect CreateDb()
        {
            var options = new DbContextOptionsBuilder<DbConnect>()
                .UseInMemoryDatabase("AuctionProductsDb_" + Guid.NewGuid())
                .Options;

            return new DbConnect(options);
        }

        [Fact]
        public async Task GetAuctionProducts_ReturnsEmptyList_WhenNoProductsMatchAuction()
        {
            // ARRANGE: Create database with products not belonging to the requested auction.
            var db = CreateDb();

            db.Products.Add(TestDataFactory.CreateProductWithId(id: 1, name: "P1", auctionId: 99, quantity: 5, price: 10m));
            db.Products.Add(TestDataFactory.CreateProductWithId(id: 2, name: "P2", auctionId: 100, quantity: 5, price: 10m));
            db.SaveChanges();

            var controller = new AuctionProductsController(db);

            // ACT: Request products for an auction with no matching products.
            var result = await controller.GetAuctionProducts(1);

            // ASSERT: Should return Ok with an empty list.
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var list = Assert.IsAssignableFrom<IEnumerable<AuctionProductsDto>>(ok.Value);

            Assert.Empty(list);
        }

        [Fact]
        public async Task GetAuctionProducts_ReturnsOnlyProducts_ForGivenAuctionId_WithPositiveQuantity()
        {
            // ARRANGE: Create database with products for multiple auctions and different quantities.
            var db = CreateDb();

            // Should be returned (auction 1, qty > 0)
            db.Products.Add(TestDataFactory.CreateProductWithId(id: 1, name: "Rose", auctionId: 1, quantity: 5, price: 3.5m));
            db.Products.Add(TestDataFactory.CreateProductWithId(id: 2, name: "Tulip", auctionId: 1, quantity: 1, price: 2.0m));

            // Should be ignored (auction 1, qty == 0)
            db.Products.Add(TestDataFactory.CreateProductWithId(id: 3, name: "ZeroStock", auctionId: 1, quantity: 0, price: 9m));

            // Should be ignored (different auction)
            db.Products.Add(TestDataFactory.CreateProductWithId(id: 4, name: "OtherAuction", auctionId: 2, quantity: 10, price: 1m));

            db.SaveChanges();

            var controller = new AuctionProductsController(db);

            // ACT: Request products for auction 1.
            var result = await controller.GetAuctionProducts(1);

            // ASSERT: Should return Ok with only the 2 products that match auctionId and have Quantity > 0.
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var list = Assert.IsAssignableFrom<IEnumerable<AuctionProductsDto>>(ok.Value);

            Assert.Equal(2, list.Count()); // only Rose + Tulip

            var ids = list.Select(x => x.Id).ToList();
            Assert.Contains(1, ids);
            Assert.Contains(2, ids);
            Assert.DoesNotContain(3, ids); // zero stock excluded
            Assert.DoesNotContain(4, ids); // other auction excluded
        }

        [Fact]
        public async Task GetAuctionProducts_MapsFieldsCorrectly_BasePriceComesFromPrice()
        {
            // ARRANGE: Create database with one product for the auction.
            var db = CreateDb();

            var product = TestDataFactory.CreateProductWithId(id: 10, name: "Orchid", auctionId: 7, quantity: 3, price: 99.99m);
            product.Type = "Flower";
            product.PotSize = "Large";
            product.Length = 42;
            product.Supplier = "SupplierX";
            product.ImageUrl = "img.png";
            product.ImageAlt = "alt text";
            product.AuctionDate = DateTime.UtcNow;

            db.Products.Add(product);
            db.SaveChanges();

            var controller = new AuctionProductsController(db);

            // ACT: Request products for auction 7.
            var result = await controller.GetAuctionProducts(7);

            // ASSERT: DTO should map fields correctly (especially BasePrice = Price).
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var list = Assert.IsAssignableFrom<IEnumerable<AuctionProductsDto>>(ok.Value);

            var dto = Assert.Single(list);

            Assert.Equal(10, dto.Id);
            Assert.Equal("Orchid", dto.Name);
            Assert.Equal("Flower", dto.Type);
            Assert.Equal("Large", dto.PotSize);
            Assert.Equal(42, dto.Length);
            Assert.Equal(3, dto.Quantity);
            Assert.Equal(99.99m, dto.BasePrice); // BasePrice comes from Product.Price
            Assert.Equal("SupplierX", dto.Supplier);
            Assert.Equal(product.AuctionDate, dto.AuctionDate);
            Assert.Equal("img.png", dto.ImageUrl);
            Assert.Equal("alt text", dto.ImageAlt);
        }
    }
}
