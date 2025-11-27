using System;
using System.Collections.Generic;

namespace VeilingPlatform.Model.Dto
{
    public class AuctionDashboardDto
    {
        public int Id { get; set; }
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<AuctionDashboardProductDto> Products { get; set; } = new();
    }

    public class AuctionDashboardProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal BasePrice { get; set; }
        public string? ImageUrl { get; set; }
        public string? ImageAlt { get; set; }
    }
}
