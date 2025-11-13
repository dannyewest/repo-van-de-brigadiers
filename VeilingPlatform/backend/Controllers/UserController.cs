using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeilingPlatform.Data;   
using VeilingPlatform.Model;

namespace VeilingPlatform.Controllers
{
    [ApiController]
    [Route("api")]
    public class UserController : ControllerBase
    {
        private readonly DbConnect _context;

        public UserController(DbConnect context)
        {
            _context = context;
        }

        [HttpPost("register/user")]
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

        [HttpGet("auctioneers")]
        public async Task<ActionResult<IEnumerable<Auctioneer>>> GetAuctioneers()
        {
            var auctioneers = await _context.Users
                .OfType<Auctioneer>()  
                .Select(a => new 
                {
                    a.ID,
                    a.Name,                  
                })
                .ToListAsync();

            return Ok(auctioneers);
        }

        [HttpGet("suppliers")]
        public async Task<ActionResult<IEnumerable<Supplier>>> GetSuppliers()
        {
            var suppliers = await _context.Users
                .OfType<Supplier>()   
                .Select(a => new 
                {
                    a.ID,
                    a.Name,                  
                })
                .ToListAsync();

            return Ok(suppliers);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == loginDto.Email.ToLower());

            if (user == null)
            {
                return Unauthorized(new { message = "Email does not exist" });
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password);

            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Password is incorrect" });
            }

            return Ok(new
            {
                message = "Login successful, you are being redirected to dashboard",
                user = new
                {
                    name = user.Name,
                    email = user.Email
                }
            });
        }
    }
}