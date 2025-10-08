using System;
using Microsoft.EntityFrameworkCore;

namespace AuctionApp
{
    public class Auction
    {
        public int AuctionId { get; set; } // PK
        public int AuctioneerId { get; set; } // FK
        public Auctioneer Auctioneer { get; set; } // Navigeer
        public List<Product> ProductList { get; set; } = new List<Product>();
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; }
    }

    public class MyContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(
                "Server=localhost;Database=TestBase;User Id=Lemonademin;Password=MS!sql77;TrustServerCertificate=True;");

        }

        public DbSet<Auction> Auctions { get; set; }
        public DbSet<Auctioneer> Auctioneers { get; set; }
        public DbSet<Product> Products { get; set; }
    }
}
