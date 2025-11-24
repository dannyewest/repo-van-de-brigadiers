namespace VeilingPlatform.Model;

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Product
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    [MaxLength(50)]
    public string Type { get; set; }

    public string PotSize { get; set; }

    public int Length { get; set; }

    public int Quantity { get; set; }


    [Column(TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }

    [Required]
    [MaxLength(100)]
    public string Supplier { get; set; }

    public DateTime AuctionDate { get; set; }

    public int? AuctionId { get; set; }

    [ForeignKey("AuctionId")]
    public Auction Auction { get; set; }
}