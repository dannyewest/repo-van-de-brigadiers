using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Controllers;
using VeilingPlatform.Data;
using VeilingPlatform.Model;
using VeilingPlatform.Model.Dto;
using Xunit;

namespace VeilingPlatform.Tests.Controllers
{
    public class ProductEntityControllerTest
    {
        // Helper: Create in-memory Databasse for each test
        private DbConnect CreateDb()
        {
            var options = new DbContextOptionsBuilder<DbConnect>()
                .UseInMemoryDatabase("TestDb_" + Guid.NewGuid().ToString())
                .Options;

            return new DbConnect(options);
        }

        // Helper: Fake authenticated Supplier user
        // (Role normally comes from DB, but for tests we add it manually)
        private ClaimsPrincipal CreateSupplierUser(int id)
        {
            return new ClaimsPrincipal(
                new ClaimsIdentity(
                    new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, id.ToString()),
                        new Claim(ClaimTypes.Role, "Supplier"),
                    },
                    "TestAuth"
                )
            );
        }

        // GET /products Test - Returns all products
        [Fact]
        public async Task GetProducts_ReturnsAllProducts()
        {
            // ARRANGE: add two products to DB
            var db = CreateDb();
            db.Products.Add(TestDataFactory.CreateProduct("Product1"));
            db.Products.Add(TestDataFactory.CreateProduct("Product2"));
            db.SaveChanges();

            var controller = new ProductController(db);

            // ACT: Execute endpoint.
            var result = await controller.GetProducts();
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var items = Assert.IsAssignableFrom<IEnumerable<ProductDto>>(ok.Value);

            // ASSERT: Expect both products to be returned.
            Assert.Equal(2, items.Count());
        }

        // GET /products — should return empty list when DB is empty
        [Fact]
        public async Task GetProducts_ReturnsEmptyList_WhenNoProductsExist()
        {
            // ARRANGE: Create empty Database
            var db = CreateDb();
            var controller = new ProductController(db);

            // ACT: Execute endpoint
            var result = await controller.GetProducts();
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var items = Assert.IsAssignableFrom<IEnumerable<ProductDto>>(ok.Value);

            // ASSERT: Expect no products.
            Assert.Empty(items);
        }

        // GET /product/{id} - Returns single matching product
        [Fact]
        public async Task GetProduct_ReturnsProduct_WhenIdExists()
        {
            // ARRANGE: Insert a product so the ID exists in the database
            var db = CreateDb();
            var product = TestDataFactory.CreateProduct("UniqueItem");
            db.Products.Add(product);
            db.SaveChanges();

            var controller = new ProductController(db);

            // ACT: Request product by ID.
            var result = await controller.GetProduct(product.Id);
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var dto = Assert.IsType<ProductDto>(ok.Value);

            // ASSERT: The product should match the inserted one.
            Assert.Equal("UniqueItem", dto.Name);
        }

        // GET /product/{id} — should return 404 when product does not exist
        [Fact]
        public async Task GetProduct_ReturnsNotFound_WhenIdMissing()
        {
            // ARRANGE: Create empty Database
            var db = CreateDb();
            var controller = new ProductController(db);

            // ACT: Use an ID out of scope.
            var result = await controller.GetProduct(999);

            // ASSERT: Controller retuns a 'NotFound Error.'
            Assert.IsType<NotFoundResult>(result.Result);
        }

        // POST /product - Creates product when data is valid.
        [Fact]
        public async Task MakeProduct_CreatesProduct_WhenDataValid()
        {
            // ARRANGE: Insert a supplier and authenticate as that supplier
            var db = CreateDb();
            var supplier = TestDataFactory.CreateSupplier(1, "SupplierTest");
            db.Suppliers.Add(supplier);
            db.SaveChanges();

            var controller = new ProductController(db);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = CreateSupplierUser(1) },
            };

            var dto = TestDataFactory.CreateValidSupplierDto();

            // ACT: sumbit valid product request.
            var result = await controller.MakeProduct(dto);
            var created = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returned = Assert.IsType<ProductDto>(created.Value);

            // ASSERT: Product should stored and returned.
            Assert.Equal(dto.Name, returned.Name);
            Assert.Single(db.Products);
        }

        // POST /product — should fail when price is negative
        [Fact]
        public async Task MakeProduct_ReturnsBadRequest_WhenPriceNegative()
        {
            // ARRANGE: Create controller with invalid DTO.
            var db = CreateDb();
            var controller = new ProductController(db);

            var dto = TestDataFactory.CreateValidSupplierDto();
            dto.BasePrice = -10;

            // Fake user needed (otherwise Unauthorized)
            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext(),
            };

            // ACT: Attempt creating product with invalid price.
            var result = await controller.MakeProduct(dto);

            // ASSERT: Returns a BadRequest with fitting text.
            var bad = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Price cannot be negative.", bad.Value);
        }

        [Fact]
        public async Task MakeProduct_ReturnsUnauthorized_WhenUserNotLoggedIn()
        {
            // ARRANGE: Controller without authenticated user
            var db = CreateDb();
            var controller = new ProductController(db);

            var dto = TestDataFactory.CreateValidSupplierDto();

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext(), // No user -> triggers unauthorized.
            };

            // ACT: Attempt to create a product.
            var result = await controller.MakeProduct(dto);

            // ASSERT: Should return unauthorized.
            Assert.IsType<UnauthorizedObjectResult>(result.Result);
        }

        [Fact]
        public async Task MakeProduct_ReturnsUnauthorized_WhenUserIsNotSupplier()
        {
            // ARRANGE: Controller with an authenticated non-supplier.
            var db = CreateDb();
            var controller = new ProductController(db);

            // Fake CUSTOMER user (invalid)
            var user = new ClaimsPrincipal(
                new ClaimsIdentity(
                    new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, "1"),
                        new Claim(ClaimTypes.Role, "Customer"), // unauthorized role.
                    },
                    "TestAuth"
                )
            );

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user },
            };

            var dto = TestDataFactory.CreateValidSupplierDto();

            // ACT: Attempt to create product with invalid role.
            var result = await controller.MakeProduct(dto);

            // ASSERT: Should return Unathorized with a role specific message.
            var unauth = Assert.IsType<UnauthorizedObjectResult>(result.Result);
            Assert.Equal("Only suppliers can create products.", unauth.Value);
        }

        [Fact]
        public async Task MakeProduct_ReturnsBadRequest_WhenModelStateInvalid()
        {
            // ARRANGE: Valid supplier and authenticated user.
            var db = CreateDb();

            // Supplier must exist for auth to pass
            db.Suppliers.Add(new Supplier { Id = 1, Name = "SupplierTest" });
            db.SaveChanges();

            var controller = new ProductController(db);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = CreateSupplierUser(1) },
            };

            var dto = TestDataFactory.CreateValidSupplierDto();
            dto.Name = ""; // invalid dto.

            controller.ModelState.AddModelError(
                nameof(ProductSupplierDto.Name),
                "Name is required"
            );

            // ACT: Sumbit invalid product.
            var result = await controller.MakeProduct(dto);

            // ASSERT: Should return a BadRequest due to invalid DTO.
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        // PUT /Product/{id}
        [Fact]
        public async Task UpdateProduct_ReturnsNoContent_WhenSuccess()
        {
            // ARRANGE: Insert and already exisiting product.
            var db = CreateDb();
            var controller = new ProductController(db);

            var product = TestDataFactory.CreateProduct("Original");
            db.Products.Add(product);
            db.SaveChanges();

            // updated dto
            var dto = TestDataFactory.CreateValidSupplierDto();
            dto.Name = "Updated";

            // ACT: perform update on existing product.
            var result = await controller.UpdateProduct(product.Id, dto);

            // ASSERT: Expect http request 204 -> database value updated.
            Assert.IsType<NoContentResult>(result);
            Assert.Equal("Updated", db.Products.First().Name);
        }

        [Fact]
        public async Task UpdateProduct_ReturnsBadRequest_WhenIdInvalid()
        {
            // ARRANGE: ID = 0 is invalid input.
            var db = CreateDb();
            var controller = new ProductController(db);

            var dto = TestDataFactory.CreateValidSupplierDto();

            // ACT
            var result = await controller.UpdateProduct(0, dto);

            // ASSERT: Controller rejects invalid ID, making no changes occur.
            var bad = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid ID.", bad.Value);
        }

        [Fact]
        public async Task UpdateProduct_ReturnsNotFound_WhenProductMissing()
        {
            // ARRANGE: ID 999 cannot be found.
            var db = CreateDb();
            var controller = new ProductController(db);

            var dto = TestDataFactory.CreateValidSupplierDto();

            // ACT
            var result = await controller.UpdateProduct(999, dto);

            // ASSERT: Expected to return Not Found (non-existing).
            Assert.IsType<NotFoundResult>(result);
        }

        // DELETE
        [Fact]
        public async Task DeleteProduct_RemovesProduct_WhenExists()
        {
            // ARRANGE: Insert a product so the delete endpoint has a valid target.
            var db = CreateDb();
            var product = TestDataFactory.CreateProduct("DeleteMe");
            db.Products.Add(product);
            db.SaveChanges();

            var controller = new ProductController(db);

            // ACT: Attempts to delete existing controller.
            var result = await controller.DeleteProduct(product.Id);

            // ASSERT: Should return Request 200 OK and removes the product.
            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Empty(db.Products);
        }

        [Fact]
        public async Task DeleteProduct_ReturnsNotFound_WhenMissing()
        {
            // ARRANGE: Deleteing non-existing product ID 999.
            var db = CreateDb();
            var controller = new ProductController(db);

            // ACT: Attempts to delete non-existent.
            var result = await controller.DeleteProduct(999);

            // ASSERT: Returns Error 404 with text about missing ID.
            var nf = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Contains("999", nf.Value.ToString());
        }

        // GET available products
        [Fact]
        public async Task GetAvailableProducts_ReturnsItems_WhenAuctionIdNull()
        {
            // ARRANGE: Add two products, onw tih auctionId, one without.
            var db = CreateDb();
            db.Products.Add(TestDataFactory.CreateProduct("P1", auctionId: null));
            db.Products.Add(TestDataFactory.CreateProduct("P2", auctionId: 5));
            db.SaveChanges();

            var controller = new ProductController(db);

            // ACT: Retrieve available products when no auctionId filter is applied.
            var result = await controller.GetAvailableProducts(null, CancellationToken.None);

            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var list = Assert.IsAssignableFrom<IEnumerable<SimpleProductDto>>(ok.Value);

            // ASSERT → should include only P1 due to having no auctionId.
            Assert.Single(list);
            Assert.Contains(list, p => p.Name == "P1");
        }

        [Fact]
        public async Task GetAvailableProducts_ReturnsMatchingAuctionId()
        {
            // ARRANGE: Insert products into different  auctions.
            var db = CreateDb();
            db.Products.Add(TestDataFactory.CreateProduct("P1", auctionId: 3));
            db.Products.Add(TestDataFactory.CreateProduct("P2", auctionId: 3));
            db.Products.Add(TestDataFactory.CreateProduct("P3", auctionId: 5));
            db.SaveChanges();

            var controller = new ProductController(db);

            // ACT: Retrieve prodcuts filteren by auctionId 3
            var result = await controller.GetAvailableProducts(3, CancellationToken.None);

            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var list = Assert.IsAssignableFrom<IEnumerable<SimpleProductDto>>(ok.Value);

            // ASSERT → two products in auctionId=3 should be returned.
            Assert.Equal(2, list.Count());
        }

        [Fact]
        public async Task GetProducts_IncludesAuctionDate_SoSupplierCanFilterByDate()
        {
            // ARRANGE: Add products with different auction dates.
            var db = CreateDb();

            var p1 = TestDataFactory.CreateProduct("P1");
            p1.AuctionDate = new DateTime(2026, 01, 10);

            var p2 = TestDataFactory.CreateProduct("P2");
            p2.AuctionDate = new DateTime(2026, 01, 11);

            db.Products.AddRange(p1, p2);
            db.SaveChanges();

            var controller = new ProductController(db);

            // ACT: Retrieve all products (overview).
            var result = await controller.GetProducts();

            // ASSERT: Response contains products with correct AuctionDate, enabling date filtering in the overview.
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var items = Assert.IsAssignableFrom<IEnumerable<ProductDto>>(ok.Value);

            Assert.Equal(2, items.Count());
            Assert.Contains(
                items,
                x => x.Name == "P1" && x.AuctionDate.Date == new DateTime(2026, 01, 10)
            );
            Assert.Contains(
                items,
                x => x.Name == "P2" && x.AuctionDate.Date == new DateTime(2026, 01, 11)
            );

            // ASSERT: Example client-side filter by date returns only matching products.
            var filtered = items
                .Where(x => x.AuctionDate.Date == new DateTime(2026, 01, 10))
                .ToList();
            Assert.Single(filtered);
            Assert.Equal("P1", filtered[0].Name);
        }
    }
}
