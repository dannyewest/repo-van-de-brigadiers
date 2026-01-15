using System.Reflection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using Xunit;

namespace VeilingPlatform.Tests.Controllers
{
    public class UploadControllerTest
    {
        // Helper: Create fake IWebHostEnvironment with a temp wwwroot.
        private static IWebHostEnvironment CreateEnv(string webRootPath)
        {
            return new FakeWebHostEnvironment { WebRootPath = webRootPath };
        }

        // Helper: Create a unique temp folder per test.
        private static string CreateTempDir()
        {
            var dir = Path.Combine(
                Path.GetTempPath(),
                "VeilingPlatform_UploadTests",
                Guid.NewGuid().ToString()
            );
            Directory.CreateDirectory(dir);
            return dir;
        }

        // Helper: Create an IFormFile from bytes.
        private static IFormFile CreateFormFile(byte[] content, string fileName)
        {
            var stream = new MemoryStream(content);

            return new FormFile(stream, 0, content.Length, "file", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = "image/png",
            };
        }

        // Helper: Read anonymous object's property (like new { fileName = ... }).
        private static string GetAnonymousString(object obj, string propName)
        {
            var prop = obj.GetType()
                .GetProperty(propName, BindingFlags.Public | BindingFlags.Instance);
            Assert.NotNull(prop); // property should exist
            var value = prop!.GetValue(obj);
            Assert.NotNull(value); // value should not be null
            return value!.ToString()!;
        }

        [Fact]
        public async Task UploadProductImage_ReturnsBadRequest_WhenFileIsNull()
        {
            // ARRANGE: Create controller with a valid WebRootPath.
            var tempRoot = CreateTempDir();
            var env = CreateEnv(tempRoot);
            var controller = new UploadController(env);

            // ACT: Attempt upload without providing a file.
            var result = await controller.UploadProductImage(null!);

            // ASSERT: Upload should be rejected with BadRequest.
            var bad = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(bad.Value); // should contain error object
        }

        [Fact]
        public async Task UploadProductImage_ReturnsBadRequest_WhenFileIsEmpty()
        {
            // ARRANGE: Create controller and an empty file 
            var tempRoot = CreateTempDir();
            var env = CreateEnv(tempRoot);
            var controller = new UploadController(env);

            var emptyFile = CreateFormFile(Array.Empty<byte>(), "rose.png");

            // ACT: Attempt upload with an empty file
            var result = await controller.UploadProductImage(emptyFile);

            // ASSERT: Upload should be rejected with BadRequest.
            var bad = Assert.IsType<BadRequestObjectResult>(result);
            Assert.NotNull(bad.Value); // should contain error object
        }

        [Fact]
        public async Task UploadProductImage_SavesFileAndReturnsOk_WithFileName()
        {
            // ARRANGE: Create controller and a valid file to upload.
            var tempRoot = CreateTempDir();
            var env = CreateEnv(tempRoot);
            var controller = new UploadController(env);

            var bytes = new byte[] { 1, 2, 3, 4, 5 };
            var file = CreateFormFile(bytes, "tulip.png");

            // ACT: Upload a valid product image.
            var result = await controller.UploadProductImage(file);

            // ASSERT: Should return Ok with a generated fileName and the file should exist.
            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(ok.Value); // should contain response object

            var returnedFileName = GetAnonymousString(ok.Value!, "fileName");
            Assert.EndsWith(".png", returnedFileName); // extension should remain

            var expectedPath = Path.Combine(tempRoot, "flowers", returnedFileName);
            Assert.True(System.IO.File.Exists(expectedPath)); // file should be saved

            var savedBytes = await System.IO.File.ReadAllBytesAsync(expectedPath);
            Assert.Equal(bytes, savedBytes); // contents should match
        }

        [Fact]
        public async Task UploadProductImage_CreatesFlowersDirectory_WhenMissing()
        {
            // ARRANGE: Create controller where the flowers folder does not exist yet.
            var tempRoot = CreateTempDir();
            var flowersDir = Path.Combine(tempRoot, "flowers");

            if (Directory.Exists(flowersDir))
                Directory.Delete(flowersDir, true);

            var env = CreateEnv(tempRoot);
            var controller = new UploadController(env);

            var file = CreateFormFile(new byte[] { 9, 9, 9 }, "orchid.jpg");

            // ACT: Upload a file so the controller must create the folder.
            var result = await controller.UploadProductImage(file);

            // ASSERT: Should succeed and create the flowers directory.
            Assert.IsType<OkObjectResult>(result);
            Assert.True(Directory.Exists(flowersDir)); // folder should exist
        }

        [Fact]
        public async Task UploadProductImage_SanitizesFileName_ReplacesSpacesAndDoesNotReturnSlashes()
        {
            // ARRANGE: Create controller and a filename with spaces and path separators.
            var tempRoot = CreateTempDir();
            var env = CreateEnv(tempRoot);
            var controller = new UploadController(env);

            var fileWithSpaces = CreateFormFile(new byte[] { 1, 2 }, "my cool name.png");
            var fileWithPath = CreateFormFile(new byte[] { 3, 4 }, @"my cool\bad/name.png");

            // ACT: Upload files and receive generated safe fileName.
            var resultSpaces = await controller.UploadProductImage(fileWithSpaces);
            var resultPath = await controller.UploadProductImage(fileWithPath);

            // ASSERT: Spaces should become underscores and output should contain no slashes.
            var okSpaces = Assert.IsType<OkObjectResult>(resultSpaces);
            var returnedSpaces = GetAnonymousString(okSpaces.Value!, "fileName");

            Assert.EndsWith(".png", returnedSpaces); // extension should remain
            Assert.DoesNotContain(" ", returnedSpaces); // no spaces
            Assert.Contains("_my_cool_name", returnedSpaces); // spaces replaced with underscores

            var okPath = Assert.IsType<OkObjectResult>(resultPath);
            var returnedPath = GetAnonymousString(okPath.Value!, "fileName");

            Assert.EndsWith(".png", returnedPath); // file extension should exist
            Assert.DoesNotContain("/", returnedPath); // no forward slashes
            Assert.DoesNotContain("\\", returnedPath); // no backslashes
            Assert.Contains("_name", returnedPath); 

            var expectedPath1 = Path.Combine(tempRoot, "flowers", returnedSpaces);
            var expectedPath2 = Path.Combine(tempRoot, "flowers", returnedPath);

            Assert.True(System.IO.File.Exists(expectedPath1)); // file should be saved
            Assert.True(System.IO.File.Exists(expectedPath2)); // file should be saved
        }

        // minimal fake IWebHostEnvironment for controller tests.
        private class FakeWebHostEnvironment : IWebHostEnvironment
        {
            public string ApplicationName { get; set; } = "VeilingPlatform.Tests";
            public IFileProvider WebRootFileProvider { get; set; } = default!;
            public string WebRootPath { get; set; } = default!;
            public string EnvironmentName { get; set; } = "Development";
            public string ContentRootPath { get; set; } = "";
            public IFileProvider ContentRootFileProvider { get; set; } = default!;
        }
    }
}
