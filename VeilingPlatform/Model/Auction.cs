using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VeilingPlatform.Model
{
    public class Auction
    {
        [Key]
        public int AuctionId { get; set; } // PK
        [Required]
        [ForeignKey(nameof(Auctioneer))]
        public int AuctioneerId { get; set; } // FK
        public Auctioneer Auctioneer { get; set; } // Navigeer
        public List<Product> ProductList { get; set; } = new List<Product>();
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        [MaxLength(50)]
        public string Status { get; set; }
    }
}
