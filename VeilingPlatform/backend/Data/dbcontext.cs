using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Model;
using System.Linq;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace VeilingPlatform.Data
{
    public class DbConnect : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public DbConnect(DbContextOptions<DbConnect> options) : base(options) { }

        public DbSet<Auction> Auctions { get; set; }
        public DbSet<Auctioneer> Auctioneers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<ProductSold> ProductSolds { get; set; }
        
        public DbSet<AuctionEventLog> AuctionEventLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(b =>
            {
                b.ToTable("Users");

                // Map the IdentityUser<int>.Id property to  ID column in the database
                b.Property(u => u.Id).HasColumnName("ID");
            });


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
