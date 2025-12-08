using System;
using System.ComponentModel.DataAnnotations;

namespace VeilingPlatform.Model.Dto
{
    public class ProductDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is empty")]
        public string Name { get; set; } = default!;

        [Required(ErrorMessage = "Type is empty")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "PotSize is empty")]
        public string PotSize { get; set; } = string.Empty;

        [Required(ErrorMessage = "Length is empty")]
        public double Length { get; set; }

        [Required(ErrorMessage = "Quantity is empty")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "BasePrice is empty")]
        public decimal BasePrice { get; set; }

        [Required(ErrorMessage = "Supplier is empty")]
        public string Supplier { get; set; } = string.Empty;

        [Required(ErrorMessage = "AuctionDate is empty")]
        public DateTime AuctionDate { get; set; }

        [Required(ErrorMessage = "AuctionId is empty")]
        public int? AuctionId { get; set; }

        public string? Image { get; set; }
        public string? ImageAlt { get; set; }
    }

    public class ProductSupplierDto
    {

        public int Id { get; set; }

        [Required(ErrorMessage = "Name is empty")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Type is empty")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "PotSize is empty")]
        public string PotSize { get; set; } = string.Empty;

        [Required(ErrorMessage = "Length is empty")]
        public double Length { get; set; }

        [Required(ErrorMessage = "Quantity is empty")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "BasePrice is empty")]
        public decimal BasePrice { get; set; }
        public string Supplier { get; set; } = string.Empty;

        [Required(ErrorMessage = "No AuctionDate")]
        public DateTime AuctionDate { get; set; }


        public string Image { get; set; }
        public string? ImageAlt { get; set; }


    }

    public class SimpleProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? ImageUrl { get; set; }
        public string? ImageAlt { get; set; }
        public decimal BasePrice { get; set; }
    }

}
