using VeilingPlatform.Model.Dto;
using Microsoft.Data.SqlClient;
using System.Data;

namespace VeilingPlatform.Data;

public class ProductHistory
{
    private readonly string _connectionString;

    // Constructor ontvangt de connection string
    public ProductHistory(string connectionString)
    {
        _connectionString = connectionString;
    }

    // Getting the average price of the current supplier
    public decimal GetAveragePriceForSupplier(int productId, string supplier)
    {
        using var conn = new SqlConnection(_connectionString);
        conn.Open();

        using var cmd = new SqlCommand(@"
            SELECT AVG(ps.PriceSold)
            FROM ProductSold ps
            JOIN Products p ON p.Id = ps.ProductId
            WHERE ps.ProductId = @productId
              AND p.Supplier = @supplier", conn);

        cmd.Parameters.Add("@productId", SqlDbType.Int).Value = productId;
        cmd.Parameters.Add("@supplier", SqlDbType.NVarChar).Value = supplier;

        var result = cmd.ExecuteScalar();
        return result == DBNull.Value ? 0 : Convert.ToDecimal(result);
    }

    // Getting the last 10 prices of the current supplier
    public List<PriceHistoryDto> GetLastForSupplier(int productId, string supplier)
    {
        var result = new List<PriceHistoryDto>();

        using var conn = new SqlConnection(_connectionString);
        conn.Open();

        using var cmd = new SqlCommand(@"
            SELECT TOP 10 ps.DateSold, ps.PriceSold
            FROM ProductSold ps
            JOIN Products p ON p.Id = ps.ProductId
            WHERE ps.ProductId = @productId
              AND p.Supplier = @supplier
            ORDER BY ps.DateSold DESC", conn);

        cmd.Parameters.Add("@productId", SqlDbType.Int).Value = productId;
        cmd.Parameters.Add("@supplier", SqlDbType.NVarChar).Value = supplier;

        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            result.Add(new PriceHistoryDto
            {
                Date = reader.GetDateTime(0),
                Price = reader.IsDBNull(1) ? 0 : reader.GetDecimal(1)
            });
        }

        return result;
    }

    // Getting the average price of all suppliers
    public decimal GetAveragePriceAllSuppliers(int productId)
    {
        using var conn = new SqlConnection(_connectionString);
        conn.Open();

        using var cmd = new SqlCommand(@"
            SELECT AVG(PriceSold)
            FROM ProductSold
            WHERE ProductId = @productId", conn);

        cmd.Parameters.Add("@productId", SqlDbType.Int).Value = productId;

        var result = cmd.ExecuteScalar();
        return result == DBNull.Value ? 0 : Convert.ToDecimal(result);
    }

    // Getting the last 10 prices of all suppliers
    public List<PriceHistoryAllDto> GetLastOfAllSuppliers(int productId)
    {
        var result = new List<PriceHistoryAllDto>();

        using var conn = new SqlConnection(_connectionString);
        conn.Open();

        using var cmd = new SqlCommand(@"
            SELECT TOP 10 p.Supplier, ps.DateSold, ps.PriceSold
            FROM ProductSold ps
            JOIN Products p ON p.Id = ps.ProductId
            WHERE ps.ProductId = @productId
            ORDER BY ps.DateSold DESC", conn);

        cmd.Parameters.Add("@productId", SqlDbType.Int).Value = productId;

        using var reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            result.Add(new PriceHistoryAllDto
            {
                Supplier = reader.IsDBNull(0) ? "" : reader.GetString(0),
                Date = reader.IsDBNull(1) ? DateTime.MinValue : reader.GetDateTime(1),
                Price = reader.IsDBNull(2) ? 0 : reader.GetDecimal(2)
            });
        }

        return result;
    }
}