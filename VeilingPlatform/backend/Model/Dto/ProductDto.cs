using System;
using System.ComponentModel.DataAnnotations;

namespace VeilingPlatform.Model.Dto
{
    public class ProductDto
    {
        [Required(ErrorMessage = "Naam is leeg")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Type is leeg")]
        public string Type { get; set; }

        [Required(ErrorMessage = "Potmaat is leeg")]
        public string PotSize { get; set; }

        [Required(ErrorMessage = "Lengte is niet ingevuld")]
        public int Length { get; set; }

        [Required(ErrorMessage = "Aantal is niet ingevuld")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Prijs is niet ingevuld")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Leverancier is leeg")]
        public string Supplier { get; set; }

        [Required(ErrorMessage = "Veilingdatum is niet ingevuld")]
        public DateTime AuctionDate { get; set; }

        [Required(ErrorMessage = "AuctionId is niet ingevuld")]
        public int AuctionId { get; set; }
    }
}