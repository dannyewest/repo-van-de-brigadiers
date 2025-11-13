using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Data;   
using VeilingPlatform.Model;

namespace VeilingPlatform.Controllers
{
    [ApiController]
    [Route("api/register")]
    public class UserController : ControllerBase
    {
        private readonly DbConnect _context;

        public UserController(DbConnect context)
        {
            _context = context;
        }

        [HttpPost("user")]
        public async Task<IActionResult> CreateUser(UserDto userDto)
        {
            var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == userDto.Email.ToLower());

            if (existingUser != null)
            {
                return Conflict(new { message = "Email already exists. Please use another email." });
            }
    
            var user = new Customer
            {
                Name = userDto.Name,
                Email = userDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "You have successfully signed up! You are being redirected to the login page." });
        }
    }
}