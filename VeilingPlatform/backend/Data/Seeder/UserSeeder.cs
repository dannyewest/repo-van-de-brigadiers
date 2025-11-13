using VeilingPlatform.Model;

namespace VeilingPlatform.Data
{
    public static class UserSeeder
    {
        public static void Seed(DbConnect context)
        {
            var users = new List<User>
            {
                new Customer
                {
                    Name = "Alice",
                    Email = "alice@example.com",
                    Password = "password123"
                },
                new Auctioneer
                {
                    Name = "Bob",
                    Email = "bob@example.com",
                    Password = "password123"
                },
                new Auctioneer
                {
                    Name = "David",
                    Email = "david@example.com",
                    Password = "password123"
                },
                new Supplier
                {
                    Name = "Charlie",
                    Email = "charlie@example.com",
                    Password = "password123",
                    CompanyName = "Charlie Supplies"
                },
                new Supplier
                {
                    Name = "Eve",
                    Email = "eve@example.com",
                    Password = "password123",
                    CompanyName = "Eve Enterprises"
                }
            };

            context.Users.AddRange(users);
            context.SaveChanges();
        }
    }
}