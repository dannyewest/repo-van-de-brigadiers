using System;
using System.Data.SqlClient;
using System.Security.Cryptography.Pkcs;
using System.Threading.Channels;
using Microsoft.Data.SqlClient;

namespace sql
{
    public static class SqlAzureConnector
    {
        private const string your_password = "MS!sql77";

        private const string connectionString =
                "Server=tcp:jv-hhs.database.windows.net,1433;"
                + "Initial Catalog=TestBase;"
                + "Persist Security Info=False;"
                + "User ID=Lemonademin;"
                + $"Password={your_password};"
                + "MultipleActiveResultSets=False;"
                + "Encrypt=True;"
                + "TrustServerCertificate =False;"
                + "Connection Timeout=30;";

        private static SqlConnection ConnectToSQL()
        {
            SqlConnection connection = new SqlConnection(connectionString);
            return connection;
        }
    }
}