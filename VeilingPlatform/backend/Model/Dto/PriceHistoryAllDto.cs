using System;

namespace VeilingPlatform.Model.Dto
{
    public class PriceHistoryAllDto
    {
        public string Supplier { get; set; }
        public DateTime Date { get; set; }
        public decimal Price { get; set; }
    }
}