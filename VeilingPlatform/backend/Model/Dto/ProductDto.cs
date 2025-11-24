using System;
using System.ComponentModel.DataAnnotations;

namespace VeilingPlatform.Model.Dto
{
    public class ProductDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Naam is leeg")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Type is leeg")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "Potmaat is leeg")]
        public string PotSize { get; set; } = string.Empty;

        [Required(ErrorMessage = "Lengte is niet ingevuld")]
        public double Length { get; set; }

        [Required(ErrorMessage = "Aantal is niet ingevuld")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Prijs is niet ingevuld")]
        public decimal BasePrice { get; set; }

        [Required(ErrorMessage = "Leverancier is leeg")]
        public string Supplier { get; set; } = string.Empty;

        [Required(ErrorMessage = "Veilingdatum is niet ingevuld")]
        public DateTime AuctionDate { get; set; }

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

        [Required(ErrorMessage = "Supplier is empty")]
        public string Supplier { get; set; } = string.Empty;

        [Required(ErrorMessage = "No AuctionDate")]
        public DateTime AuctionDate { get; set; }


        public string Image { get; set; }
        public string? ImageAlt { get; set; }

    }
}
