using Microsoft.EntityFrameworkCore;

namespace VeilingPlatform.Model
{
    public class ProductSold
    {
        public int ProductSoldId { get; set; } // PK

        public int BuyerId { get; set; } // FK
        public User Buyer { get; set; }

        public int ProductId { get; set; } // FK
        public Product Product { get; set; }

        public DateTime DateSold { get; set; }
        [Precision(10,2)]
        public decimal PriceSold { get; set; }

        public int Amount { get; set; }

        public ProductSold() { }

        public ProductSold(User buyer, Product product, DateTime dateSold, decimal priceSold)
        {
            Buyer = buyer;
            Product = product;
            DateSold = dateSold;
            PriceSold = priceSold;
        }
    }
}
