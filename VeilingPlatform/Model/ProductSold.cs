using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
namespace VeilingPlatform.Model

{
    public class ProductSold
    {
        [Key, Column(Order = 0)]
        public User Buyer { get; set; }

        [Key, Column(Order = 1)]
        public Product Product { get; set; }

        [Required]
        public DateTime DateSold { get; set; }

        [Required]
        [Precision(10, 2)]
        public decimal PriceSold { get; set; }

        public ProductSold(User buyer, Product product, DateTime dateSold, decimal priceSold)
        {
            Buyer = buyer;
            Product = product;
            DateSold = dateSold;
            PriceSold = priceSold;
        }
    }
}
