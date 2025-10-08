// Data Transfer Object
namespace VeilingPlatform.Model.Dto
{
    public class ProductDto
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string PotSize { get; set; }
        public double Length { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string Supplier { get; set; }
        public DateTime AuctionDate { get; set; }
        public int AuctionId { get; set; }
    }
}
