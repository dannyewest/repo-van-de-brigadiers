using System;
using System.Collections.Generic;

namespace VeilingPlatform.Model.Dto
{
    public class AuctionDto
    {
        public int Id { get; set; }

        public DateTime StartsAt { get; set; }
        public DateTime EndsAt   { get; set; }

        public string Status { get; set; } = string.Empty;

        public AuctioneerDto Auctioneer { get; set; }
        public List<SimpleProductDto> Products { get; set; } = new();
        public List<AuctionDashboardProductDto> DashboardProducts { get; set; } = new();
    }

    public class CreateAuctionDto
    {
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }
        public string Status { get; set; }
        public int AuctioneerId { get; set; }
        public List<AuctionProductInputDto> Products { get; set; } = new();
    }

    public class UpdateAuctionDto
    {
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }
        public string Status { get; set; }
        public int AuctioneerId { get; set; }
        public List<AuctionProductInputDto> Products { get; set; } = new();
}

}
