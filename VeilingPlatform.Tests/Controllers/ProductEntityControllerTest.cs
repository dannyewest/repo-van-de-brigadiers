using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Controllers;
using VeilingPlatform.Data;
using VeilingPlatform.Model;
using VeilingPlatform.Model.Dto;
using Microsoft.AspNetCore.Mvc;

namespace VeilingPlatform.Tests
{
    public class ProductControllerTest
    {
        private DbConnect GetInMemoryDb()
        {
            var options = new DbContextOptionsBuilder<DbConnect>()
                .UseInMemoryDatabase("TestDb_" + System.Guid.NewGuid())
                .Options;

            return new DbConnect(options);
        }

        // GET PRODUCTS
        [Fact]
        public async Task GetProducts_ReturnsAllProducts()
        {
            // ARRANGE
            var db = GetInMemoryDb();

            db.Products.Add(new Product
            {
                Name = "Tulp",
                Type = "Bloem",
                PotSize = "Middel",
                Length = 20,
                Quantity = 10,
                Price = 2.5m,
                Supplier = "Kweker1"
            });

            db.Products.Add(new Product
            {
                Name = "Roos",
                Type = "Bloem",
                PotSize = "Klein",
                Length = 15,
                Quantity = 5,
                Price = 1.5m,
                Supplier = "Kweker2"
            });

            db.SaveChanges();

            var controller = new ProductController(db);

            // ACT
            var result = await controller.GetProducts();
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var products = Assert.IsAssignableFrom<IEnumerable<ProductDto>>(ok.Value);

            // ASSERT
            Assert.Equal(2, products.Count());
            Assert.Contains(products, p => p.Name == "Tulp");
            Assert.Contains(products, p => p.Name == "Roos");
        }

        // POST / MAKE PRODUCT
        [Fact]
        public async Task MakeProduct_AddsProductToDatabase()
        {
            // ARRANGE
            var db = GetInMemoryDb();
            var controller = new ProductController(db);

            var dto = new ProductSupplierDto
            {
                Name = "Lelie",
                Type = "Bloem",
                PotSize = "Groot",
                Length = 25,
                Quantity = 8,
                BasePrice = 3.0m,
                Supplier = "Bloementuin",
                AuctionDate = System.DateTime.UtcNow,
                Image = "img.png",
                ImageAlt = "alt text"
            };

            // ACT
            var result = await controller.MakeProduct(dto);

            // ASSERT
            var created = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returned = Assert.IsType<ProductDto>(created.Value);

            Assert.Equal("Lelie", returned.Name);
            Assert.Single(db.Products);

            var product = db.Products.First();

            Assert.Equal("Lelie", product.Name);
            Assert.Equal("Bloem", product.Type);
            Assert.Equal("Groot", product.PotSize);
            Assert.Equal(25, product.Length);
            Assert.Equal(8, product.Quantity);
            Assert.Equal(3.0m, product.Price);
            Assert.Equal("Bloementuin", product.Supplier);
        }

        // BAD POST (NAME MISSING)
        [Fact]
        public async Task MakeProduct_ReturnsBadRequest_WhenNameIsMissing()
        {
            // ARRANGE
            var db = GetInMemoryDb();
            var controller = new ProductController(db);

            var dto = new ProductSupplierDto
            {
                Name = "",
                Type = "Bloem",
                PotSize = "Groot",
                Length = 20,
                Quantity = 8,
                BasePrice = 2.0m,
                Supplier = "Kweker"
            };

            controller.ModelState.AddModelError("Name", "Naam is leeg");

            // ACT
            var result = await controller.MakeProduct(dto);

            // ASSERT
            var bad = Assert.IsType<BadRequestObjectResult>(result.Result);
            var modelState = Assert.IsType<SerializableError>(bad.Value);

            Assert.True(modelState.ContainsKey("Name"));
        }

        // DELETE PRODUCT
        [Fact]
        public async Task DeleteProduct_RemovesProduct()
        {
            // ARRANGE
            var db = GetInMemoryDb();
            var product = new Product
            {
                Name = "Tulp",
                Type = "Bloem",
                PotSize = "Middel",
                Length = 20,
                Quantity = 10,
                Price = 2.5m,
                Supplier = "Kweker"
            };

            db.Products.Add(product);
            db.SaveChanges();

            var controller = new ProductController(db);

            // ACT
            var result = await controller.DeleteProduct(product.Id);

            // ASSERT
            var ok = Assert.IsType<OkObjectResult>(result);

            var value = ok.Value;
            var prop = value.GetType().GetProperty("message");
            Assert.NotNull(prop);
            var message = prop.GetValue(value)?.ToString();

            Assert.Equal("Product is succesvol verwijderd.", message);
            Assert.Empty(db.Products);
        }

        // DELETE PRODUCT NOT FOUND
        [Fact]
        public async Task DeleteProduct_ReturnsNotFound_WhenDoesNotExist()
        {
            // ARRANGE
            var db = GetInMemoryDb();
            var controller = new ProductController(db);

            // ACT
            var result = await controller.DeleteProduct(99);

            // ASSERT
            var nf = Assert.IsType<NotFoundObjectResult>(result);

            var value = nf.Value;
            var prop = value.GetType().GetProperty("message");
            Assert.NotNull(prop);
            var message = prop.GetValue(value)?.ToString();

            Assert.Equal("Product met ID 99 is niet gevonden.", message);
        }

    }
}
