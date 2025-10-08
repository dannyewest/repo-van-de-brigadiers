using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Model;
namespace VeilingPlatform.dbcontext
{
    public class DbConnect : DbContext
    {
        public DbConnect(DbContextOptions<DbConnect> options) : base(options) { }
        public DbSet<Auction> Auctions { get; set; }
        public DbSet<Auctioneer> Auctioneers { get; set; }
        public DbSet<Product> Products { get; set; }
    }
}