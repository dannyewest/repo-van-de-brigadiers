using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace VeilingPlatform.Model
{
    public abstract class User : IdentityUser<int>
    {
        [Required]
        public string Name { get; set; } = string.Empty; 
    }
}