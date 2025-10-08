using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class AuctionEventLog
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string auctioneer { get; set; } // Swap out string to Auctioneer
    public string auction { get; set; }// Swap out string to Auction
    public DateTime eventDateTime { get; set; }
    public string context { get; set; }
}