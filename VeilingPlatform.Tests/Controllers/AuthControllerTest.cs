using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using VeilingPlatform.Controllers;
using VeilingPlatform.Model;
using Xunit;

namespace VeilingPlatform.Tests.Controllers
{
    public class AuthControllerTest
    {
        // Helper: Mock UserManager
        private Mock<UserManager<User>> CreateUserManagerMock()
        {
            var store = new Mock<IUserStore<User>>();
            return new Mock<UserManager<User>>(
                store.Object,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            );
        }

        // Helper: Fake JWT configuration
        private IConfiguration CreateJwtConfig()
        {
            var settings = new Dictionary<string, string>
            {
                { "Jwt:Key", "super_key_1020394754939_test_test" }, // 32+ 'hash' char
                { "Jwt:Issuer", "TestIssuer" },
            };

            return new ConfigurationBuilder().AddInMemoryCollection(settings).Build();
        }

        // POST /register/user
        [Fact]
        public async Task Register_ReturnsConflict_WhenEmailAlreadyExists()
        {
            // ARRANGE: Mock UserManager and AuthController
            // email already exists in the system.
            var userManagerMock = CreateUserManagerMock();
            var controller = new AuthController(userManagerMock.Object, CreateJwtConfig());

            // UserManager should return a existing user for any email.
            userManagerMock
                .Setup(u => u.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(TestDataFactory.CreateCustomer());

            // ACT: Attempt to register an email that already exists.
            var result = await controller.Register(TestDataFactory.CreateValidUserDto());

            // ASSERT: Controller returns a HTTP conflict. (409)
            Assert.IsType<ConflictObjectResult>(result);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenCreateFails()
        {
            // ARRANGE: Mock UserManager and AuthController
            // email does not exist, but user creation fails.
            var userManagerMock = CreateUserManagerMock();
            var controller = new AuthController(userManagerMock.Object, CreateJwtConfig());

            // no existing user found for given email.
            userManagerMock
                .Setup(u => u.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((User)null);

            // UserManager fails during creation.
            userManagerMock
                .Setup(u => u.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Failed());

            // ACT: attempt to register new user.
            var result = await controller.Register(TestDataFactory.CreateValidUserDto());

            // ASSERT: Controller returns bad request (400)
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Register_ReturnsOk_WhenSuccessful()
        {
            // ARRANGE: Mock UserManager and AuthController
            // succesful registration
            var userManagerMock = CreateUserManagerMock();
            var controller = new AuthController(userManagerMock.Object, CreateJwtConfig());

            // No existing user found by email given
            userManagerMock
                .Setup(u => u.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((User)null);

            // User creation goes through.
            userManagerMock
                .Setup(u => u.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);

            // ACT: Attempt to create new user.
            var result = await controller.Register(TestDataFactory.CreateValidUserDto());

            // ASSERT: Expected to return Ok. (200)
            Assert.IsType<OkObjectResult>(result);
        }

        // POST /login
        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenEmailDoesNotExist()
        {
             // ARRANGE: Mock UserManager and AuthController
             // login attempt with invalid email
            var userManagerMock = CreateUserManagerMock();
            var controller = new AuthController(userManagerMock.Object, CreateJwtConfig());

            // UserManager returns null -> email not found.
            userManagerMock
                .Setup(u => u.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((User)null);

            // ACT: Attempt to login with invalid email.
            var result = await controller.Login(TestDataFactory.CreateValidLoginDto());

            // ASSERT: Controller return unauthorized (401)
            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenPasswordIncorrect()
        {
            // ARRANGE: Create a valid existing user.
            var user = TestDataFactory.CreateCustomer();
            var userManagerMock = CreateUserManagerMock();

            // Email exists in system
            userManagerMock.Setup(u => u.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync(user);

            // Password check fails.
            userManagerMock
                .Setup(u => u.CheckPasswordAsync(user, It.IsAny<string>()))
                .ReturnsAsync(false);

            var controller = new AuthController(userManagerMock.Object, CreateJwtConfig());

            // ACT: Attempt to login with incorrect password
            var result = await controller.Login(TestDataFactory.CreateValidLoginDto());

            // ASSERT: Login should be rejected.
            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Login_ReturnsOk_WhenSuccessful()
        {
            // ARRANGE: Create a valid existing user.
            var user = TestDataFactory.CreateCustomer();
            var userManagerMock = CreateUserManagerMock();

            // email exists.
            userManagerMock.Setup(u => u.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync(user);

            // password succeeds.
            userManagerMock
                .Setup(u => u.CheckPasswordAsync(user, It.IsAny<string>()))
                .ReturnsAsync(true);

            var controller = new AuthController(userManagerMock.Object, CreateJwtConfig());

            // ACT: Attempt to login with valid user.
            var result = await controller.Login(TestDataFactory.CreateValidLoginDto());

            // ASSERT: Expected to login with OK (200)
            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(ok.Value);
        }

        // POST /logout
        [Fact]
        public void Logout_ReturnsOk()
        {
            // ARRANGE: Create controller with mock dependecies
            var controller = new AuthController(CreateUserManagerMock().Object, CreateJwtConfig());

            // ACT: Call logout endpoint
            var result = controller.Logout();

            // ASSERT: Logout always returns OK (200) with confirmation message.
            Assert.IsType<OkObjectResult>(result);
        }
    }
}
