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
    }

    public class CreateAuctionDto
    {
        public int AuctioneerId { get; set; }

        public DateTime StartsAt { get; set; }
        public DateTime EndsAt   { get; set; }

        public string Status { get; set; } = "Scheduled";

        public List<int> ProductIds { get; set; } = new();
    }

    public class UpdateAuctionDto
    {
        public int AuctioneerId { get; set; }

        public DateTime StartsAt { get; set; }
        public DateTime EndsAt   { get; set; }

        public string Status { get; set; } = "Scheduled";

        public List<int> ProductIds { get; set; } = new();
    }
}
