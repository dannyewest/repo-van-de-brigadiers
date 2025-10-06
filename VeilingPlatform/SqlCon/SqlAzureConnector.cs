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

        private static List<Fruit> CreateCommand(string queryString)
        {
            var teams = new List<Fruit>();

            try
            {
                var connection = ConnectToSQL();
                connection.Open();

                using (var command = new SqlCommand(queryString, connection))
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        int r1 = reader.GetFieldValue<int>(0);
                        string r2 = reader.GetFieldValue<string>(1);
                        string r3 = reader.GetFieldValue<string>(2);
                        decimal r4 = reader.GetFieldValue<decimal>(3);
                        int r5 = reader.GetFieldValue<int>(4);

                        teams.Add(new Fruit(r1, r2, r3, r4, r5));
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            return teams;
        }

        /*private static T GetValueOrDefault<T>(SqlDataReader reader, int index, T defaultValue)
        {
            return reader.IsDBNull(index) ? defaultValue : reader.GetFieldValue<T>(index);
        }*/

        public static void DoAQuery()
        {
            string queryString = "select * from dbo.fruit;";
            List<Fruit> fruits = CreateCommand(queryString);

            foreach (var fruit in fruits)
            {
                Console.WriteLine($"{fruit.Id} | {fruit.Naam} | {fruit.Kleur} | {fruit.Gewicht} | {fruit.Zoetheid}");
            }
        }
    }
}