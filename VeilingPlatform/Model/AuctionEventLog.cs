namespace VeilingPlatform.Model;
using System.ComponentModel.DataAnnotations;

public class AuctionEventLog
{
    [Key]
    public int Id { get; set; }
    public string auctioneer { get; set; } // Swap out string to Auctioneer
    public string auction { get; set; }// Swap out string to Auction
    public DateTime eventDateTime { get; set; } = DateTime.Now;
    public string context { get; set; }
}