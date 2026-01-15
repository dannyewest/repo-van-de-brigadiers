using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using Xunit;
using VeilingPlatform.Controllers;

namespace VeilingPlatform.Tests.Controllers
{
    public class ProductHistoryControllerTest
    {
        [Fact]
        public void ProductHistoryController_HasApiController_AndCorrectRoute()
        {
            // ARRANGE: Get controller type and its attributes.
            var type = typeof(ProductHistoryController);

            // ACT: Read attributes from controller.
            var apiControllerAttr = type.GetCustomAttributes(typeof(ApiControllerAttribute), inherit: true).FirstOrDefault();
            var routeAttr = type.GetCustomAttributes(typeof(RouteAttribute), inherit: true).Cast<RouteAttribute>().FirstOrDefault();

            // ASSERT: Controller should have [ApiController] and route "api/product-history".
            Assert.NotNull(apiControllerAttr); // should be ApiController
            Assert.NotNull(routeAttr); // should have RouteAttribute
            Assert.Equal("api/product-history", routeAttr!.Template); // route should match
        }

        [Fact]
        public void GetHistory_HasHttpGet_WithProductIdRoute()
        {
            // ARRANGE: Get GetHistory method.
            var method = typeof(ProductHistoryController).GetMethod("GetHistory");
            Assert.NotNull(method); // method should exist

            // ACT: Read HttpGet attribute.
            var httpGetAttr = method!.GetCustomAttributes(typeof(HttpGetAttribute), inherit: true)
                .Cast<HttpGetAttribute>()
                .FirstOrDefault();

            // ASSERT: Method should have [HttpGet("{productId}")].
            Assert.NotNull(httpGetAttr); // should have HttpGet
            Assert.Equal("{productId}", httpGetAttr!.Template); // template should match
        }

        [Fact]
        public void GetHistory_SupplierParameter_IsFromQuery()
        {
            // ARRANGE: Get GetHistory method parameters.
            var method = typeof(ProductHistoryController).GetMethod("GetHistory");
            Assert.NotNull(method); // method should exist

            // ACT: Find 'supplier' parameter and read its attributes.
            var supplierParam = method!.GetParameters().FirstOrDefault(p => p.Name == "supplier");
            Assert.NotNull(supplierParam); // supplier parameter should exist

            var fromQueryAttr = supplierParam!.GetCustomAttributes(typeof(FromQueryAttribute), inherit: true).FirstOrDefault();

            // ASSERT: supplier should be [FromQuery].
            Assert.NotNull(fromQueryAttr); // should have FromQueryAttribute
        }
    }
}
