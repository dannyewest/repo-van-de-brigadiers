using VeilingPlatform.Model;
using VeilingPlatform.Model.Dto;

namespace VeilingPlatform.Tests
{
    public static class TestDataFactory
    {
        // Valid Product DTO (POST/PUT)
        public static ProductSupplierDto CreateValidSupplierDto()
        {
            return new ProductSupplierDto
            {
                Name = "TestFlower",
                Type = "Flower",
                PotSize = "Medium",
                Length = 25,
                Quantity = 10,
                BasePrice = 3.5m,
                AuctionDate = DateTime.UtcNow,
                Image = "test.png",
                ImageAlt = "flower",
                Location = "A1"
            };
        }

        // Supplier entity
        public static Supplier CreateSupplier(int id, string name = "SupplierOne")
        {
            return new Supplier
            {
                Id = id,
                Name = name
            };
        }

        // Product entity 
        public static Product CreateProduct(
            string name,
            int? auctionId = null,
            int quantity = 10,
            decimal price = 5.0m
        )
        {
            return new Product
            {
                Name = name,
                Type = "Flower",
                PotSize = "Medium",
                Length = 20,
                Quantity = quantity,
                Price = price,
                Supplier = "TestSupplier",
                AuctionId = auctionId,
                AuctionDate = DateTime.UtcNow,
                ImageUrl = "test.png",
                ImageAlt = "flower",
                Location = "A1"
            };
        }
    }
}
