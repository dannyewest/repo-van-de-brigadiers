using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Model;
using System.Linq;

namespace VeilingPlatform.Data
{
    public class DbConnect : DbContext
    {
        public DbConnect(DbContextOptions<DbConnect> options) : base(options) { }

        public DbSet<Auction> Auctions { get; set; }
        public DbSet<Auctioneer> Auctioneers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<ProductSold> ProductSolds { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<AuctionEventLog> AuctionEventLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            // Alle relaties default op restrict i.p.v cascade
            foreach (var relationship in modelBuilder.Model
                         .GetEntityTypes()
                         .SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }
    }
}
