using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Controllers;
using VeilingPlatform.Data;
using VeilingPlatform.Model;
using VeilingPlatform.Model.Dto;
using Xunit;

namespace VeilingPlatform.Tests.Controllers
{
    public class ProductSoldControllerTest
    {
        // Helper: Create in-memory DB for each test.
        private DbConnect CreateDb()
        {
            var options = new DbContextOptionsBuilder<DbConnect>()
                .UseInMemoryDatabase("ProductSoldDb_" + Guid.NewGuid())
                .Options;

            return new DbConnect(options);
        }

        [Fact]
        public async Task GetSoldProducts_ReturnsEmptyList_WhenNoneExist()
        {
            // ARRANGE: Create empty database without sold products.
            var db = CreateDb();
            var controller = new ProductSoldController(db);

            // ACT: Request all sold products.
            var result = await controller.GetSoldProducts();

            // ASSERT: Should return Ok with an empty list.
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var list = Assert.IsAssignableFrom<IEnumerable<ProductSoldDto>>(ok.Value);

            Assert.Empty(list);
        }

        [Fact]
        public async Task GetSoldProducts_ReturnsBuyerName_WhenBuyerExists()
        {
            // ARRANGE: Create database with a buyer and a sold product linked to that buyer.
            var db = CreateDb();

            var buyer = new Customer { Id = 10, Name = "Danny" };
            db.Users.Add(buyer);

            db.ProductSold.Add(
                new ProductSold
                {
                    ProductSoldId = 1,
                    BuyerId = buyer.Id,
                    Buyer = buyer, // important: make sure navigation is populated
                    ProductId = 99,
                    DateSold = DateTime.UtcNow,
                    PriceSold = 50m,
                    Amount = 1,
                }
            );

            db.SaveChanges();

            var controller = new ProductSoldController(db);

            // ACT: Request all sold products.
            var result = await controller.GetSoldProducts();

            // ASSERT: Should return Ok and map BuyerName to the buyer's Name.
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var list = Assert.IsAssignableFrom<IEnumerable<ProductSoldDto>>(ok.Value);

            var item = Assert.Single(list);
            Assert.Equal(10, item.BuyerId);
            Assert.Equal("Danny", item.BuyerName); // should fetch buyer name
        }

        [Fact]
        public async Task GetSoldProducts_ReturnsBuyerName_WhenBuyerIsLinked()
        {
            // ARRANGE: Seed a buyer + productSold, then request sold products.
            var db = CreateDb();

            var buyer = new Customer { Id = 10, Name = "Danny" };
            db.Users.Add(buyer);

            db.ProductSold.Add(
                new ProductSold
                {
                    ProductSoldId = 1,
                    BuyerId = buyer.Id,
                    Buyer = buyer,
                    ProductId = 99,
                    DateSold = DateTime.UtcNow,
                    PriceSold = 50m,
                    Amount = 1,
                }
            );

            db.SaveChanges();

            var controller = new ProductSoldController(db);

            // ACT: Request all sold products.
            var result = await controller.GetSoldProducts();

            // ASSERT: BuyerName should be returned as the buyer's name.
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var list = Assert.IsAssignableFrom<IEnumerable<ProductSoldDto>>(ok.Value);

            var item = Assert.Single(list);
            Assert.Equal("Danny", item.BuyerName);
        }

        [Fact]
        public async Task CreateProductSold_ReturnsNotFound_WhenProductDoesNotExist()
        {
            // ARRANGE: Create database without the referenced product.
            var db = CreateDb();
            var controller = new ProductSoldController(db);

            var dto = new AuctionProductSoldDto
            {
                BuyerId = 1,
                ProductId = 999, // does not exist
                PriceSold = 100m,
                Amount = 1,
            };

            // ACT: Attempt to create ProductSold for a non-existing product.
            var result = await controller.CreateProductSold(dto);

            // ASSERT: Should return NotFound with message.
            var notFound = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal("Product not found.", notFound.Value);
        }

        [Fact]
        public async Task CreateProductSold_ReturnsBadRequest_WhenAmountIsZeroOrLess()
        {
            // ARRANGE: Create database with an existing product.
            var db = CreateDb();

            db.Products.Add(
                TestDataFactory.CreateProductWithId(
                    id: 1,
                    name: "Rose",
                    auctionId: null,
                    quantity: 5,
                    price: 10m
                )
            );

            db.SaveChanges();

            var controller = new ProductSoldController(db);

            var dto = new AuctionProductSoldDto
            {
                BuyerId = 1,
                ProductId = 1,
                PriceSold = 10m,
                Amount = 0,
            };

            // ACT: Attempt to create ProductSold with invalid amount.
            var result = await controller.CreateProductSold(dto);

            // ASSERT: Should return BadRequest with message.
            var bad = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Amount must be greater than zero.", bad.Value);
        }

        [Fact]
        public async Task CreateProductSold_ReturnsBadRequest_WhenAmountExceedsStock()
        {
            // ARRANGE: Create database with a product with limited stock.
            var db = CreateDb();

            db.Products.Add(
                TestDataFactory.CreateProductWithId(
                    id: 1,
                    name: "Tulip",
                    auctionId: null,
                    quantity: 2,
                    price: 10m
                )
            );

            db.SaveChanges();

            var controller = new ProductSoldController(db);

            var dto = new AuctionProductSoldDto
            {
                BuyerId = 1,
                ProductId = 1,
                PriceSold = 10m,
                Amount = 3, // more than stock
            };

            // ACT: Attempt to create ProductSold with insufficient stock.
            var result = await controller.CreateProductSold(dto);

            // ASSERT: Should return BadRequest with stock message.
            var bad = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Contains("Insufficient stock", bad.Value!.ToString()); // should mention insufficient stock
        }

        [Fact]
        public async Task CreateProductSold_ReturnsBadRequest_WhenBidIsTooLow()
        {
            // ARRANGE: Create database with a product and a minimum price.
            var db = CreateDb();

            db.Products.Add(
                TestDataFactory.CreateProductWithId(
                    id: 1,
                    name: "Orchid",
                    auctionId: null,
                    quantity: 10,
                    price: 50m
                )
            );

            db.SaveChanges();

            var controller = new ProductSoldController(db);

            var dto = new AuctionProductSoldDto
            {
                BuyerId = 1,
                ProductId = 1,
                PriceSold = 49m, // too low
                Amount = 1,
            };

            // ACT: Attempt to create ProductSold with a too low bid.
            var result = await controller.CreateProductSold(dto);

            // ASSERT: Should return BadRequest with minimum price message.
            var bad = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Contains("to low", bad.Value!.ToString()); // should indicate bid too low
        }

        [Fact]
        public async Task CreateProductSold_ReturnsOk_AndUpdatesStock_AndCreatesRecord()
        {
            // ARRANGE: Create database with a product that has enough stock.
            var db = CreateDb();

            db.Products.Add(
                TestDataFactory.CreateProductWithId(
                    id: 1,
                    name: "Lily",
                    auctionId: null,
                    quantity: 10,
                    price: 25m
                )
            );

            db.SaveChanges();

            var controller = new ProductSoldController(db);

            var dto = new AuctionProductSoldDto
            {
                BuyerId = 7,
                ProductId = 1,
                PriceSold = 30m,
                Amount = 3,
            };

            // ACT: Create ProductSold with valid data.
            var result = await controller.CreateProductSold(dto);

            // ASSERT: Should return Ok and reduce product stock + create ProductSold record.
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            Assert.NotNull(ok.Value); // should contain response object

            var updatedProduct = await db.Products.FindAsync(1);
            Assert.NotNull(updatedProduct); // product should exist
            Assert.Equal(7, updatedProduct!.Quantity); // 10 - 3 = 7

            var soldList = await db.ProductSold.ToListAsync();
            var sold = Assert.Single(soldList); // should create exactly 1 record

            Assert.Equal(dto.BuyerId, sold.BuyerId);
            Assert.Equal(dto.ProductId, sold.ProductId);
            Assert.Equal(dto.PriceSold, sold.PriceSold);
            Assert.Equal(dto.Amount, sold.Amount);
            Assert.True(sold.DateSold > DateTime.UtcNow.AddMinutes(-2));
        }

        [Fact]
        public async Task CreateProductSold_ReturnsOk_WithCorrectNewStock_InResponse()
        {
            // ARRANGE: Create database with a product that has enough stock.
            var db = CreateDb();

            db.Products.Add(
                TestDataFactory.CreateProductWithId(
                    id: 1,
                    name: "Lily",
                    auctionId: null,
                    quantity: 10,
                    price: 25m
                )
            );
            db.SaveChanges();

            var controller = new ProductSoldController(db);

            var dto = new AuctionProductSoldDto
            {
                BuyerId = 7,
                ProductId = 1,
                PriceSold = 30m,
                Amount = 3,
            };

            // ACT: Create ProductSold with valid data.
            var result = await controller.CreateProductSold(dto);

            // ASSERT: Should return Ok and include NewStock = 7.
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            Assert.NotNull(ok.Value);

            var newStockProp = ok.Value.GetType().GetProperty("NewStock");
            Assert.NotNull(newStockProp);

            var newStock = (int)newStockProp!.GetValue(ok.Value)!;
            Assert.Equal(7, newStock);
        }

        [Fact]
        public async Task CreateProductSold_ReturnsBadRequest_WithAvailableQuantity_WhenAmountExceedsStock()
        {
            // ARRANGE: Create database with a product with limited stock.
            var db = CreateDb();

            db.Products.Add(
                TestDataFactory.CreateProductWithId(
                    id: 1,
                    name: "Tulip",
                    auctionId: null,
                    quantity: 2,
                    price: 10m
                )
            );
            db.SaveChanges();

            var controller = new ProductSoldController(db);

            var dto = new AuctionProductSoldDto
            {
                BuyerId = 1,
                ProductId = 1,
                PriceSold = 10m,
                Amount = 3,
            };

            // ACT: Attempt to create ProductSold with insufficient stock.
            var result = await controller.CreateProductSold(dto);

            // ASSERT: Error should include the available quantity.
            var bad = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Contains("Insufficient stock", bad.Value!.ToString());
            Assert.Contains("Available quantity: 2", bad.Value!.ToString());
        }
    }
}
