using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace VeilingPlatform.Model
{
    public abstract class User : IdentityUser<int>
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public string Role => this.GetType().Name;  // Gives a role back "Customer", "Auctioneer", "Supplier"

    }
}