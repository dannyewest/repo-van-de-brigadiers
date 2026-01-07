using Microsoft.AspNetCore.Mvc;
using VeilingPlatform.Data;

namespace VeilingPlatform.Controllers
{
    [ApiController]
    [Route("api/product-history")]
    public class ProductHistoryController : ControllerBase
    {
        private readonly ProductHistory _repo;

        public ProductHistoryController(ProductHistory repo)
        {
            _repo = repo;
        }

        [HttpGet("{productId}")]
        public IActionResult GetHistory(int productId, [FromQuery] string supplier)
        {
            var supplierHistory = _repo.GetLastForSupplier(productId, supplier);
            var averageSupplierPrice = _repo.GetAveragePriceForSupplier(productId, supplier);
            var allHistory = _repo.GetLastOfAllSuppliers(productId);
            var averageAllPrice = _repo.GetAveragePriceAllSuppliers(productId);

            return Ok(new
            {
                supplierHistory,
                averageSupplierPrice,
                allHistory,
                averageAllPrice
            });
        }
    }
}