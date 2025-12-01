namespace VeilingPlatform.Model
{
    public class Customer : User
    {
        public Customer()
        {
            UserRole = "Customer";
        }

        public string UserRole { get; }
    }
}
