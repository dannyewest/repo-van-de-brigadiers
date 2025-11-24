using System;
using System.ComponentModel.DataAnnotations;

namespace VeilingPlatform.Model.Dto
{
    public class AuctionProductsDto
    {
        [Required]
        public int OriginalId { get; set; }
        [Required]
        public int Id { get; set; }
        [Required(ErrorMessage = "Name is empty")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Type is empty")]
        public string Type { get; set; }

        [Required(ErrorMessage = "PotSize is empty")]
        public string PotSize { get; set; }

        [Required(ErrorMessage = "Length is not filled in")]
        public int Length { get; set; }

        [Required(ErrorMessage = "Quantity is not filled in")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Price is not filled in")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Supplier is not filled in")]
        public string Supplier { get; set; }

        [Required(ErrorMessage = "AuctionDate is not filled in")]
        public DateTime AuctionDate { get; set; }
    }
}