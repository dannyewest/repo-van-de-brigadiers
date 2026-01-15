using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Controllers;
using VeilingPlatform.Data;
using VeilingPlatform.Model;
using Xunit;

namespace VeilingPlatform.Tests.Controllers
{
    public class UserControllerTest
    {
        // Helper: Create in-memory DB for each test.
        private DbConnect CreateDb()
        {
            var options = new DbContextOptionsBuilder<DbConnect>()
                .UseInMemoryDatabase("UserDb_" + Guid.NewGuid())
                .Options;

            return new DbConnect(options);
        }

        // GET /auctioneers
        [Fact]
        public async Task GetAuctioneers_ReturnsAllAuctioneers()
        {
            // ARRANGE: Create database with multiple users of different types.
            var db = CreateDb();

            // Two auctioneers shoul be returned.
            db.Users.Add(new Auctioneer { Id = 1, Name = "Piet" });
            db.Users.Add(new Auctioneer { Id = 2, Name = "Hans" });

            // Supplier should be ignored
            db.Users.Add(new Supplier { Id = 3, Name = "SupplierX" }); // should be ignored

            db.SaveChanges();

            var controller = new UserController(db);

            // ACT: request all auctioneers
            var result = await controller.GetAuctioneers();

            // ASSERT: Expected only auctioneers are returned.
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var list = Assert.IsAssignableFrom<IEnumerable<UserOutPutDto>>(ok.Value);

            Assert.Equal(2, list.Count());
        }

        [Fact]
        public async Task GetAuctioneers_ReturnsEmptyList_WhenNoneExist()
        {
            // ARRANGE: Database contains users, but no auctioneers.
            var db = CreateDb();

            // Only suppliers exist and should be ignored.
            db.Users.Add(new Supplier { Id = 1, Name = "SupplierOnly" });
            db.SaveChanges();

            var controller = new UserController(db);

            // ACT: Request auctioneers.
            var result = await controller.GetAuctioneers();

            // ASSERT: No auctioneers are expected to be returned.
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var list = Assert.IsAssignableFrom<IEnumerable<UserOutPutDto>>(ok.Value);

            Assert.Empty(list);
        }

        // GET /suppliers
        [Fact]
        public async Task GetSuppliers_ReturnsAllSuppliers()
        {
            // ARRANGE: Database contains multiple suppliers and a non-supplier user.
            var db = CreateDb();

            db.Users.Add(new Supplier { Id = 1, Name = "SupplierA" });
            db.Users.Add(new Supplier { Id = 2, Name = "SupplierB" });
            db.Users.Add(new Auctioneer { Id = 3, Name = "AuctioneerX" }); // should be ignored

            db.SaveChanges();

            var controller = new UserController(db);

            // ACT: Request all suppliers.
            var result = await controller.GetSuppliers();

            // ASSERT: Only suppliers should be returned.
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var list = Assert.IsAssignableFrom<IEnumerable<UserOutPutDto>>(ok.Value);

            Assert.Equal(2, list.Count());
        }

        [Fact]
        public async Task GetSuppliers_ReturnsEmptyList_WhenNoneExist()
        {
            // ARRANGE: Database contains no suppliers.
            var db = CreateDb();
            db.Users.Add(new Auctioneer { Id = 1, Name = "AuctioneerOnly" });
            db.SaveChanges();

            var controller = new UserController(db);

            // ACT: Request all suppliers.
            var result = await controller.GetSuppliers();

            // ASSERT: No suppliers expected.
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            var list = Assert.IsAssignableFrom<IEnumerable<UserOutPutDto>>(ok.Value);

            Assert.Empty(list);
        }
    }
}
