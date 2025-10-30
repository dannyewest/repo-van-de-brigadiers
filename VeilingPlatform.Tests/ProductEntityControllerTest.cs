using Xunit;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Controllers;
using VeilingPlatform.Data;
using VeilingPlatform.Model;
using VeilingPlatform.Model.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VeilingPlatform.Tests
{
    public class ProductEntityControllerTest
    {
        private DbConnect GetInMemoryDb()
        {
            var options = new DbContextOptionsBuilder<DbConnect>()
                .UseInMemoryDatabase(databaseName: "TestDb_" + System.Guid.NewGuid())
                .Options;

            return new DbConnect(options);
        }

        [Fact]
        public async Task TestGetProductsFunctionReturnsAllProducts()
        {
            var context = GetInMemoryDb();

            context.Products.AddRange(
                new Product
                {
                    name = "Tulp",
                    Type = "Bloem",
                    PotSize = "Middel",
                    Length = 20,
                    Quantity = 10,
                    price = 2.5m,
                    supplier = "GroenKweker"
                },
                new Product
                {
                    name = "Roos",
                    Type = "Bloem",
                    PotSize = "Klein",
                    Length = 15,
                    Quantity = 5,
                    price = 1.5m,
                    supplier = "BloemenBoerderij"
                }
            );
            context.SaveChanges();

            var controller = new ProductEntityController(context);

            var result = await controller.GetProducts();

            var actionResult = Assert.IsType<ActionResult<IEnumerable<ProductDto>>>(result);
            var products = Assert.IsAssignableFrom<IEnumerable<ProductDto>>(actionResult.Value);

            Assert.Equal(2, products.Count());
            Assert.Contains(products, p => p.Name == "Tulp");
            Assert.Contains(products, p => p.Name == "Roos");
        }

        [Fact]
        public async Task TestCreateProductAddsProductToDatabase()
        {
            var context = GetInMemoryDb();
            var controller = new ProductEntityController(context);

            var newProductDto = new ProductDto
            {
                Name = "Lelie",
                Type = "Bloem",
                PotSize = "Groot",
                Length = 25,
                Quantity = 8,
                Price = 3.0m,
                Supplier = "BloemenTuin",
                AuctionDate = default,
                AuctionId = 0
            };

            var result = await controller.CreateProduct(newProductDto);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedDto = Assert.IsType<ProductDto>(createdResult.Value);

            Assert.Equal("Lelie", returnedDto.Name);
            Assert.Equal(1, context.Products.Count());

            var productInDb = context.Products.First();
            Assert.Equal("Lelie", productInDb.name);
            Assert.Equal("Bloem", productInDb.Type);
            Assert.Equal("Groot", productInDb.PotSize);
            Assert.Equal(25, productInDb.Length);
            Assert.Equal(8, productInDb.Quantity);
            Assert.Equal(3.0m, productInDb.price);
            Assert.Equal("BloemenTuin", productInDb.supplier);
        }

        [Fact]
        public async Task TestCreateProductGetsErrorWhenNameFieldIsMissing()
        {
            var context = GetInMemoryDb();
            var controller = new ProductEntityController(context);

            var newProductDto = new ProductDto
            {
                Name = "",
                Type = "Bloem",
                PotSize = "Groot",
                Length = 25,
                Quantity = 8,
                Price = 3.0m,
                Supplier = "BloemenTuin",
                AuctionDate = default,
                AuctionId = 0
            };

            controller.ModelState.AddModelError("Name", "Naam is leeg");

            var result = await controller.CreateProduct(newProductDto);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal(StatusCodes.Status400BadRequest, badRequestResult.StatusCode);

            var modelState = Assert.IsType<SerializableError>(badRequestResult.Value);
            Assert.True(modelState.ContainsKey("Name"));

            var errors = modelState["Name"] as string[];
            Assert.Contains("Naam is leeg", errors);
        }

        [Fact]
        public async Task TestProductCanBeDeleted()
        {
            var context = GetInMemoryDb();

            var product = new Product
            {
                name = "Tulp",
                Type = "Bloem",
                PotSize = "Middel",
                Length = 20,
                Quantity = 10,
                price = 2.5m,
                supplier = "GroenKweker",
                auctionDate = default,
                AuctionId = 0
            };

            context.Products.Add(product);
            context.SaveChanges();

            var controller = new ProductEntityController(context);

            var result = await controller.DeleteProduct(product.id);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<Dictionary<string, string>>(okResult.Value);

            Assert.Equal("Product is succesvol verwijderd.", response["message"]);
            Assert.Empty(context.Products);
        }
        
         [Fact]
        public async Task TestDeleteProductReturnsNotFoundMessageWhenProductDoesntExist()
        {
            var context = GetInMemoryDb();
            var controller = new ProductEntityController(context);

            var result = await controller.DeleteProduct(999);

            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var response = Assert.IsType<Dictionary<string, string>>(notFoundResult.Value);

            Assert.Equal("Product met ID 999 is niet gevonden.", response["message"]);            
            Assert.Equal(StatusCodes.Status404NotFound, notFoundResult.StatusCode);
        }
    }
}