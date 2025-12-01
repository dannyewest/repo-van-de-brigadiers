using System;

namespace VeilingPlatform.Model.Dto
{
    public class ProductSoldDto
    {
        public int Id { get; set; }
        public int BuyerId { get; set; }
        public string BuyerName { get; set; } = string.Empty;

        public int ProductId { get; set; }
        public DateTime DateSold { get; set; }
        public decimal PriceSold { get; set; }
    }

    public class AuctionProductSoldDto
    {
        public int Id { get; set; }
        public int BuyerId { get; set; }
        public int ProductId { get; set; }
        public DateTime DateSold { get; set; }
        public decimal PriceSold { get; set; }
    }
}
