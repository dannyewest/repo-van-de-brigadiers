using System;
using System.ComponentModel.DataAnnotations;

namespace VeilingPlatform.Model.Dto
{
    public class ProductDto
    {
        public int Id { get; set; } 

        [Required(ErrorMessage = "Naam is leeg")]
        public string Name { get; set; } = default!;

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

        [Required(ErrorMessage = "AuctionId is niet ingevuld")]
        public int? AuctionId { get; set; }
    }

    public class SimpleProductDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
    }
}
