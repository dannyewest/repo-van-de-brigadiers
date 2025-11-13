using System;
using System.Collections.Generic;

namespace VeilingPlatform.Model.Dto
{
    public class AuctionDto
    {
        public int Id { get; set; }
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }
        public string Status { get; set; } = "Scheduled";
        public List<ProductDto> Products { get; set; } = new();
    }

    public class CreateAuctionDto
    {
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }
        public string? Status { get; set; }
    }

    public class UpdateAuctionDto
    {
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }
        public string Status { get; set; } = "Scheduled";
    }
}
