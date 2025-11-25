using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    public UploadController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpPost("product-image")]
    public async Task<IActionResult> UploadProductImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "No file uploaded" });

        var uploadRoot = Path.Combine(_env.WebRootPath ?? "wwwroot", "flowers");
        if (!Directory.Exists(uploadRoot))
            Directory.CreateDirectory(uploadRoot);

        var ext = Path.GetExtension(file.FileName).ToLower();

        // Create unique GUID, no double filenames
        var guid = Guid.NewGuid().ToString();
        var safeOriginal = Path.GetFileNameWithoutExtension(file.FileName)
                                    .Replace(" ", "_")
                                    .Replace("/", "_")
                                    .Replace("\\", "_");
        
        var finalFileName = $"{guid}_{safeOriginal}{ext}";

        var filePath = Path.Combine(uploadRoot, finalFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Ok(new { fileName = finalFileName });
    }

}
